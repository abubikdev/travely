"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientOrbProps {
  size?: number;
  className?: string;
  pulse?: boolean;
}

/** Redesigned from GradientOrb to a minimal monochrome indicator */
export function GradientOrb({
  size = 64,
  className,
  pulse = true,
}: GradientOrbProps) {
  return (
    <div
      className={cn("relative flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <motion.div
        className="relative rounded-full bg-[var(--surface-muted)]"
        style={{
          width: size * 0.5,
          height: size * 0.5,
        }}
        animate={pulse ? { scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
