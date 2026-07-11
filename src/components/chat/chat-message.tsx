"use client";

import type { Confidence } from "@/types";
import type { Citation } from "@/types";
import { ConfidenceBadge } from "@/components/ui/confidence-badge";
import { TraceRail } from "@/components/chat/trace-rail";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "USER" | "ASSISTANT";
  content: string;
  confidence?: Confidence | null;
  citations?: Citation[];
  onCitationClick?: (citation: Citation) => void;
}

export function ChatMessage({
  role,
  content,
  confidence,
  citations = [],
  onCitationClick,
}: ChatMessageProps) {
  if (role === "USER") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-[var(--radius-card)] bg-signal/10 px-4 py-3 text-ink">
          {content}
        </div>
      </div>
    );
  }

  if (confidence === "NOT_FOUND") {
    return (
      <div className="rounded-[var(--radius-card)] border border-graphite/10 bg-white p-6 dark:bg-surface-1">
        <ConfidenceBadge confidence="NOT_FOUND" />
        <p className="mt-3 text-ink">
          Not found in your documents. Try rephrasing your question or check
          which documents are in this workspace.
        </p>
      </div>
    );
  }

  const cleanedContent = content.replace(/\[chunk:[^\]]+\]/g, "");

  return (
    <div className="flex gap-3">
      <TraceRail citations={citations} onCitationClick={onCitationClick} />
      <div className="min-w-0 flex-1">
        {confidence && (
          <div className="mb-2">
            <ConfidenceBadge confidence={confidence} />
          </div>
        )}
        <div className="prose prose-sm max-w-none text-ink">
          <p className="whitespace-pre-wrap">{cleanedContent}</p>
        </div>
        {citations.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {citations.map((c, i) => (
              <button
                key={c.chunkId}
                type="button"
                onClick={() => onCitationClick?.(c)}
                className={cn(
                  "rounded-[var(--radius-pill)] border border-graphite/10 px-2 py-0.5 font-mono text-xs text-signal hover:bg-signal/5",
                )}
              >
                [{i + 1}] p.{c.page}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
