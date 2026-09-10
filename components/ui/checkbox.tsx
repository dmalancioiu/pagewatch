'use client'

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {}

/**
 * `@radix-ui/react-checkbox` is not an installed dependency (and adding one
 * is out of this agent's scope — see CLAUDE.md/package.json restriction), so
 * this wraps a native `<input type="checkbox">` instead of Radix Checkbox.
 * Native checkboxes are already fully keyboard- and screen-reader-operable,
 * so nothing is lost — flag to whoever next touches package.json if the
 * Radix primitive should replace this.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, disabled, ...props }, ref) => (
    <span className={cn("relative inline-flex size-4 shrink-0", className)}>
      <input
        ref={ref}
        type="checkbox"
        disabled={disabled}
        className="peer absolute inset-0 size-4 cursor-pointer appearance-none rounded-sm border border-border-strong bg-panel transition-colors duration-120 checked:border-accent checked:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-45"
        {...props}
      />
      <Check
        aria-hidden
        strokeWidth={3}
        className="pointer-events-none absolute inset-0 size-4 scale-0 p-0.5 text-accent-fg transition-transform duration-120 peer-checked:scale-100"
      />
    </span>
  )
);

Checkbox.displayName = "Checkbox";
