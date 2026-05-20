"use client";

import { useState, useEffect } from "react";
import { useJourneyStore } from "@/stores/journey-store";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { TurnByTurnGuide } from "@/components/timeline/turn-by-turn";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useGuide } from "@/features/ai/use-guide";

const LOADING_MESSAGES = [
  "Building your travel execution guide…",
  "Optimizing routes and transfers…",
  "Structuring timeline logistics…",
  "Finalizing turn-by-turn instructions…",
];

export function GuideStep() {
  const { guide, isGenerating, error } = useJourneyStore();
  const { generateGuide } = useGuide();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (error && !guide) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black text-white px-6 text-center">
        <AlertCircle className="h-12 w-12 text-[#ff3b30] mb-4" />
        <h2 className="text-[22px] font-semibold">Generation Failed</h2>
        <p className="mt-2 text-[16px] text-[#8e8e93]">{error}</p>
        <button
          onClick={() => generateGuide()}
          className="mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[16px] font-medium text-black"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
      </div>
    );
  }

  if (!guide && isGenerating) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black text-white px-5">
        <GradientOrb size={100} />
        <div className="h-8 mt-10 overflow-hidden relative w-full text-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 text-[18px] text-[#8e8e93]"
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-black text-white px-5 text-center">
        <h2 className="text-[20px] font-medium text-[#8e8e93]">No guide found.</h2>
        <button
          onClick={() => generateGuide()}
          className="mt-6 rounded-full bg-white px-6 py-3 text-[16px] font-medium text-black"
        >
          Generate Guide
        </button>
      </div>
    );
  }

  return <TurnByTurnGuide guide={guide} />;
}
