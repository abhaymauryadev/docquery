import OpenAI from "openai";

const EMBEDDING_DIMENSION = 1024;

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  if (process.env.VOYAGE_API_KEY) {
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "voyage-3",
        input: texts,
        input_type: "document",
      }),
    });

    if (!response.ok) {
      throw new Error(`Voyage embedding failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      data: { embedding: number[] }[];
    };
    return data.data.map((d) => d.embedding);
  }

  if (process.env.OPENAI_API_KEY) {
    const client = getOpenAI();
    const response = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: texts,
      dimensions: EMBEDDING_DIMENSION,
    });
    return response.data.map((d) => d.embedding);
  }

  throw new Error("No embedding provider configured. Set VOYAGE_API_KEY or OPENAI_API_KEY.");
}

export async function embedQuery(text: string): Promise<number[]> {
  if (process.env.VOYAGE_API_KEY) {
    const response = await fetch("https://api.voyageai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      },
      body: JSON.stringify({
        model: "voyage-3",
        input: [text],
        input_type: "query",
      }),
    });

    if (!response.ok) {
      throw new Error(`Voyage embedding failed: ${response.statusText}`);
    }

    const data = (await response.json()) as {
      data: { embedding: number[] }[];
    };
    return data.data[0].embedding;
  }

  const [embedding] = await embedTexts([text]);
  return embedding;
}

export { EMBEDDING_DIMENSION };
