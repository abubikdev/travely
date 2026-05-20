"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuth } from "@/hooks/use-auth";
import { OnboardingView } from "@/features/onboarding/onboarding-view";
import { HomeView } from "@/features/home/home-view";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);
  const { loading: authLoading, isAuthenticated, authEnabled } = useAuth();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const needsAuth = authEnabled && !isAuthenticated;
  const showOnboarding = !onboardingComplete || needsAuth;

  if (!hydrated || (authEnabled && authLoading)) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <Skeleton width={40} height={40} className="bg-[var(--surface-muted)]" />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingView onComplete={() => {}} />;
  }

  return <HomeView />;
}
