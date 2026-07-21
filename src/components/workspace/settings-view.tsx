"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, Users, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Role } from "@/generated/prisma/client";

interface Member {
  id: string;
  name: string | null;
  email: string;
  role: Role;
}

interface SettingsViewProps {
  workspaceId: string;
  workspaceName: string;
  isOwner: boolean;
  members: Member[];
}

type Section = "general" | "members" | "danger";

const NAV: { id: Section; label: string; icon: typeof SlidersHorizontal }[] = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "members", label: "Members", icon: Users },
  { id: "danger", label: "Danger zone", icon: AlertTriangle },
];

export function SettingsView({
  workspaceId,
  workspaceName,
  isOwner,
  members,
}: SettingsViewProps) {
  const router = useRouter();
  const [section, setSection] = useState<Section>("general");
  const [name, setName] = useState(workspaceName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  async function handleRename(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");

    const res = await fetch(`/api/workspaces/${workspaceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setSaving(false);

    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error?.name?.[0] ?? "Failed to rename workspace.");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/workspaces/${workspaceId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/app");
    } else {
      setDeleting(false);
      setError("Failed to delete workspace.");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/workspace/${workspaceId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Settings
        </h1>
      </div>

      <div className="mt-8 flex gap-8">
        <nav className="w-48 flex-shrink-0 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={cn(
                "flex w-full items-center gap-2 rounded-[var(--radius-default)] px-3 py-2 text-left text-sm transition-colors",
                section === item.id
                  ? "bg-signal-tint text-signal font-medium"
                  : "text-graphite hover:bg-ink/5 hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1 space-y-6">
          {section === "general" && (
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
              </CardHeader>
              <form onSubmit={handleRename} className="space-y-4">
                <div>
                  <label
                    htmlFor="workspace-name"
                    className="mb-1 block text-sm text-graphite"
                  >
                    Workspace name
                  </label>
                  <Input
                    id="workspace-name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSaved(false);
                    }}
                    disabled={!isOwner}
                    error={error || undefined}
                  />
                </div>
                {isOwner && (
                  <div className="flex items-center gap-3">
                    <Button
                      type="submit"
                      size="sm"
                      disabled={saving || !name.trim()}
                    >
                      {saving ? "Saving…" : "Save changes"}
                    </Button>
                    {saved && (
                      <span className="text-xs text-verified">Saved.</span>
                    )}
                  </div>
                )}
                {!isOwner && (
                  <p className="text-xs text-graphite">
                    Only the workspace owner can rename this workspace.
                  </p>
                )}
              </form>
            </Card>
          )}

          {section === "members" && (
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
              </CardHeader>
              <div className="divide-y divide-graphite/10">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {m.name ?? m.email}
                      </p>
                      <p className="text-xs text-graphite">{m.email}</p>
                    </div>
                    <span className="rounded-[var(--radius-pill)] border border-graphite/20 px-2.5 py-1 font-mono text-xs text-graphite">
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {section === "danger" && (
            <Card className="border-flag/30">
              <CardHeader>
                <CardTitle className="text-flag">Danger zone</CardTitle>
              </CardHeader>
              {isOwner ? (
                <div className="space-y-4">
                  <p className="text-sm text-graphite">
                    Deleting this workspace removes access for all members and
                    hides its documents and conversations. This cannot be
                    undone from the app.
                  </p>
                  <div>
                    <label
                      htmlFor="confirm-delete"
                      className="mb-1 block text-sm text-graphite"
                    >
                      Type <span className="font-mono text-ink">{workspaceName}</span> to
                      confirm
                    </label>
                    <Input
                      id="confirm-delete"
                      value={confirmText}
                      onChange={(e) => setConfirmText(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={confirmText !== workspaceName || deleting}
                    onClick={handleDelete}
                  >
                    {deleting ? "Deleting…" : "Delete workspace"}
                  </Button>
                  {error && <p className="text-xs text-flag">{error}</p>}
                </div>
              ) : (
                <p className="text-sm text-graphite">
                  Only the workspace owner can delete this workspace.
                </p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
