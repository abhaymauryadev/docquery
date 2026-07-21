"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Citation } from "@/types";
import { cn } from "@/lib/utils";

interface DocumentViewerProps {
  documentId: string;
  highlight: Citation | null;
  onClose: () => void;
}

export function DocumentViewer({
  documentId,
  highlight,
  onClose,
}: DocumentViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function load() {
      setContent(null);
      setError("");
      const res = await fetch(`/api/documents/${documentId}/content`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(
          data.error ??
            (res.status === 404 || res.status === 410
              ? "Source no longer available."
              : "Failed to load document."),
        );
        return;
      }
      const data = await res.json();
      setContent(data.content);
    }
    load();
  }, [documentId]);

  function handleClose() {
    setOpen(false);
    setTimeout(onClose, 200);
  }

  return (
    <div className="fixed inset-0 z-40">
      <div
        className={cn(
          "absolute inset-0 bg-ink/30 transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={handleClose}
        aria-hidden
      />
      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-graphite/10 bg-white p-4 shadow-[var(--shadow-lg)] transition-transform duration-200 ease-out overflow-y-auto dark:bg-surface-1",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label="Document viewer"
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-ink">Document viewer</p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1 text-graphite hover:bg-ink/5 hover:text-ink"
            aria-label="Close document viewer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {error ? (
          <p className="mt-4 text-sm text-flag">{error}</p>
        ) : content === null ? (
          <p className="mt-4 text-sm text-graphite">Loading…</p>
        ) : (
          <div className="mt-4 text-sm leading-relaxed text-ink whitespace-pre-wrap">
            {highlight ? (
              <>
                {content.slice(0, highlight.sentenceStart)}
                <mark className="bg-signal/20 px-0.5">
                  {content.slice(highlight.sentenceStart, highlight.sentenceEnd)}
                </mark>
                {content.slice(highlight.sentenceEnd)}
              </>
            ) : (
              content
            )}
          </div>
        )}
        {highlight && (
          <p className="mt-2 font-mono text-xs text-graphite">
            p.{highlight.page}
          </p>
        )}
      </aside>
    </div>
  );
}
