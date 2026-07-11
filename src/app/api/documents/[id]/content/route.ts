import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireSession } from "@/lib/rbac";
import { downloadFile } from "@/lib/storage";
import { parseDocument } from "@/lib/rag/parser";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await requireSession();

    const document = await db.document.findUnique({ where: { id } });
    if (!document || document.deletedAt) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const membership = await db.workspaceMember.findFirst({
      where: { workspaceId: document.workspaceId, userId: session.user.id },
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.recentlyViewed.upsert({
      where: {
        userId_documentId: { userId: session.user.id, documentId: id },
      },
      create: { userId: session.user.id, documentId: id },
      update: { viewedAt: new Date() },
    });

    const buffer = await downloadFile(document.fileUrl);
    const parsed = await parseDocument(buffer, document.fileType);

    return NextResponse.json({
      content: parsed.fullText,
      pageCount: parsed.pages.length,
      filename: document.filename,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
