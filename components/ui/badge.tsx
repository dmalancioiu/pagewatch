import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded font-medium leading-none",
  {
    variants: {
      tone: {
        neutral: "bg-bg-subtle text-text-muted border border-border",
        accent: "bg-accent-subtle text-accent",
        ok: "bg-ok-subtle text-ok",
        warn: "bg-warn-subtle text-warn",
        critical: "bg-critical-subtle text-critical",
        info: "bg-info-subtle text-info",
      },
      size: {
        sm: "h-5 px-1.5 text-[10px]",
        md: "h-5 px-2 text-label normal-case tracking-normal",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone, size }), className)} {...props} />;
}
