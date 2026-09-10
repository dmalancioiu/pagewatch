import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Panel — flat bordered surface with no padding, for tables and lists whose
 * rows need to run edge-to-edge. Compose `PanelHeader` / `PanelRow` /
 * `PanelFooter` inside it. For a padded, self-contained block of content use
 * `Card` instead — see docs/UI_PRIMITIVES.md.
 */
export function Panel({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-md border border-border bg-panel overflow-hidden", className)}
      {...props}
    />
  );
}

export function PanelHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 border-b border-border px-4 text-ui-medium text-text",
        className
      )}
      {...props}
    />
  );
}

/** One row — 40px, matches the density table's table/list row height. */
export function PanelRow({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 border-b border-border px-4 text-ui text-text last:border-b-0",
        "hover:bg-panel-raised transition-colors duration-120",
        className
      )}
      {...props}
    />
  );
}

export function PanelFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 border-t border-border px-4 text-meta text-text-muted",
        className
      )}
      {...props}
    />
  );
}
