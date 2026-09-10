import * as React from "react";
import { cn } from "@/lib/utils";

/** Shimmer loading block. Animation is disabled under prefers-reduced-motion (see app/globals.css). */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-sm bg-bg-subtle", className)}
      {...props}
    />
  );
}
