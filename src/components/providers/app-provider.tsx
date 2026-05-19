"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";
import { useSettingsStore } from "@/stores/settings-store";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const monochrome = useSettingsStore((s) => s.monochrome);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Occasional color burst in monochrome mode for subtle delight
  useEffect(() => {
    if (!monochrome) return;
    const startBurst = () => {
      const root = document.documentElement;
      root.classList.add("gradient-occasion");
      // remove after a few seconds
      window.setTimeout(() => root.classList.remove("gradient-occasion"), 4200);
    };
    // initial burst on load
    startBurst();
    // subsequent bursts every ~30 seconds
    const interval = window.setInterval(startBurst, 30000);
    return () => window.clearInterval(interval);
  }, [monochrome]);

  return <>{children}</>;
}
