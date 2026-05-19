"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "./chat-message";
import type { ChatMessage as ChatMessageType } from "@/types/chat";

interface ChatThreadProps {
  messages: ChatMessageType[];
}

export function ChatThread({ messages }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div
      className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-2 pb-[calc(var(--chat-input-offset)+var(--safe-bottom))] scrollbar-hide"
      role="log"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </AnimatePresence>
      <div ref={bottomRef} className="h-2 shrink-0" aria-hidden />
    </div>
  );
}
