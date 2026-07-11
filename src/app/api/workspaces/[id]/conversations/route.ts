import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireWorkspaceAccess } from "@/lib/rbac";
import { conversationCreateSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { session } = await requireWorkspaceAccess(id);

    const body = await request.json().catch(() => ({}));
    const parsed = conversationCreateSchema.safeParse(body);

    const conversation = await db.conversation.create({
      data: {
        workspaceId: id,
        title: parsed.success && parsed.data.title ? parsed.data.title : "New conversation",
        createdById: session.user.id,
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
