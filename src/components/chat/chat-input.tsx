"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled,
  placeholder = "Message",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-2"
      style={{ paddingBottom: "max(10px, var(--safe-bottom))" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "mx-auto flex max-w-sm items-end gap-2 rounded-[22px] bg-[var(--surface-muted)] px-3.5 py-1.5 transition-all duration-200",
          focused && "bg-[var(--surface-subtle)]",
          disabled && "opacity-45"
        )}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="max-h-24 min-h-[32px] flex-1 resize-none bg-transparent py-1.5 text-[15px] leading-snug text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none"
          aria-label="Message input"
        />
        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || !value.trim()}
          className={cn(
            "mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full disabled:opacity-30",
            value.trim() ? "bg-[var(--foreground)] text-[var(--background-elevated)]" : "bg-transparent text-[var(--foreground-tertiary)]"
          )}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          aria-label="Send message"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
