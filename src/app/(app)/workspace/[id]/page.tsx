import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getWorkspaceMembership } from "@/lib/rbac";
import { WorkspaceView } from "@/components/workspace/workspace-view";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const result = await getWorkspaceMembership(id, session.user.id);

  if (!result) notFound();

  return (
    <WorkspaceView
      workspaceId={id}
      workspaceName={result.workspace.name}
    />
  );
}
