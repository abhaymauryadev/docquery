"use client";

import type { Citation } from "@/types";
import { cn } from "@/lib/utils";

interface TraceRailProps {
  citations: Citation[];
  onCitationClick?: (citation: Citation) => void;
  className?: string;
}

export function TraceRail({
  citations,
  onCitationClick,
  className,
}: TraceRailProps) {
  if (citations.length === 0) return null;

  return (
    <div
      className={cn("relative w-2 shrink-0", className)}
      aria-label="Citation trace rail"
    >
      <div className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-signal/30" />
      {citations.map((citation, index) => {
        const position =
          citations.length === 1
            ? 50
            : (index / (citations.length - 1)) * 100;

        return (
          <button
            key={citation.chunkId}
            type="button"
            className="group absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-transform hover:scale-150 focus-visible:scale-150 motion-reduce:transition-none"
            style={{ top: `${position}%` }}
            onClick={() => onCitationClick?.(citation)}
            aria-label={`Citation ${index + 1}, page ${citation.page}`}
          >
            <span className="pointer-events-none absolute left-5 top-1/2 z-10 hidden w-64 -translate-y-1/2 rounded-[var(--radius-card)] border border-graphite/10 bg-white p-3 text-left text-xs shadow-md group-hover:block group-focus-visible:block dark:bg-surface-1 motion-reduce:group-hover:block">
              <span className="font-mono text-graphite">
                p.{citation.page}
              </span>
              <p className="mt-1 line-clamp-3 text-ink">{citation.snippet}</p>
            </span>
          </button>
        );
      })}
    </div>
  );
}
