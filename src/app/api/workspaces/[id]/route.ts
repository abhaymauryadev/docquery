import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireWorkspaceAccess } from "@/lib/rbac";
import { workspaceUpdateSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requireWorkspaceAccess(id, "OWNER");

    const body = await request.json();
    const parsed = workspaceUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const workspace = await db.workspace.update({
      where: { id },
      data: { name: parsed.data.name },
    });

    return NextResponse.json(workspace);
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
    const { session } = await requireWorkspaceAccess(id, "OWNER");

    await db.workspace.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await db.auditLog.create({
      data: {
        workspaceId: id,
        actorId: session.user.id,
        action: "WORKSPACE_DELETED",
        targetType: "Workspace",
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
