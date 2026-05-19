"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell, StepHeader } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuth } from "@/hooks/use-auth";
import { validateApiKey, AIClientError } from "@/ai/client";
import { isValidOpenAIKeyFormat } from "@/lib/crypto";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut, isAuthenticated, authEnabled } = useAuth();
  const {
    clearApiKey,
    setApiKey,
    totalTokensUsed,
    getApiKey,
    setOnboardingComplete,
  } = useSettingsStore();
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const hasKey = !!getApiKey();

  const handleUpdateKey = async () => {
    setError(null);
    setSaved(false);
    const trimmed = newKey.trim();
    if (!isValidOpenAIKeyFormat(trimmed)) {
      setError("Invalid API key format");
      return;
    }
    try {
      const valid = await validateApiKey(trimmed);
      if (!valid) {
        setError("API key rejected");
        return;
      }
      setApiKey(trimmed);
      setNewKey("");
      setSaved(true);
    } catch (e) {
      setError(e instanceof AIClientError ? e.message : "Verification failed");
    }
  };

  const handleRemoveKey = () => {
    clearApiKey();
    setOnboardingComplete(false);
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <AppShell className="min-h-[100dvh]">
      <div className="w-full px-5 pb-[max(28px,var(--safe-bottom))] pt-[max(16px,var(--safe-top))]">
        <StepHeader
          title="Settings"
          subtitle="API key and privacy"
          onBack={() => router.back()}
          size="large"
        />

        <section className="mt-12 space-y-10">
          {authEnabled && isAuthenticated && (
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
                Account
              </p>
              <p className="mt-2 text-[17px] font-medium">{user?.email}</p>
              <Button
                variant="ghost"
                fullWidth
                className="mt-4"
                onClick={handleSignOut}
              >
                Sign out
              </Button>
            </div>
          )}

          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--foreground-tertiary)]">
              API key
            </p>
            <p className="mt-2 text-[17px] font-medium">
              {hasKey ? "Connected locally" : "Not set"}
            </p>
            <p className="mt-1 text-[15px] text-[var(--foreground-secondary)]">
              Tokens used this session: {totalTokensUsed.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="mb-3 text-[15px] text-[var(--foreground-secondary)]">
              Update API key
            </p>
            <Input
              type="password"
              placeholder="sk-..."
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            {error && (
              <p className="mt-2 text-[15px] text-[#ff3b30]">{error}</p>
            )}
            {saved && (
              <p className="mt-2 text-[15px] text-[var(--accent-blue)]">
                Key updated
              </p>
            )}
            <Button
              className="mt-4"
              fullWidth
              variant="secondary"
              disabled={!newKey.trim()}
              onClick={handleUpdateKey}
            >
              Save new key
            </Button>
          </div>

          <Button
            variant="ghost"
            fullWidth
            className="text-[#ff3b30]"
            onClick={handleRemoveKey}
          >
            Remove API key & reset
          </Button>
        </section>
      </div>
    </AppShell>
  );
}
