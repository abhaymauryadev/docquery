import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { embedQuery, embedTexts } from "@/lib/rag/embeddings";
import {
  chunkDocument,
  computeConfidence,
  findSentenceBounds,
} from "@/lib/rag/chunking";
import { parseDocument } from "@/lib/rag/parser";
import { downloadFile } from "@/lib/storage";
import { generateWithGemini } from "@/lib/gemini";
import type { Citation, RetrievedChunk } from "@/types";
import OpenAI from "openai";

const TOP_K = 8;

export async function processDocument(documentId: string): Promise<void> {
  const document = await db.document.findUnique({
    where: { id: documentId },
  });

  if (!document || document.deletedAt) return;

  await db.document.update({
    where: { id: documentId },
    data: { status: "PROCESSING" },
  });

  try {
    const buffer = await downloadFile(document.fileUrl);
    const parsed = await parseDocument(buffer, document.fileType);
    const textChunks = chunkDocument(parsed);

    if (textChunks.length === 0) {
      throw new Error("No content could be extracted from this document.");
    }

    await db.chunk.deleteMany({ where: { documentId } });

    const batchSize = 20;
    for (let i = 0; i < textChunks.length; i += batchSize) {
      const batch = textChunks.slice(i, i + batchSize);
      const embeddings = await embedTexts(batch.map((c) => c.content));

      const values = batch.map((chunk, j) => {
        const vectorStr = `[${embeddings[j].join(",")}]`;

        return Prisma.sql`(
          ${`chunk_${documentId}_${i + j}`},
          ${documentId},
          ${chunk.content},
          ${vectorStr}::vector,
          ${chunk.pageNumber},
          ${chunk.charStart},
          ${chunk.charEnd},
          NOW()
        )`;
      });

      await db.$executeRaw(
        Prisma.sql`
          INSERT INTO "Chunk" ("id", "documentId", "content", "embedding", "pageNumber", "charStart", "charEnd", "createdAt")
          VALUES ${Prisma.join(values)}
        `,
      );
    }

    await db.document.update({
      where: { id: documentId },
      data: {
        status: "READY",
        pageCount: parsed.pages.length,
        failureReason: null,
      },
    });

    await db.auditLog.create({
      data: {
        workspaceId: document.workspaceId,
        actorId: document.uploadedById,
        action: "DOCUMENT_INDEXED",
        targetType: "Document",
        targetId: documentId,
        metadata: { pageCount: parsed.pages.length, chunkCount: textChunks.length },
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown processing error";

    await db.document.update({
      where: { id: documentId },
      data: { status: "FAILED", failureReason: message },
    });
  }
}

export async function searchChunks(
  workspaceId: string,
  queryEmbedding: number[],
): Promise<RetrievedChunk[]> {
  const vectorStr = `[${queryEmbedding.join(",")}]`;

  const results = await db.$queryRaw<
    {
      id: string;
      documentId: string;
      content: string;
      pageNumber: number;
      charStart: number;
      charEnd: number;
      similarity: number;
      filename: string;
    }[]
  >`
    SELECT
      c."id",
      c."documentId",
      c."content",
      c."pageNumber",
      c."charStart",
      c."charEnd",
      1 - (c."embedding" <=> ${vectorStr}::vector) AS similarity,
      d."filename"
    FROM "Chunk" c
    JOIN "Document" d ON d."id" = c."documentId"
    WHERE d."workspaceId" = ${workspaceId}
      AND d."status" = 'READY'
      AND d."deletedAt" IS NULL
      AND c."embedding" IS NOT NULL
    ORDER BY c."embedding" <=> ${vectorStr}::vector
    LIMIT ${TOP_K}
  `;

  return results;
}

const SYSTEM_PROMPT = `You are DocQuery, a precise research assistant. Answer ONLY using the provided document context.

Rules:
1. Cite sources inline using [chunk:CHUNK_ID] markers after each claim.
2. If the context does not contain enough information, say "I cannot find this in your documents."
3. Never invent facts not supported by the context.
4. Be concise and direct.`;

export async function queryWorkspace(
  workspaceId: string,
  question: string,
): Promise<{
  answer: string;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "NOT_FOUND";
  citations: Citation[];
}> {
  const queryEmbedding = await embedQuery(question);
  const chunks = await searchChunks(workspaceId, queryEmbedding);

  const similarities = chunks.map((c) => c.similarity);
  const confidence = computeConfidence(similarities);

  if (confidence === "NOT_FOUND") {
    return {
      answer: "",
      confidence: "NOT_FOUND",
      citations: [],
    };
  }

  const context = chunks
    .map(
      (c, i) =>
        `[Chunk ${i + 1}] ID: ${c.id}\nDocument: ${c.filename}\nPage: ${c.pageNumber}\n${c.content}`,
    )
    .join("\n\n---\n\n");

  const answer = await generateText(
    SYSTEM_PROMPT,
    `Context:\n${context}\n\nQuestion: ${question}`,
    { temperature: 0.1 },
  );
  const citations = extractCitations(answer, chunks);

  return { answer, confidence, citations };
}

function extractCitations(
  answer: string,
  chunks: RetrievedChunk[],
): Citation[] {
  const chunkMap = new Map(chunks.map((c) => [c.id, c]));
  const citationPattern = /\[chunk:([^\]]+)\]/g;
  const seen = new Set<string>();
  const citations: Citation[] = [];

  let match;
  while ((match = citationPattern.exec(answer)) !== null) {
    const chunkId = match[1];
    if (seen.has(chunkId)) continue;
    seen.add(chunkId);

    const chunk = chunkMap.get(chunkId);
    if (!chunk) continue;

    const claimStart = Math.max(0, match.index - 200);
    const claim = answer.slice(claimStart, match.index);
    const bounds = findSentenceBounds(chunk.content, claim);

    citations.push({
      chunkId: chunk.id,
      documentId: chunk.documentId,
      page: chunk.pageNumber,
      sentenceStart: chunk.charStart + bounds.start,
      sentenceEnd: chunk.charStart + bounds.end,
      snippet: bounds.snippet,
    });
  }

  return citations;
}

export async function generateFollowUps(
  question: string,
  answer: string,
): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) return [];

  try {
    const content = await generateText(
      "Generate exactly 3 short follow-up questions based on the Q&A. Return a JSON object with a questions array of strings only.",
      `Question: ${question}\nAnswer: ${answer}`,
      { temperature: 0.5, responseMimeType: "application/json" },
    );
    const parsed = JSON.parse(content) as { questions?: string[] };
    return (parsed.questions ?? []).slice(0, 3);
  } catch {
    return [];
  }
}

async function generateText(
  systemInstruction: string,
  prompt: string,
  options: { temperature: number; responseMimeType?: string },
): Promise<string> {
  if (process.env.GEMINI_API_KEY) {
    return generateWithGemini(systemInstruction, prompt, options);
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("No chat provider configured. Set GEMINI_API_KEY or OPENAI_API_KEY.");
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: prompt },
    ],
    temperature: options.temperature,
    ...(options.responseMimeType
      ? { response_format: { type: "json_object" as const } }
      : {}),
  });

  return completion.choices[0]?.message?.content ?? "";
}

export async function logQuery(
  workspaceId: string,
  actorId: string,
  conversationId: string,
  metadata?: Prisma.InputJsonValue,
) {
  await db.auditLog.create({
    data: {
      workspaceId,
      actorId,
      action: "QUERY_RUN",
      targetType: "Conversation",
      targetId: conversationId,
      metadata,
    },
  });
}
