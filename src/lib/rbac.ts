import type { Role } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const ROLE_HIERARCHY: Record<Role, number> = {
  VIEWER: 1,
  EDITOR: 2,
  OWNER: 3,
};

export class AuthError extends Error {
  constructor(
    message: string,
    public status: number = 401,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Unauthorized", 401);
  }
  return session;
}

export async function requireVerifiedUser() {
  const session = await requireSession();
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true },
  });
  if (!user?.emailVerified) {
    throw new AuthError("Email verification required", 403);
  }
  return session;
}

export async function getWorkspaceMembership(
  workspaceId: string,
  userId: string,
) {
  const workspace = await db.workspace.findFirst({
    where: { id: workspaceId, deletedAt: null },
    include: {
      members: { where: { userId } },
    },
  });

  if (!workspace || workspace.members.length === 0) return null;

  return {
    workspace,
    membership: workspace.members[0],
  };
}

export async function requireWorkspaceAccess(
  workspaceId: string,
  minRole: Role = "VIEWER",
) {
  const session = await requireSession();
  const result = await getWorkspaceMembership(workspaceId, session.user.id);

  if (!result) {
    throw new AuthError("Workspace not found", 404);
  }

  if (ROLE_HIERARCHY[result.membership.role] < ROLE_HIERARCHY[minRole]) {
    throw new AuthError("Insufficient permissions", 403);
  }

  return { session, ...result };
}

export function hasMinRole(userRole: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[minRole];
}
