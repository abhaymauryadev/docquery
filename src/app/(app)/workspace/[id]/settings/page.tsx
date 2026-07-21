import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getWorkspaceMembership } from "@/lib/rbac";
import { SettingsView } from "@/components/workspace/settings-view";

export default async function WorkspaceSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const result = await getWorkspaceMembership(id, session.user.id);
  if (!result) notFound();

  const members = await db.workspaceMember.findMany({
    where: { workspaceId: id },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });

  return (
    <SettingsView
      workspaceId={id}
      workspaceName={result.workspace.name}
      isOwner={result.membership.role === "OWNER"}
      members={members.map((m) => ({
        id: m.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
      }))}
    />
  );
}
