"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";

type AuthMode = "signin" | "signup";

interface AuthStepProps {
  onSuccess: () => void;
}

export function AuthStep({ onSuccess }: AuthStepProps) {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleEmailAuth = async () => {
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const trimmedEmail = email.trim();

    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (signUpError) throw signUpError;
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          onSuccess();
          return;
        }
        setMagicLinkSent(true);
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setError(null);
    setLoading(true);
    const supabase = createClient();

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (otpError) throw otpError;
      setMagicLinkSent(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send link");
    } finally {
      setLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-1 flex-col justify-center py-8 text-center"
      >
        <motion.div
          className="mx-auto mb-6 h-14 w-14 rounded-full gradient-fill"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h2 className="text-[28px] font-semibold tracking-[-0.03em]">
          Check your email
        </h2>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
          We sent a link to <span className="font-medium">{email}</span>. Tap it
          to continue.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-1 flex-col justify-between py-6"
    >
      <div>
        <h2 className="text-[32px] font-semibold tracking-[-0.03em]">
          <span className="gradient-text">
            {mode === "signup" ? "Create account" : "Welcome back"}
          </span>
        </h2>
        <p className="mt-3 text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
          Sign in to sync your trips securely across devices.
        </p>

        <div className="mt-8 flex gap-2 rounded-full bg-[var(--surface-muted)] p-1">
          {(["signup", "signin"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 rounded-full py-2.5 text-[15px] font-medium transition-all ${
                mode === m
                  ? "bg-[var(--background-elevated)] text-[var(--foreground)]"
                  : "text-[var(--foreground-secondary)]"
              }`}
            >
              {m === "signup" ? "Sign up" : "Sign in"}
            </button>
          ))}
        </div>

        <motion.div className="mt-8 space-y-4">
          <div className="relative">
            <Mail className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12"
              autoComplete="email"
            />
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground-tertiary)]" />
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </div>
        </motion.div>

        {error && (
          <p className="mt-4 text-[15px] text-[#ff3b30]" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <Button
          fullWidth
          size="lg"
          variant="gradient"
          disabled={loading || !email.trim() || password.length < 6}
          onClick={handleEmailAuth}
        >
          {loading
            ? "Please wait…"
            : mode === "signup"
              ? "Create account"
              : "Sign in"}
        </Button>
        <Button
          variant="ghost"
          fullWidth
          disabled={loading || !email.trim()}
          onClick={handleMagicLink}
        >
          Send magic link instead
        </Button>
      </div>
    </motion.div>
  );
}
