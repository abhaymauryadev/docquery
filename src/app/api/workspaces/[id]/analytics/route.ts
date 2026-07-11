import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { AuthError, requireWorkspaceAccess } from "@/lib/rbac";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await requireWorkspaceAccess(id);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const docsIndexed = await db.document.count({
      where: { workspaceId: id, status: "READY", deletedAt: null },
    });

    const queriesThisWeek = await db.auditLog.count({
      where: {
        workspaceId: id,
        action: "QUERY_RUN",
        createdAt: { gte: weekAgo },
      },
    });

    const recentQueries = await db.auditLog.findMany({
      where: { workspaceId: id, action: "QUERY_RUN" },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: { metadata: true, createdAt: true },
    });

    const responseTimes = recentQueries
      .map((q) => (q.metadata as { responseTimeMs?: number })?.responseTimeMs)
      .filter((t): t is number => typeof t === "number");

    const avgResponseTimeMs =
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0;

    const messages = await db.message.findMany({
      where: {
        role: "ASSISTANT",
        confidence: { not: null },
        conversation: { workspaceId: id },
      },
      select: { confidence: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const confidenceScores: Record<string, number> = {
      HIGH: 1,
      MEDIUM: 0.5,
      LOW: 0.25,
      NOT_FOUND: 0,
    };

    const avgConfidence =
      messages.length > 0
        ? messages.reduce(
            (sum, m) => sum + (confidenceScores[m.confidence ?? "NOT_FOUND"] ?? 0),
            0,
          ) / messages.length
        : 0;

    const queriesByDay: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const count = await db.auditLog.count({
        where: {
          workspaceId: id,
          action: "QUERY_RUN",
          createdAt: {
            gte: new Date(dateStr),
            lt: new Date(new Date(dateStr).getTime() + 86400000),
          },
        },
      });
      queriesByDay.push({ date: dateStr, count });
    }

    const confidenceDistribution = ["HIGH", "MEDIUM", "LOW", "NOT_FOUND"].map(
      (confidence) => ({
        confidence,
        count: messages.filter((m) => m.confidence === confidence).length,
      }),
    );

    return NextResponse.json({
      docsIndexed,
      queriesThisWeek,
      avgResponseTimeMs: Math.round(avgResponseTimeMs),
      avgConfidence: Math.round(avgConfidence * 100) / 100,
      queriesByDay,
      confidenceDistribution,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
