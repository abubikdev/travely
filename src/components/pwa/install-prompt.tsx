"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isTauriApp } from "@/lib/platform";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isTauriApp()) return;
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  };

  if (!deferredPrompt || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-5"
        style={{ paddingBottom: "max(20px, var(--safe-bottom))" }}
      >
        <div className="mx-auto flex max-w-lg items-center gap-4 rounded-[24px] bg-[var(--background-elevated)] px-5 py-4">
          <Download className="h-5 w-5 shrink-0 text-[var(--foreground-secondary)]" />
          <div className="flex-1">
            <p className="text-[15px] font-medium">Install Travel Pal</p>
            <p className="text-[13px] text-[var(--foreground-tertiary)]">
              Add to home screen
            </p>
          </div>
          <Button size="sm" variant="gradient" onClick={handleInstall}>
            Install
          </Button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-[var(--foreground-tertiary)]"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
