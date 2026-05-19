"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useJourneyStore } from "@/stores/journey-store";
import { UploadStep } from "./upload-step";
import { InterviewStep } from "./interview-step";
import { ApprovalStep } from "./approval-step";
import { GuideStep } from "./guide-step";

export function JourneyFlow() {
  const { currentJourney, createJourney, setStep } = useJourneyStore();

  useEffect(() => {
    if (!currentJourney) {
      createJourney();
    }
  }, [currentJourney, createJourney]);

  const step = currentJourney?.step ?? "upload";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex min-h-[100dvh] flex-1 flex-col"
      >
        {step === "upload" && (
          <UploadStep onContinue={() => setStep("interview")} />
        )}
        {step === "interview" && (
          <InterviewStep onComplete={() => setStep("approval")} />
        )}
        {step === "approval" && (
          <ApprovalStep onApproved={() => setStep("guide")} />
        )}
        {step === "guide" && <GuideStep />}
      </motion.div>
    </AnimatePresence>
  );
}
