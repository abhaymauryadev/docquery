"use client";

import type { DocStatus } from "@/types";
import { FileText, Pin, Loader2, AlertCircle } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";

const statusConfig: Record<
  DocStatus,
  { label: string; className: string }
> = {
  PENDING: { label: "Pending", className: "text-graphite" },
  PROCESSING: { label: "Processing", className: "text-steady" },
  READY: { label: "Ready", className: "text-verified" },
  FAILED: { label: "Failed", className: "text-flag" },
};

interface DocumentRowProps {
  id: string;
  filename: string;
  status: DocStatus;
  failureReason?: string | null;
  createdAt: Date | string;
  isPinned?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onPin?: () => void;
}

export function DocumentRow({
  filename,
  status,
  failureReason,
  createdAt,
  isPinned,
  isSelected,
  onSelect,
  onPin,
}: DocumentRowProps) {
  const { label, className } = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[var(--radius-default)] border px-3 py-2 transition-colors",
        isSelected
          ? "border-signal bg-signal/5"
          : "border-transparent hover:border-graphite/10 hover:bg-ink/5",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <FileText className="h-4 w-4 flex-shrink-0 text-graphite" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{filename}</p>
          <p className="text-xs text-graphite">
            {formatRelativeTime(createdAt)}
            {failureReason && (
              <span className="ml-2 text-flag" title={failureReason}>
                — {failureReason}
              </span>
            )}
          </p>
        </div>
        <span
          className={cn(
            "flex items-center gap-1 text-xs font-mono",
            className,
          )}
        >
          {status === "PROCESSING" && (
            <Loader2 className="h-3 w-3 animate-spin" />
          )}
          {status === "FAILED" && <AlertCircle className="h-3 w-3" />}
          {label}
        </span>
      </button>
      {onPin && (
        <button
          type="button"
          onClick={onPin}
          className={cn(
            "rounded p-1 hover:bg-ink/5",
            isPinned ? "text-signal" : "text-graphite",
          )}
          aria-label={isPinned ? "Unpin document" : "Pin document"}
        >
          <Pin className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
