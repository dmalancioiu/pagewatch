'use client'

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  /** Wires `htmlFor`/`id`/`aria-describedby` — must match the control's `id` prop. */
  htmlFor: string;
  description?: string;
  error?: string;
  required?: boolean;
}

/**
 * Label + description + error wrapper. Owns the `htmlFor` wiring: pass the
 * same `id` to the control you render as a child.
 */
export function Field({
  className,
  label,
  htmlFor,
  description,
  error,
  required,
  children,
  ...props
}: FieldProps) {
  const descriptionId = description ? `${htmlFor}-description` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...props}>
      <LabelPrimitive.Root
        htmlFor={htmlFor}
        className="text-label uppercase text-text-faint"
      >
        {label}
        {required && <span className="text-critical"> *</span>}
      </LabelPrimitive.Root>
      {React.isValidElement<Record<string, unknown>>(children)
        ? React.cloneElement(children, {
            id: htmlFor,
            "aria-describedby": [descriptionId, errorId].filter(Boolean).join(" ") || undefined,
            "aria-invalid": error ? true : undefined,
          })
        : children}
      {description && !error && (
        <p id={descriptionId} className="text-meta text-text-muted">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-meta text-critical">
          {error}
        </p>
      )}
    </div>
  );
}
