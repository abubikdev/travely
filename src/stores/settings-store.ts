import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  decryptApiKey,
  encryptApiKey,
  isValidOpenAIKeyFormat,
} from "@/lib/crypto";
import { STORAGE_KEYS } from "@/lib/constants";

interface SettingsState {
  encryptedApiKey: string | null;
  onboardingComplete: boolean;
  totalTokensUsed: number;
  monochrome: boolean;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  getApiKey: () => string | null;
  setOnboardingComplete: (value: boolean) => void;
  addTokenUsage: (tokens: number) => void;
  setMonochrome: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      encryptedApiKey: null,
      onboardingComplete: false,
      totalTokensUsed: 0,
      monochrome: true,

      setApiKey: (key: string) => {
        const trimmed = key.trim();
        if (!isValidOpenAIKeyFormat(trimmed)) {
          throw new Error("Invalid API key format");
        }
        set({ encryptedApiKey: encryptApiKey(trimmed) });
      },

      clearApiKey: () => {
        set({ encryptedApiKey: null, onboardingComplete: false });
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
        }
      },

      getApiKey: () => {
        const { encryptedApiKey } = get();
        if (!encryptedApiKey) return null;
        return decryptApiKey(encryptedApiKey);
      },

      setOnboardingComplete: (value: boolean) => {
        set({ onboardingComplete: value });
      },

      setMonochrome: (value: boolean) => {
        set({ monochrome: value });
      },
      addTokenUsage: (tokens: number) => {
        set((s) => ({ totalTokensUsed: s.totalTokensUsed + tokens }));
      },
    }),
    {
      name: "travelpal-settings",
      partialize: (state) => ({
        encryptedApiKey: state.encryptedApiKey,
        onboardingComplete: state.onboardingComplete,
        totalTokensUsed: state.totalTokensUsed,
        monochrome: state.monochrome,
      }),
    },
  ),
);
