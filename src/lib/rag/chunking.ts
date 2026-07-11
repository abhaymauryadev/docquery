export interface ParsedPage {
  pageNumber: number;
  text: string;
}

export interface ParsedDocument {
  pages: ParsedPage[];
  fullText: string;
}

export interface TextChunk {
  content: string;
  pageNumber: number;
  charStart: number;
  charEnd: number;
}

const APPROX_CHARS_PER_TOKEN = 4;
const CHUNK_SIZE_TOKENS = 500;
const CHUNK_OVERLAP_TOKENS = 50;

const CHUNK_SIZE_CHARS = CHUNK_SIZE_TOKENS * APPROX_CHARS_PER_TOKEN;
const CHUNK_OVERLAP_CHARS = CHUNK_OVERLAP_TOKENS * APPROX_CHARS_PER_TOKEN;

const SENTENCE_BOUNDARY = /(?<=[.!?])\s+/;

export function splitIntoSentences(text: string): string[] {
  return text
    .split(SENTENCE_BOUNDARY)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function chunkDocument(parsed: ParsedDocument): TextChunk[] {
  const chunks: TextChunk[] = [];
  let globalOffset = 0;

  for (const page of parsed.pages) {
    const sentences = splitIntoSentences(page.text);
    let currentChunk = "";
    let chunkStart = globalOffset;
    let chunkPageStart = page.pageNumber;

    for (const sentence of sentences) {
      const sentenceWithSpace = currentChunk ? ` ${sentence}` : sentence;

      if (
        currentChunk.length + sentenceWithSpace.length > CHUNK_SIZE_CHARS &&
        currentChunk.length > 0
      ) {
        const charStart = chunkStart;
        const charEnd = charStart + currentChunk.length;
        chunks.push({
          content: currentChunk,
          pageNumber: chunkPageStart,
          charStart,
          charEnd,
        });

        const overlapText = currentChunk.slice(-CHUNK_OVERLAP_CHARS);
        currentChunk = overlapText ? `${overlapText} ${sentence}` : sentence;
        chunkStart = charEnd - overlapText.length;
        chunkPageStart = page.pageNumber;
      } else {
        currentChunk += sentenceWithSpace;
      }
    }

    if (currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        pageNumber: chunkPageStart,
        charStart: chunkStart,
        charEnd: chunkStart + currentChunk.trim().length,
      });
    }

    globalOffset += page.text.length + 1;
  }

  return chunks;
}

export function findSentenceBounds(
  chunkContent: string,
  claim: string,
): { start: number; end: number; snippet: string } {
  const sentences = splitIntoSentences(chunkContent);
  if (sentences.length === 0) {
    return { start: 0, end: chunkContent.length, snippet: chunkContent.slice(0, 200) };
  }

  const claimWords = new Set(
    claim.toLowerCase().split(/\s+/).filter((w) => w.length > 3),
  );

  let bestScore = -1;
  let bestSentence = sentences[0];
  let bestOffset = 0;

  let offset = 0;
  for (const sentence of sentences) {
    const words = sentence.toLowerCase().split(/\s+/);
    const score = words.filter((w) => claimWords.has(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestSentence = sentence;
      bestOffset = offset;
    }
    offset += sentence.length + 1;
  }

  return {
    start: bestOffset,
    end: bestOffset + bestSentence.length,
    snippet: bestSentence,
  };
}

export function computeConfidence(
  similarities: number[],
): "HIGH" | "MEDIUM" | "LOW" | "NOT_FOUND" {
  if (similarities.length === 0) return "NOT_FOUND";

  const top3 = similarities.slice(0, 3);
  const avg = top3.reduce((a, b) => a + b, 0) / top3.length;

  if (avg >= 0.78) return "HIGH";
  if (avg >= 0.6) return "MEDIUM";
  return "NOT_FOUND";
}
