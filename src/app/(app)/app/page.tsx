import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen } from "lucide-react";

export default async function AppDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

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

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Your workspaces
        </h1>
        <Button asChild>
          <Link href="/app/new">
            <Plus className="h-4 w-4" />
            New workspace
          </Link>
        </Button>
      </div>

      {memberships.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-graphite/20 p-12 text-center">
          <FolderOpen className="mx-auto h-12 w-12 text-graphite/40" />
          <p className="mt-4 text-graphite">
            No workspaces yet — create one to upload your first document.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/app/new">Create workspace</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {memberships.map((m) => (
            <Link
              key={m.workspace.id}
              href={`/workspace/${m.workspace.id}`}
              className="rounded-[var(--radius-card)] border border-graphite/10 bg-white p-6 transition-colors hover:border-signal dark:bg-surface-1"
            >
              <h2 className="font-semibold text-ink">{m.workspace.name}</h2>
              <p className="mt-1 font-mono text-xs text-graphite">
                {m.workspace._count.documents} documents · {m.role}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
