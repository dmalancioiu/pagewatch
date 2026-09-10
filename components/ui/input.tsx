import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  invalid?: boolean;
  /** Rendered inside the field, before the text — an icon or a fixed string like "https://". */
  prefix?: React.ReactNode;
  /** Rendered inside the field, after the text — an icon, a unit, a clear button. */
  suffix?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, prefix, suffix, disabled, ...props }, ref) => {
    if (!prefix && !suffix) {
      return (
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className={cn(
            "h-8 w-full rounded border border-border-strong bg-panel px-2.5 text-ui text-text",
            "placeholder:text-text-faint",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
            "disabled:cursor-not-allowed disabled:opacity-45",
            invalid && "border-critical focus-visible:ring-critical",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        className={cn(
          "flex h-8 w-full items-center gap-1.5 rounded border border-border-strong bg-panel px-2.5",
          "has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-accent has-[input:focus-visible]:ring-offset-2 has-[input:focus-visible]:ring-offset-bg",
          disabled && "cursor-not-allowed opacity-45",
          invalid && "border-critical",
          className
        )}
      >
        {prefix && <span className="flex shrink-0 items-center text-text-faint">{prefix}</span>}
        <input
          ref={ref}
          disabled={disabled}
          aria-invalid={invalid || undefined}
          className="h-full w-full min-w-0 bg-transparent text-ui text-text placeholder:text-text-faint focus:outline-none disabled:cursor-not-allowed"
          {...props}
        />
        {suffix && <span className="flex shrink-0 items-center text-text-faint">{suffix}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
