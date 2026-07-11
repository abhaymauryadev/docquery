import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireSession, requireWorkspaceAccess } from "@/lib/rbac";

export async function DELETE(
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

    await requireWorkspaceAccess(document.workspaceId, "EDITOR");

    await db.document.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await db.auditLog.create({
      data: {
        workspaceId: document.workspaceId,
        actorId: session.user.id,
        action: "DOCUMENT_DELETED",
        targetType: "Document",
        targetId: id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
