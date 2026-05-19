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
    <motion.div
      className="flex w-full flex-col gap-3"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]"
        aria-hidden
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "var(--gradient-brand-horizontal)",
            backgroundSize: "200% 100%",
          }}
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentIndex + 1) / total) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <div className="flex justify-between gap-1">
        {labels.map((label, i) => (
          <span
            key={label}
            className={cn(
              "text-[11px] font-medium tracking-wide transition-colors",
              i <= currentIndex
                ? "gradient-text"
                : "text-[var(--foreground-tertiary)]"
            )}
          >
            {label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
