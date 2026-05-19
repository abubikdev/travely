"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AiThinking({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center gap-2 py-8", className)}
      role="status"
      aria-label="Generating"
    >
      <motion.div
        className="h-2 w-16 rounded-full animate-gradient-flow opacity-80"
        style={{ background: "var(--gradient-brand)" }}
        layout
      />
    </div>
  );
}

export function AiProgressBar({ progress = 0.6 }: { progress?: number }) {
  return (
    <motion.div
      className="h-1 w-full overflow-hidden rounded-full bg-[var(--surface-muted)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="h-full rounded-full animate-gradient-flow"
        style={{
          background: "var(--gradient-brand)",
          width: `${Math.min(100, progress * 100)}%`,
        }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, progress * 100)}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
}
