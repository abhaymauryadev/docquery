import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireWorkspaceAccess } from "@/lib/rbac";
import { messageCreateSchema } from "@/lib/validators";
import {
  generateFollowUps,
  logQuery,
  queryWorkspace,
} from "@/server/rag";
import { rateLimit } from "@/lib/api";
import type { Citation } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const rateLimited = rateLimit(request as never, "query", 20, 60_000);
    if (rateLimited) return rateLimited;

    const { id: conversationId } = await params;
    const startTime = Date.now();

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    const { session } = await requireWorkspaceAccess(conversation.workspaceId);

    const body = await request.json();
    const parsed = messageCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    await db.message.create({
      data: {
        conversationId,
        role: "USER",
        content: parsed.data.content,
      },
    });

    const { answer, confidence, citations } = await queryWorkspace(
      conversation.workspaceId,
      parsed.data.content,
    );

    const assistantMessage = await db.message.create({
      data: {
        conversationId,
        role: "ASSISTANT",
        content:
          confidence === "NOT_FOUND"
            ? "Not found in your documents."
            : answer,
        confidence,
        citations:
          citations.length > 0
            ? (citations as unknown as Prisma.InputJsonValue)
            : undefined,
      },
    });

    const responseTimeMs = Date.now() - startTime;
    await logQuery(conversation.workspaceId, session.user.id, conversationId, {
      responseTimeMs,
      confidence,
    });

    const followUps =
      confidence !== "NOT_FOUND"
        ? await generateFollowUps(parsed.data.content, answer)
        : [];

    return NextResponse.json({
      message: assistantMessage,
      citations: citations as Citation[],
      followUps,
      responseTimeMs,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error(error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
