"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

// A small, reusable skeleton placeholder with an accessible label
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, circle = false, style, ...props }, ref) => {
    const w =
      width !== undefined
        ? typeof width === "number"
          ? `${width}px`
          : width
        : undefined;
    const h =
      height !== undefined
        ? typeof height === "number"
          ? `${height}px`
          : height
        : undefined;
    const borderRadius = circle ? "50%" : undefined;

    return (
      <div
        ref={ref}
        aria-label={circle ? "loading circle" : "loading"}
        role="img"
        className={cn(
          "bg-[var(--surface-muted)] rounded-md animate-pulse",
          className,
        )}
        style={{ width: w, height: h, borderRadius, ...style }}
        {...props}
      />
    );
  },
);
Skeleton.displayName = "Skeleton";

export default Skeleton;
