import type { Confidence } from "@/types";
import { cn } from "@/lib/utils";

const config: Record<
  Confidence,
  { label: string; color: string; dot: string }
> = {
  HIGH: { label: "High", color: "text-verified", dot: "bg-verified" },
  MEDIUM: { label: "Medium", color: "text-steady", dot: "bg-steady" },
  LOW: { label: "Low", color: "text-flag", dot: "bg-flag" },
  NOT_FOUND: { label: "Not found", color: "text-flag", dot: "bg-flag" },
};

export function ConfidenceBadge({
  confidence,
  className,
}: {
  confidence: Confidence;
  className?: string;
}) {
  const { label, color, dot } = config[confidence];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-graphite/10 px-2.5 py-1 text-xs font-medium font-mono",
        color,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} aria-hidden />
      {label}
    </span>
  );
}
