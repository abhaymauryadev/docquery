import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import type { FileType } from "@/generated/prisma/client";
import type { ParsedDocument } from "@/lib/rag/chunking";

export async function parseDocument(
  buffer: Buffer,
  fileType: FileType,
): Promise<ParsedDocument> {
  switch (fileType) {
    case "PDF":
      return parsePdf(buffer);
    case "DOCX":
      return parseDocx(buffer);
    case "TXT":
      return parseTxt(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

async function parsePdf(buffer: Buffer): Promise<ParsedDocument> {
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();

    if (!result.text?.trim()) {
      throw new Error(
        "No extractable text — this looks like a scanned document.",
      );
    }

    const pages: ParsedDocument["pages"] = result.pages
      .map((page) => ({ pageNumber: page.num, text: page.text.trim() }))
      .filter((page) => page.text);

    if (pages.length === 0) {
      pages.push({ pageNumber: 1, text: result.text.trim() });
    }

    return { pages, fullText: result.text.trim() };
  } finally {
    await parser.destroy();
  }
}

async function parseDocx(buffer: Buffer): Promise<ParsedDocument> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error("No extractable text found in this document.");
  }

  return {
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

function parseTxt(buffer: Buffer): ParsedDocument {
  const text = buffer.toString("utf-8").trim();

  if (!text) {
    throw new Error("File is empty.");
  }

  return {
    pages: [{ pageNumber: 1, text }],
    fullText: text,
  };
}

export function detectFileType(
  mimeType: string,
  filename: string,
): FileType | null {
  if (mimeType === "application/pdf" || filename.endsWith(".pdf")) return "PDF";
  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    filename.endsWith(".docx")
  ) {
    return "DOCX";
  }
  if (mimeType === "text/plain" || filename.endsWith(".txt")) return "TXT";
  return null;
}