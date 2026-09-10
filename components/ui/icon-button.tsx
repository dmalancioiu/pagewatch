import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded shrink-0",
    "transition-colors duration-120 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "disabled:pointer-events-none disabled:opacity-45 disabled:cursor-not-allowed",
  ],
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent-hover",
        secondary: "bg-panel-raised text-text border border-border-strong hover:bg-bg-subtle",
        ghost: "bg-transparent text-text-muted hover:bg-panel-raised hover:text-text",
        danger: "bg-transparent text-critical hover:bg-critical/10",
      },
      size: {
        sm: "size-7",
        md: "size-8",
        lg: "size-9",
      },
    },
    defaultVariants: { variant: "ghost", size: "md" },
  }
);

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  /** Required — an icon-only control must always have an accessible name. */
  "aria-label": string;
}

/** Square Button variant for a single icon — always requires `aria-label`. */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

IconButton.displayName = "IconButton";
