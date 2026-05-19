"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientOrbProps {
  size?: number;
  className?: string;
  pulse?: boolean;
}

/** AI / loading moments only — pink → blue → orange orb */
export function GradientOrb({
  size = 120,
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
        className="absolute inset-0 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(255,93,162,0.55) 0%, rgba(91,140,255,0.4) 45%, rgba(255,179,71,0.5) 75%, transparent 100%)",
          filter: "blur(28px)",
        }}
        animate={
          pulse
            ? { scale: [1, 1.12, 1], opacity: [0.65, 0.9, 0.65] }
            : undefined
        }
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative rounded-full"
        style={{
          width: size * 0.42,
          height: size * 0.42,
          background: "var(--gradient-brand)",
        }}
        animate={pulse ? { scale: [0.96, 1, 0.96] } : undefined}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
