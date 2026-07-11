import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-[var(--radius-input)] border bg-transparent px-3 py-2 text-sm text-ink placeholder:text-graphite/60 transition-colors",
          error
            ? "border-flag focus:border-flag"
            : "border-graphite/30 focus:border-signal",
          className,
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-flag" role="alert">
          {error}
        </p>
      )}
    </div>
  ),
);
Input.displayName = "Input";
