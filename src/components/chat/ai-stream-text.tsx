"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AiStreamTextProps {
  content: string;
  streaming?: boolean;
  className?: string;
}

/**
 * Apple Intelligence–inspired reveal: newly streamed text sharpens from blur.
 */
export function AiStreamText({
  content,
  streaming = false,
  className,
}: AiStreamTextProps) {
  const reduceMotion = useReducedMotion();
  const committedRef = useRef(0);

  useEffect(() => {
    if (!streaming && content) {
      committedRef.current = content.length;
    }
  }, [streaming, content]);

  useEffect(() => {
    if (!streaming || !content) return;
    const lastSpace = content.lastIndexOf(" ");
    if (lastSpace > committedRef.current) {
      committedRef.current = lastSpace + 1;
    }
  }, [content, streaming]);

  if (!content) {
    return <AiThinkingDots />;
  }

  if (reduceMotion) {
    return (
      <p
        className={cn(
          "text-[17px] font-normal leading-[1.55] tracking-[-0.02em] text-[var(--foreground)]",
          className
        )}
      >
        {content}
      </p>
    );
  }

  const stable = content.slice(0, committedRef.current);
  const fresh = content.slice(committedRef.current);

  return (
    <p
      className={cn(
        "text-[17px] font-normal leading-[1.55] tracking-[-0.02em] text-[var(--foreground)]",
        className
      )}
    >
      {stable}
      {fresh && (
        <motion.span
          key={`${committedRef.current}-${fresh.length}`}
          initial={{ filter: "blur(10px)", opacity: 0.45 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "inline" }}
        >
          {fresh}
        </motion.span>
      )}
      {streaming && (
        <motion.span
          className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[2px] rounded-full bg-[var(--foreground-tertiary)] align-middle"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      )}
    </p>
  );
}

export function AiThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-[var(--foreground-tertiary)]"
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1, 0.85] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </span>
  );
}
