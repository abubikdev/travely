"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function ShimmerBorder({
  children,
  className,
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  if (!active) {
    return <motion.div className={className}>{children}</motion.div>;
  }

  return (
    <motion.div className={cn("relative rounded-3xl p-[1px] overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "linear-gradient(90deg, #ff6b9d, #ffd60a, #5ac8fa, #ff6b9d)",
          backgroundSize: "300% 100%",
        }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0c0c0e]">
        {children}
      </div>
    </motion.div>
  );
}
