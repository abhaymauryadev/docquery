import { beforeEach, describe, expect, it, vi } from "vitest";
import { embedWithGemini } from "@/lib/gemini";

const fetchMock = vi.fn();

vi.stubGlobal("fetch", fetchMock);

describe("Gemini integration", () => {
  beforeEach(() => {
    fetchMock.mockReset();
    process.env.GEMINI_API_KEY = "test-key";
  });

  it("builds a valid Gemini endpoint for embeddings", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ embedding: { values: [0.1, 0.2] } }),
    });

    await embedWithGemini(["hello"], "RETRIEVAL_DOCUMENT", 2);

    expect(fetchMock).toHaveBeenCalledWith(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=test-key",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
