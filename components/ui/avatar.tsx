'use client'

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  alt?: string;
  /** Shown when `src` is absent or fails to load — e.g. initials from a name. */
  fallback: string;
  size?: "sm" | "md" | "lg";
}

const SIZE = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-[11px]",
  lg: "size-10 text-ui",
};

/** Avatar with an initials fallback — falls back automatically if the image errors. */
export function Avatar({ className, src, alt, fallback, size = "md", ...props }: AvatarProps) {
  const [errored, setErrored] = React.useState(false);
  const showImage = Boolean(src) && !errored;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-accent-subtle font-medium text-accent",
        SIZE[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src as string}
          alt={alt ?? ""}
          className="size-full object-cover"
          onError={() => setErrored(true)}
        />
      ) : (
        <span aria-hidden={Boolean(alt)}>{fallback}</span>
      )}
    </span>
  );
}
