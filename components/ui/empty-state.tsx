import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  /** Usually a `<Button>` — kept as a slot so this stays server-safe. */
  action?: React.ReactNode;
}

/** Icon + title + description + optional action — every list ships one of these. */
export function EmptyState({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex size-9 items-center justify-center rounded-md bg-bg-subtle text-text-faint">
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-ui-medium text-text">{title}</p>
        {description && <p className="max-w-sm text-meta text-text-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
