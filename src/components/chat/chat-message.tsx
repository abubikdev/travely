"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ChatMessage as ChatMessageType } from "@/types/chat";
import { AiStreamText } from "./ai-stream-text";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full justify-end py-2"
      >
        <div className="max-w-[88%] rounded-full bg-[var(--foreground)] px-5 py-3 text-[16px] leading-relaxed text-[var(--background-elevated)]">
          {message.content}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("w-full py-4 pr-2")}
    >
      <AiStreamText
        content={message.content}
        streaming={message.streaming}
        className="max-w-none"
      />
    </motion.article>
  );
}
