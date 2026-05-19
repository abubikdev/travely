"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AppShell, StepHeader } from "@/components/layout/app-shell";
import { GuideRenderer } from "@/components/timeline/guide-renderer";
import { ChatInput } from "@/components/chat/chat-input";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { useJourneyStore } from "@/stores/journey-store";
import { useGuide } from "@/features/ai/use-guide";
import { Settings } from "lucide-react";
import Link from "next/link";

export function GuideStep() {
  const { guide, isGenerating } = useJourneyStore();
  const { editGuide } = useGuide();
  const [editMode, setEditMode] = useState(false);

  if (!guide && isGenerating) {
    return (
      <AppShell className="min-h-[100dvh] items-center justify-center">
        <div className="flex flex-col items-center px-5 py-20">
          <GradientOrb size={100} />
          <p className="mt-10 text-[18px] text-[var(--foreground-secondary)]">
            Building your travel execution guide…
          </p>
        </div>
      </AppShell>
    );
  }

  if (!guide) return null;

  return (
    <AppShell
      className="flex min-h-[100dvh] flex-1 flex-col overflow-hidden"
      header={
        <div className="flex w-full items-start justify-between gap-4 px-5 pt-[max(16px,var(--safe-top))]">
          <StepHeader title="Your guide" subtitle="Execution flow" size="large" />
          <Link
            href="/settings"
            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--surface-muted)]"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5 text-[var(--foreground-secondary)]" />
          </Link>
        </div>
      }
      footer={
        editMode ? (
          <ChatInput
            onSend={async (msg) => {
              await editGuide(msg);
            }}
            disabled={isGenerating}
            placeholder="e.g. Add detail about the train transfer…"
          />
        ) : undefined
      }
    >
      <div
        className={cn(
          "flex-1 overflow-y-auto px-5 scrollbar-hide",
          editMode
            ? "pb-[calc(var(--chat-input-offset)+var(--safe-bottom)+1rem)]"
            : "pb-6"
        )}
      >
        <GuideRenderer guide={guide} />
      </div>

      <div className="shrink-0 px-5 pb-[max(20px,var(--safe-bottom))]">
        <motion.button
          type="button"
          onClick={() => setEditMode(!editMode)}
          className="w-full py-4 text-[16px] font-medium text-[var(--foreground-secondary)]"
          whileTap={{ scale: 0.98 }}
        >
          {editMode ? "Done editing" : "Edit with AI"}
        </motion.button>
      </div>
    </AppShell>
  );
}
