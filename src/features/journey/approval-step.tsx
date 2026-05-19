"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppShell, StepHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { AiProgressBar } from "@/components/gradients/ai-thinking";
import { useJourneyStore } from "@/stores/journey-store";
import { useGuide } from "@/features/ai/use-guide";

export function ApprovalStep({ onApproved }: { onApproved: () => void }) {
  const { currentJourney, isGenerating } = useJourneyStore();
  const { generateSummary, generateGuide } = useGuide();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateSummary().finally(() => setLoading(false));
  }, []);

  const summary = currentJourney?.summary;

  const handleApprove = async () => {
    await generateGuide();
    onApproved();
  };

  return (
    <AppShell className="min-h-[100dvh]">
      <div className="flex min-h-[100dvh] w-full flex-col px-5 pb-[max(24px,var(--safe-bottom))] pt-[max(16px,var(--safe-top))]">
        <StepHeader
          title="Review summary"
          subtitle="Confirm your logistics before we build your guide."
          size="large"
        />

        {loading && (
          <motion.div
            className="flex flex-1 flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <GradientOrb size={88} />
            <p className="mt-10 text-[17px] text-[var(--foreground-secondary)]">
              Building summary…
            </p>
            <div className="mt-8 w-full max-w-xs">
              <AiProgressBar progress={0.5} />
            </div>
          </motion.div>
        )}

        {!loading && summary && (
          <motion.div
            className="mt-10 flex-1 space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-[26px] font-semibold tracking-[-0.02em]">
              {summary.title}
            </h2>

            <section>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
                Segments
              </h3>
              <motion.div className="mt-5 space-y-6">
                {summary.segments.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <p className="text-[18px] font-medium">{s.title}</p>
                    {(s.from || s.to) && (
                      <p className="mt-1 text-[16px] text-[var(--foreground-secondary)]">
                        {[s.from, s.to].filter(Boolean).join(" → ")}
                      </p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </section>

            {summary.risks.length > 0 && (
              <section>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
                  Risks
                </h3>
                <motion.div className="mt-5 space-y-6">
                  {summary.risks.map((r, i) => (
                    <motion.div key={i}>
                      <p className="text-[17px] font-medium text-[#ff9500]">
                        {r.title}
                      </p>
                      <p className="mt-1 text-[16px] leading-relaxed text-[var(--foreground-secondary)]">
                        {r.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {summary.missingInfo.length > 0 && (
              <section>
                <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
                  Missing info
                </h3>
                <ul className="mt-4 space-y-2 text-[16px] text-[var(--foreground-secondary)]">
                  {summary.missingInfo.map((m, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-[var(--foreground-tertiary)]">·</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <Button
              fullWidth
              size="lg"
              variant="gradient"
              disabled={isGenerating}
              onClick={handleApprove}
            >
              {isGenerating ? "Generating guide…" : "Approve & generate guide"}
            </Button>
          </motion.div>
        )}

        {!loading && !summary && (
          <p className="mt-12 text-[var(--foreground-secondary)]">
            Could not load summary.
          </p>
        )}
      </div>
    </AppShell>
  );
}
