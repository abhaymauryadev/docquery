"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CommandPalette } from "@/components/workspace/command-palette";

interface DashboardPaletteProps {
  workspaces: { id: string; name: string }[];
}

export function DashboardPalette({ workspaces }: DashboardPaletteProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <kbd className="rounded border border-graphite/20 px-2 py-0.5 font-mono text-xs text-graphite">
          ⌘K
        </kbd>
      </Button>
      <CommandPalette
        workspaces={workspaces}
        documents={[]}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
