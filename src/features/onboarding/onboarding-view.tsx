"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GradientMesh } from "@/components/gradients/gradient-mesh";
import { GradientOrb } from "@/components/gradients/gradient-orb";
import { OnboardingProgress } from "@/components/onboarding/onboarding-progress";
import { AuthStep } from "@/features/onboarding/auth-step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateApiKey, AIClientError } from "@/ai/client";
import { isValidOpenAIKeyFormat } from "@/lib/crypto";
import { isAuthEnabled } from "@/lib/auth-config";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuth } from "@/hooks/use-auth";
import { APP_NAME } from "@/lib/constants";
import { Shield, Key, Sparkles } from "lucide-react";

const STEPS_WITH_AUTH = ["welcome", "auth", "privacy", "apikey"] as const;
const STEPS_NO_AUTH = ["welcome", "privacy", "apikey"] as const;
type Step = (typeof STEPS_WITH_AUTH)[number];

const slide = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
};

interface OnboardingViewProps {
  onComplete: () => void;
}

export function OnboardingView({ onComplete }: OnboardingViewProps) {
  const authEnabled = isAuthEnabled();
  const steps = authEnabled ? STEPS_WITH_AUTH : STEPS_NO_AUTH;
  const progressLabels = authEnabled
    ? ["Welcome", "Account", "Privacy", "Connect"]
    : ["Welcome", "Privacy", "Connect"];

  const { isAuthenticated, loading: authLoading } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const { setApiKey: saveKey, setOnboardingComplete } = useSettingsStore();

  useEffect(() => {
    if (
      authEnabled &&
      !authLoading &&
      isAuthenticated &&
      step === "welcome"
    ) {
      setStep("privacy");
    }
  }, [authEnabled, authLoading, isAuthenticated, step]);

  const stepIndex = useMemo(
    () => (steps as readonly Step[]).indexOf(step),
    [steps, step]
  );

  const goNext = (next: Step) => setStep(next);

  const nextFromWelcome = (): Step => {
    if (!authEnabled) return "privacy";
    return isAuthenticated ? "privacy" : "auth";
  };

  const handleSaveKey = async (testConnection: boolean) => {
    setError(null);
    const trimmed = apiKey.trim();
    if (!isValidOpenAIKeyFormat(trimmed)) {
      setError("Enter a valid OpenAI API key (starts with sk-)");
      return;
    }

    if (testConnection) {
      setTesting(true);
      try {
        const valid = await validateApiKey(trimmed);
        if (!valid) {
          setError("API key was rejected. Check and try again.");
          setTesting(false);
          return;
        }
      } catch (e) {
        if (e instanceof AIClientError && e.code === "invalid_key") {
          setError(e.message);
          setTesting(false);
          return;
        }
      } finally {
        setTesting(false);
      }
    }

    try {
      saveKey(trimmed);
      setOnboardingComplete(true);
      onComplete();
    } catch {
      setError("Could not save API key.");
    }
  };

  return (
    <motion.div
      className="relative flex min-h-[100dvh] w-full flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <GradientMesh />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-5 pb-[max(24px,var(--safe-bottom))] pt-[max(20px,var(--safe-top))]">
        {step !== "welcome" && (
          <div className="mb-8">
            <OnboardingProgress
              currentIndex={stepIndex}
              labels={progressLabels}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <motion.div
              key="welcome"
              {...slide}
              className="flex flex-1 flex-col"
            >
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <GradientOrb size={180} className="mb-10" />
                <motion.div
                  className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
                  style={{ background: "var(--gradient-soft)" }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Sparkles className="h-4 w-4 text-[var(--accent-pink)]" />
                  <span className="gradient-text">Travel execution AI</span>
                </motion.div>
                <h1 className="text-[44px] font-semibold leading-[1.02] tracking-[-0.04em]">
                  <span className="gradient-text">{APP_NAME}</span>
                </h1>
                <p className="mt-5 max-w-md text-[19px] leading-relaxed text-[var(--foreground-secondary)]">
                  Navigate flights, transfers, airports, and timing — not
                  tourism.
                </p>
              </div>
              <Button
                fullWidth
                size="lg"
                variant="gradient"
                onClick={() => goNext(nextFromWelcome())}
              >
                Get started
              </Button>
            </motion.div>
          )}

          {authEnabled && step === "auth" && !authLoading && (
            <motion.div key="auth" {...slide} className="flex flex-1 flex-col">
              <AuthStep onSuccess={() => goNext("privacy")} />
            </motion.div>
          )}

          {step === "privacy" && (
            <motion.div
              key="privacy"
              {...slide}
              className="flex flex-1 flex-col justify-between py-4"
            >
              <motion.div>
                <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full gradient-fill">
                  <Shield className="h-6 w-6 text-white" strokeWidth={1.5} />
                </div>
                <h2 className="text-[34px] font-semibold tracking-[-0.03em]">
                  Your data{" "}
                  <span className="gradient-text">stays yours</span>
                </h2>
                <ul className="mt-8 space-y-5 text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
                  {authEnabled && (
                    <li className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-fill" />
                      Optional account sync when you sign in.
                    </li>
                  )}
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-fill" />
                    OpenAI key encrypted and stored only on this device.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-fill" />
                    Trip documents stay in your browser.
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full gradient-fill" />
                    Passport photos are blocked for your security.
                  </li>
                </ul>
              </motion.div>
              <Button
                fullWidth
                size="lg"
                variant="gradient"
                onClick={() => goNext("apikey")}
              >
                Continue
              </Button>
            </motion.div>
          )}

          {step === "apikey" && (
            <motion.div
              key="apikey"
              {...slide}
              className="flex flex-1 flex-col justify-between py-4"
            >
              <motion.div>
                <motion.div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full gradient-fill">
                  <Key className="h-6 w-6 text-white" strokeWidth={1.5} />
                </motion.div>
                <h2 className="text-[34px] font-semibold tracking-[-0.03em]">
                  Connect <span className="gradient-text">OpenAI</span>
                </h2>
                <p className="mt-4 text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
                  Your key powers chat, vision, OCR, and guide generation. Never
                  leaves this device.
                </p>
                <div className="mt-8">
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                {error && (
                  <p className="mt-3 text-[15px] text-[#ff3b30]" role="alert">
                    {error}
                  </p>
                )}
              </motion.div>
              <div className="flex flex-col gap-3">
                <Button
                  fullWidth
                  size="lg"
                  variant="gradient"
                  disabled={testing || !apiKey.trim()}
                  onClick={() => handleSaveKey(true)}
                >
                  {testing ? "Verifying…" : "Save & verify"}
                </Button>
                <Button
                  variant="ghost"
                  fullWidth
                  disabled={!apiKey.trim()}
                  onClick={() => handleSaveKey(false)}
                >
                  Save without testing
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
