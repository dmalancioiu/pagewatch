'use client'

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
  /** Grows with content up to `maxRows` instead of scrolling internally. */
  autoGrow?: boolean;
  maxRows?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, autoGrow = false, maxRows, onInput, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const resize = React.useCallback(
      (el: HTMLTextAreaElement) => {
        if (!autoGrow) return;
        el.style.height = "auto";
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
        const max = maxRows ? lineHeight * maxRows : Infinity;
        el.style.height = `${Math.min(el.scrollHeight, max)}px`;
      },
      [autoGrow, maxRows]
    );

    React.useEffect(() => {
      if (innerRef.current) resize(innerRef.current);
    }, [resize]);

    return (
      <textarea
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        aria-invalid={invalid || undefined}
        onInput={(e) => {
          resize(e.currentTarget);
          onInput?.(e);
        }}
        className={cn(
          "min-h-[80px] w-full rounded border border-border-strong bg-panel px-2.5 py-2 text-ui text-text",
          "placeholder:text-text-faint",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "disabled:cursor-not-allowed disabled:opacity-45",
          autoGrow && "resize-none overflow-hidden",
          invalid && "border-critical focus-visible:ring-critical",
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";
