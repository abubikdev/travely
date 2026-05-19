"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AmbientGradient({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("pointer-events-none fixed inset-0 overflow-hidden", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <div
        className="absolute -top-1/2 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full opacity-20 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, #ff6b9d 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[60vh] w-[60vh] rounded-full opacity-15 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, #5ac8fa 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 h-[50vh] w-[50vh] rounded-full opacity-10 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, #ffd60a 0%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
