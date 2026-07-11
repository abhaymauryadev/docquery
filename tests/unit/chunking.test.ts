import { describe, expect, it } from "vitest";
import {
  computeConfidence,
  findSentenceBounds,
  splitIntoSentences,
} from "@/lib/rag/chunking";

describe("splitIntoSentences", () => {
  it("splits on sentence boundaries", () => {
    const result = splitIntoSentences("Hello world. Another sentence! And one more?");
    expect(result).toEqual(["Hello world.", "Another sentence!", "And one more?"]);
  });
});

describe("computeConfidence", () => {
  it("returns HIGH for strong retrieval", () => {
    expect(computeConfidence([0.85, 0.8, 0.75])).toBe("HIGH");
  });

  it("returns MEDIUM for moderate retrieval", () => {
    expect(computeConfidence([0.7, 0.65, 0.6])).toBe("MEDIUM");
  });

  it("returns NOT_FOUND for weak retrieval", () => {
    expect(computeConfidence([0.4, 0.3])).toBe("NOT_FOUND");
  });

  it("returns NOT_FOUND for empty results", () => {
    expect(computeConfidence([])).toBe("NOT_FOUND");
  });
});

describe("findSentenceBounds", () => {
  it("finds the best matching sentence in a chunk", () => {
    const chunk =
      "Revenue grew 12% year over year. Operating margin improved to 18%.";
    const bounds = findSentenceBounds(chunk, "operating margin improved");
    expect(bounds.snippet).toContain("Operating margin");
    expect(bounds.end).toBeGreaterThan(bounds.start);
  });
});
