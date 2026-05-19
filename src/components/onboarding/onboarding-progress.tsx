"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OnboardingProgressProps {
  currentIndex: number;
  labels: string[];
}

export function OnboardingProgress({
  currentIndex,
  labels,
}: OnboardingProgressProps) {
  const total = labels.length;

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]"
        aria-hidden
      >
        <div
          className="h-full rounded-full"
          style={{
            background: "var(--foreground)",
            width: `${((currentIndex + 1) / total) * 100}%`,
          }}
        />
      </div>
      <div className="flex justify-between gap-1">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "text-[11px] font-medium tracking-wide",
              i <= currentIndex
                ? "text-[var(--foreground)]"
                : "text-[var(--foreground-tertiary)]",
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
