"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuth } from "@/hooks/use-auth";

import { Skeleton } from "@/components/ui/skeleton";

function JourneyLoading() {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <Skeleton width={40} height={40} className="bg-[var(--surface-muted)]" />
    </div>
  );
}

const JourneyFlow = dynamic(
  () =>
    import("@/features/journey/journey-flow").then((mod) => mod.JourneyFlow),
  { ssr: false, loading: JourneyLoading },
);

export default function JourneyPage() {
  const router = useRouter();
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);
  const { loading: authLoading, isAuthenticated, authEnabled } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || (authEnabled && authLoading)) return;
    if (!onboardingComplete || (authEnabled && !isAuthenticated)) {
      router.replace("/");
    }
  }, [
    hydrated,
    authLoading,
    authEnabled,
    onboardingComplete,
    isAuthenticated,
    router,
  ]);

  const blocked =
    !hydrated ||
    !onboardingComplete ||
    (authEnabled && (authLoading || !isAuthenticated));

  if (blocked) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--surface-muted)]" />
      </div>
    );
  }

  return <JourneyFlow />;
}
