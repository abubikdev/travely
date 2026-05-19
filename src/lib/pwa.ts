import { isTauriApp } from "./platform";

export function registerServiceWorker(): void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (isTauriApp()) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .catch(() => {
        // Registration failed silently
      });
  });
}

export function canInstallPWA(): boolean {
  return typeof window !== "undefined" && "BeforeInstallPromptEvent" in window;
}
