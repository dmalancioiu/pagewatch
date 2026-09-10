import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusDotVariants = cva("inline-block size-1.5 rounded-full shrink-0", {
  variants: {
    tone: {
      neutral: "bg-text-faint",
      accent: "bg-accent",
      ok: "bg-ok",
      warn: "bg-warn",
      critical: "bg-critical",
      info: "bg-info",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface StatusDotProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusDotVariants> {
  /** Ring-pulse animation for a monitor actively capturing. Respects prefers-reduced-motion. */
  pulse?: boolean;
}

/** Small status indicator — a monitor's live/paused/alert state. */
export function StatusDot({ className, tone, pulse = false, ...props }: StatusDotProps) {
  return (
    <span className="relative inline-flex size-1.5 shrink-0" {...props}>
      {pulse && (
        <span
          className={cn(
            statusDotVariants({ tone }),
            "absolute inset-0 animate-ping opacity-75"
          )}
          aria-hidden
        />
      )}
      <span className={cn(statusDotVariants({ tone }), className)} />
    </span>
  );
}
