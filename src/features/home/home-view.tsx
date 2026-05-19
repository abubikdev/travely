"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { APP_NAME } from "@/lib/constants";
import { getAllJourneys } from "@/lib/db";
import { useJourneyStore } from "@/stores/journey-store";
import type { Journey } from "@/types/journey";
import { Plus, ChevronRight } from "lucide-react";

export function HomeView() {
  const router = useRouter();
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const { createJourney, loadJourney, reset } = useJourneyStore();

  useEffect(() => {
    getAllJourneys().then(setJourneys);
  }, []);

  const startNew = async () => {
    reset();
    await createJourney();
    router.push("/journey");
  };

  const openJourney = async (id: string) => {
    reset();
    await loadJourney(id);
    router.push("/journey");
  };

  return (
    <AppShell accentHeader className="min-h-[100dvh]">
      <div className="flex min-h-[100dvh] w-full flex-col px-5 pb-[max(28px,var(--safe-bottom))] pt-[max(24px,var(--safe-top))]">
        <motion.div
          className="flex flex-1 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <GradientOrb size={120} className="mb-10" />
          <h1 className="text-[36px] font-semibold tracking-[-0.04em]">
            {APP_NAME}
          </h1>
          <p className="mt-3 max-w-sm text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
            Your travel execution assistant
          </p>
        </motion.div>

        <motion.div
          className="w-full space-y-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Button fullWidth size="lg" variant="gradient" onClick={startNew}>
            <Plus className="h-5 w-5" />
            New trip
          </Button>

          {journeys.length > 0 && (
            <section>
              <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
                Recent trips
              </h2>
              <motion.div className="space-y-1">
                {journeys.slice(0, 10).map((j, i) => (
                  <motion.button
                    key={j.id}
                    type="button"
                    onClick={() => openJourney(j.id)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex w-full items-center justify-between py-4 text-left"
                    whileTap={{ scale: 0.99 }}
                  >
                    <div>
                      <p className="text-[17px] font-medium text-[var(--foreground)]">
                        {j.title}
                      </p>
                      <p className="mt-0.5 text-[14px] capitalize text-[var(--foreground-tertiary)]">
                        {j.status} · {j.step}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-[var(--foreground-tertiary)]" />
                  </motion.button>
                ))}
              </motion.div>
            </section>
          )}

          <Link
            href="/settings"
            className="block py-2 text-center text-[15px] font-medium text-[var(--foreground-secondary)]"
          >
            Settings
          </Link>
        </motion.div>
      </div>
    </AppShell>
  );
}
