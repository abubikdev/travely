"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AppShell, StepHeader } from "@/components/layout/app-shell";
import { ChatThread } from "@/components/chat/chat-thread";
import { ChatInput } from "@/components/chat/chat-input";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { useJourneyStore } from "@/stores/journey-store";
import { useInterview } from "@/features/ai/use-interview";

export function InterviewStep({ onComplete }: { onComplete: () => void }) {
  const { currentJourney } = useJourneyStore();
  const { startInterview, sendMessage, isStreaming, isComplete } =
    useInterview();

  useEffect(() => {
    if (
      currentJourney &&
      currentJourney.messages.length === 0 &&
      !isStreaming
    ) {
      startInterview();
    }
  }, [currentJourney?.id]);

  useEffect(() => {
    if (isComplete) onComplete();
  }, [isComplete, onComplete]);

  const messages =
    currentJourney?.messages.map((m) => ({
      ...m,
      content: m.content.replace("[INTERVIEW_COMPLETE]", "").trim(),
    })) ?? [];

  return (
    <AppShell
      className="flex min-h-[100dvh] flex-1 flex-col overflow-hidden"
      footer={
        <ChatInput
          onSend={sendMessage}
          disabled={isStreaming}
          placeholder="Your answer…"
        />
      }
    >
      <div className="shrink-0 px-5 pt-[max(16px,var(--safe-top))]">
        <StepHeader
          title="Quick interview"
          subtitle="A few questions about your travel logistics."
          size="large"
        />
        {isStreaming && messages.length > 0 && (
          <motion.div
            className="mt-6 flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GradientOrb size={40} pulse />
          </motion.div>
        )}
      </div>
      <ChatThread messages={messages} />
    </AppShell>
  );
}
