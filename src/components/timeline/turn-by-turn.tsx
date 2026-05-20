"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TravelGuideSchema } from "@/schemas/guide";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { StepsListOverlay } from "./steps-list-overlay";

export function TurnByTurnGuide({ guide }: { guide: TravelGuideSchema }) {
  const router = useRouter();
  const allSteps = guide.sections.flatMap(s => s.items || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const step = allSteps[currentIndex];

  if (!step) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-black text-white">
        <p className="text-[20px] font-medium text-[#8e8e93]">No steps available.</p>
      </div>
    );
  }

  const isLast = currentIndex === allSteps.length - 1;

  const handleNext = () => {
    if (!isLast) setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="relative flex h-[100dvh] w-full flex-col bg-black text-white overflow-hidden">
      {/* Top Nav */}
      <div className="flex w-full shrink-0 items-center justify-between px-6 pt-[max(20px,var(--safe-top))] pb-4">
        <p className="text-[15px] font-medium tracking-wide text-[#8e8e93]">
          Step {currentIndex + 1} of {allSteps.length}
        </p>
        <button
          onClick={() => router.push("/")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1e] text-[#8e8e93] transition-colors active:bg-[#2c2c2e]"
          aria-label="Exit travel mode"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Main Instruction */}
      <div className="flex flex-1 flex-col justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Massive Typography */}
            <h1 className="text-[48px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[64px]">
              {step.title}
            </h1>
            
            {/* Supporting Context */}
            <div className="flex flex-col gap-4">
              {step.time && (
                <p className="text-[18px] font-medium text-[#8e8e93]">
                  {step.time} {step.duration ? `• ${step.duration}` : ""}
                </p>
              )}
              {step.subtitle && (
                <p className="text-[20px] leading-snug text-white">
                  {step.subtitle}
                </p>
              )}
              {step.body && (
                <p className="text-[18px] leading-relaxed text-[#d1d1d6]">
                  {step.body}
                </p>
              )}
              {step.alerts?.map(a => (
                <div key={a.id} className="mt-2 rounded-2xl bg-[#1c1c1e] p-5">
                  <p className="text-[16px] font-semibold text-white">{a.title}</p>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-[#8e8e93]">{a.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav Area */}
      <div className="flex shrink-0 flex-col gap-3 px-6 pb-[max(32px,var(--safe-bottom))] pt-8">
        <button
          onClick={handleNext}
          disabled={isLast}
          className="flex w-full items-center justify-center rounded-full bg-white py-4 text-[18px] font-semibold text-black transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          {isLast ? "Trip Complete" : "Next Step"}
        </button>
        <button
          onClick={() => setShowOverlay(true)}
          className="flex w-full items-center justify-center rounded-full bg-[#1c1c1e] py-3.5 text-[16px] font-medium text-white transition-transform active:scale-[0.98]"
        >
          All Steps
        </button>
      </div>

      {/* Overlay */}
      <AnimatePresence>
        {showOverlay && (
          <StepsListOverlay 
            steps={allSteps} 
            currentIndex={currentIndex}
            onSelect={(idx) => {
              setCurrentIndex(idx);
              setShowOverlay(false);
            }}
            onClose={() => setShowOverlay(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
