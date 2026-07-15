const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";
// gemini-2.5-flash stopped serving new API keys 2026-07-09, ahead of its Oct shutdown;
// gemini-3.5-flash is the current default.
const GEMINI_CHAT_MODEL = process.env.GEMINI_CHAT_MODEL ?? "gemini-3.5-flash";
// text-embedding-004 was shut down 2026-01-14; gemini-embedding-001 is the replacement.
// It truncates to any outputDimensionality (not just 768/1536/3072) via MRL, so 1024
// still works and matches the existing vector(1024) column.
const GEMINI_EMBEDDING_MODEL = "gemini-embedding-001";

type GeminiTaskType =
  | "RETRIEVAL_DOCUMENT"
  | "RETRIEVAL_QUERY"
  | "SEMANTIC_SIMILARITY"
  | "CLASSIFICATION"
  | "CLUSTERING";

type GeminiEmbeddingResponse = {
  embedding?: { values?: number[] };
};

type GeminiBatchEmbeddingResponse = {
  embeddings?: { values?: number[] }[];
};

type GeminiGenerateResponse = {
  candidates?: {
    content?: { parts?: { text?: string }[] };
  }[];
  promptFeedback?: { blockReason?: string };
};

function getGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key) {
    throw new Error("Gemini is not configured. Set GEMINI_API_KEY.");
  }
  return key;
}

async function geminiFetch<T>(
  path: string,
  body: Record<string, unknown>,
): Promise<T> {
  const normalizedPath = path.replace(/^\/+/, "");
  const url = `${GEMINI_API_BASE}/models/${normalizedPath}?key=${encodeURIComponent(getGeminiKey())}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${detail}`);
  }

  return response.json() as Promise<T>;
}

export async function embedWithGemini(
  texts: string[],
  task: GeminiTaskType,
  dimensions: number,
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const BATCH_SIZE = 100;
  const results: number[][] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const chunk = texts.slice(i, i + BATCH_SIZE);

    if (chunk.length === 1) {
      const embedding = await embedSingle(chunk[0], task, dimensions);
      results.push(embedding);
    } else {
      const embeddings = await embedBatch(chunk, task, dimensions);
      results.push(...embeddings);
    }
  }

  return results;
}

async function embedSingle(
  text: string,
  task: GeminiTaskType,
  dimensions: number,
): Promise<number[]> {
  const data = await geminiFetch<GeminiEmbeddingResponse>(
    `${GEMINI_EMBEDDING_MODEL}:embedContent`,
    {
      model: `models/${GEMINI_EMBEDDING_MODEL}`,
      content: { parts: [{ text }] },
      taskType: task,
      outputDimensionality: dimensions,
    },
  );

  const embedding = data.embedding?.values ?? [];
  if (embedding.length !== dimensions) {
    throw new Error("Gemini returned embeddings with an unexpected dimension.");
  }

  return embedding;
}

async function embedBatch(
  texts: string[],
  task: GeminiTaskType,
  dimensions: number,
): Promise<number[][]> {
  const data = await geminiFetch<GeminiBatchEmbeddingResponse>(
    `${GEMINI_EMBEDDING_MODEL}:batchEmbedContents`,
    {
      requests: texts.map((text) => ({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        taskType: task,
        outputDimensionality: dimensions,
      })),
    },
  );

  const embeddings = (data.embeddings ?? []).map((embedding) => embedding.values ?? []);
  if (embeddings.length !== texts.length) {
    throw new Error("Gemini returned an incomplete embedding response.");
  }
  if (embeddings.some((embedding) => embedding.length !== dimensions)) {
    throw new Error("Gemini returned embeddings with an unexpected dimension.");
  }

  return embeddings;
}

export async function generateWithGemini(
  systemInstruction: string,
  prompt: string,
  options: { temperature: number; responseMimeType?: string },
): Promise<string> {
  const data = await geminiFetch<GeminiGenerateResponse>(
    `${GEMINI_CHAT_MODEL}:generateContent`,
    {
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature,
        ...(options.responseMimeType
          ? { responseMimeType: options.responseMimeType }
          : {}),
      },
    },
  );

  const text = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();
  if (!text) {
    const reason = data.promptFeedback?.blockReason;
    throw new Error(reason ? `Gemini blocked the prompt: ${reason}` : "Gemini returned no text.");
  }

  return text;
}
