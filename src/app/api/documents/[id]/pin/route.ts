import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireSession } from "@/lib/rbac";

export async function POST(
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

    const pin = await db.pinnedDocument.upsert({
      where: { userId_documentId: { userId: session.user.id, documentId: id } },
      create: { userId: session.user.id, documentId: id },
      update: { pinnedAt: new Date() },
    });

    return NextResponse.json(pin);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await requireSession();

    await db.pinnedDocument.deleteMany({
      where: { userId: session.user.id, documentId: id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
