import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireWorkspaceAccess } from "@/lib/rbac";
import type { Citation } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const conversation = await db.conversation.findUnique({
      where: { id },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    await requireWorkspaceAccess(conversation.workspaceId);

    let markdown = `# ${conversation.title}\n\n`;
    markdown += `*Exported from DocQuery on ${new Date().toISOString().split("T")[0]}*\n\n---\n\n`;

    for (const message of conversation.messages) {
      if (message.role === "USER") {
        markdown += `## Question\n\n${message.content}\n\n`;
      } else {
        markdown += `## Answer\n\n`;
        if (message.confidence) {
          markdown += `**Confidence:** ${message.confidence}\n\n`;
        }
        markdown += `${message.content}\n\n`;

        const citations = message.citations as Citation[] | null;
        if (citations && citations.length > 0) {
          markdown += `### Citations\n\n`;
          citations.forEach((c, i) => {
            markdown += `${i + 1}. Page ${c.page}: "${c.snippet}"\n`;
          });
          markdown += `\n`;
        }
      }
    }

    return new NextResponse(markdown, {
      headers: {
        "Content-Type": "text/markdown",
        "Content-Disposition": `attachment; filename="${conversation.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.md"`,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
