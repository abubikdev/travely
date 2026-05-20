"use client";

import { motion } from "framer-motion";
import type { GuideTimelineItem } from "@/schemas/guide";
import { X } from "lucide-react";

interface StepsListOverlayProps {
  steps: GuideTimelineItem[];
  currentIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

export function StepsListOverlay({
  steps,
  currentIndex,
  onSelect,
  onClose,
}: StepsListOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      <div className="flex w-full items-center justify-between px-6 pt-[max(20px,var(--safe-top))] pb-4 border-b border-[#1c1c1e]">
        <h2 className="text-[20px] font-semibold">All Steps</h2>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1c1c1e] text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        <div className="flex flex-col gap-8 pb-[max(32px,var(--safe-bottom))]">
          {steps.map((step, idx) => {
            const isActive = idx === currentIndex;
            const isPast = idx < currentIndex;

            return (
              <button
                key={step.id}
                onClick={() => onSelect(idx)}
                className="flex text-left gap-4 w-full group"
              >
                <div className="flex flex-col items-center">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold transition-colors ${
                      isActive
                        ? "bg-white text-black"
                        : isPast
                        ? "bg-[#1c1c1e] text-[#8e8e93]"
                        : "bg-[#1c1c1e] text-white"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  {idx !== steps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-[#1c1c1e] mt-2 rounded-full" />
                  )}
                </div>
                
                <div className="flex flex-col pb-4">
                  <p
                    className={`text-[20px] font-semibold tracking-[-0.01em] ${
                      isPast ? "text-[#8e8e93]" : "text-white"
                    }`}
                  >
                    {step.title}
                  </p>
                  {step.time && (
                    <p className="text-[15px] text-[#8e8e93] mt-1">
                      {step.time} {step.duration ? `• ${step.duration}` : ""}
                    </p>
                  )}
                  {step.subtitle && (
                    <p className={`text-[16px] mt-2 ${isPast ? "text-[#8e8e93]" : "text-[#d1d1d6]"}`}>
                      {step.subtitle}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
