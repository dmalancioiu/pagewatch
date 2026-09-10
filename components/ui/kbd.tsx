import * as React from "react";
import { cn } from "@/lib/utils";

/** Keyboard hint chip — e.g. showing a shortcut next to a command item. */
export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-[20px] items-center justify-center rounded-sm border border-border-strong",
        "bg-bg-subtle px-1 font-mono text-[11px] text-text-muted",
        className
      )}
      {...props}
    />
  );
}
