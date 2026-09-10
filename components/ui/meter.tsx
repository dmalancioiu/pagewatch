import * as React from "react";
import { cn } from "@/lib/utils";

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "id"> {
  label: string;
  value: number;
  max: number;
  /** Defaults to "{value} / {max}"; pass a formatted string (e.g. "3 of 5 monitors") to override. */
  valueLabel?: string;
  tone?: "accent" | "ok" | "warn" | "critical";
}

/** Labelled usage bar — monitors used, checks this period. */
export function Meter({
  className,
  label,
  value,
  max,
  valueLabel,
  tone = "accent",
  ...props
}: MeterProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const barTone = {
    accent: "bg-accent",
    ok: "bg-ok",
    warn: "bg-warn",
    critical: "bg-critical",
  }[tone];

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <div className="flex items-center justify-between text-meta text-text-muted">
        <span>{label}</span>
        <span className="tabular-nums text-text">{valueLabel ?? `${value} / ${max}`}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle"
      >
        {/* Width is a genuinely computed value — the one case globals.css's inline-style rule allows. */}
        <div
          className={cn("h-full rounded-full transition-[width] duration-160 ease-out", barTone)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
