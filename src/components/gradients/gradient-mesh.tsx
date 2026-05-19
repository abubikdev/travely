"use client";

import { motion } from "framer-motion";

export function GradientMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0"
        style={{ background: "var(--gradient-mesh)" }}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-[20%] top-[5%] h-[55vh] w-[70vw] rounded-full opacity-45 blur-[80px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 93, 162, 0.75) 0%, transparent 70%)",
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -right-[15%] top-[20%] h-[45vh] w-[60vw] rounded-full opacity-40 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(91, 140, 255, 0.7) 0%, transparent 70%)",
        }}
        animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-[10%] h-[40vh] w-[80vw] rounded-full opacity-38 blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 179, 71, 0.72) 0%, transparent 70%)",
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
