"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa";

export function AppProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Backgrounds no gradients: keep things subtle with flat visuals
  return <>{children}</>;
}
