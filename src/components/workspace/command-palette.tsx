"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { FileText, MessageSquare, FolderOpen } from "lucide-react";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  workspaces: { id: string; name: string }[];
  documents: { id: string; filename: string; workspaceId: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({
  workspaces,
  documents,
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 pt-[20vh]">
      <Command
        className="w-full max-w-lg overflow-hidden rounded-(--radius-card) border border-graphite/10 bg-white shadow-xl dark:bg-surface-1"
        label="Command palette"
      >
        <Command.Input
          placeholder="Jump to workspace, document, or new chat…"
          className="w-full border-b border-graphite/10 px-4 py-3 text-sm outline-none"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="px-4 py-6 text-center text-sm text-graphite">
            No results found.
          </Command.Empty>

          <Command.Group heading="Workspaces">
            {workspaces.map((ws) => (
              <Command.Item
                key={ws.id}
                value={ws.name}
                onSelect={() => {
                  router.push(`/workspace/${ws.id}`);
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-default) px-3 py-2 text-sm aria-selected:bg-signal/10"
              >
                <FolderOpen className="h-4 w-4 text-graphite" />
                {ws.name}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Documents">
            {documents.map((doc) => (
              <Command.Item
                key={doc.id}
                value={doc.filename}
                onSelect={() => {
                  router.push(
                    `/workspace/${doc.workspaceId}?doc=${doc.id}`,
                  );
                  onOpenChange(false);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-(--radius-default) px-3 py-2 text-sm aria-selected:bg-signal/10"
              >
                <FileText className="h-4 w-4 text-graphite" />
                {doc.filename}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Actions">
            <Command.Item
              value="new chat"
              onSelect={() => {
                const ws = workspaces[0];
                if (ws) router.push(`/workspace/${ws.id}`);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center gap-2 rounded-[var(--radius-default)] px-3 py-2 text-sm aria-selected:bg-signal/10"
            >
              <MessageSquare className="h-4 w-4 text-graphite" />
              New chat
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
