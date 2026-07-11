import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/rbac";
import { workspaceCreateSchema } from "@/lib/validators";
import { AuthError } from "@/lib/rbac";

export async function GET() {
  try {
    const session = await requireSession();

    const memberships = await db.workspaceMember.findMany({
      where: {
        userId: session.user.id,
        workspace: { deletedAt: null },
      },
      include: {
        workspace: {
          include: {
            _count: { select: { documents: { where: { deletedAt: null } } } },
          },
        },
      },
      orderBy: { workspace: { createdAt: "desc" } },
    });

    const workspaces = memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      createdAt: m.workspace.createdAt,
      documentCount: m.workspace._count.documents,
      role: m.role,
    }));

    return NextResponse.json(workspaces);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireSession();
    const body = await request.json();
    const parsed = workspaceCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const workspace = await db.workspace.create({
      data: {
        name: parsed.data.name,
        ownerId: session.user.id,
        members: {
          create: { userId: session.user.id, role: "OWNER" },
        },
      },
    });

    await db.auditLog.create({
      data: {
        workspaceId: workspace.id,
        actorId: session.user.id,
        action: "WORKSPACE_CREATED",
        targetType: "Workspace",
        targetId: workspace.id,
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
