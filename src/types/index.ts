import type {
  Confidence,
  DocStatus,
  FileType,
  Role,
} from "@/generated/prisma/client";

export type { Confidence, DocStatus, FileType, Role };

export interface Citation {
  chunkId: string;
  documentId: string;
  page: number;
  sentenceStart: number;
  sentenceEnd: number;
  snippet: string;
}

export interface RetrievedChunk {
  id: string;
  documentId: string;
  content: string;
  pageNumber: number;
  charStart: number;
  charEnd: number;
  similarity: number;
  filename: string;
}

export interface AnalyticsData {
  docsIndexed: number;
  queriesThisWeek: number;
  avgResponseTimeMs: number;
  avgConfidence: number;
  queriesByDay: { date: string; count: number }[];
  confidenceDistribution: { confidence: string; count: number }[];
}

export interface WorkspaceWithMeta {
  id: string;
  name: string;
  createdAt: Date;
  documentCount: number;
  role: Role;
}
