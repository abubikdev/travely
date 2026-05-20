"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { useAuth } from "@/hooks/use-auth";
import { OnboardingView } from "@/features/onboarding/onboarding-view";
import { HomeView } from "@/features/home/home-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Compass } from "lucide-react";

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
        <Compass className="h-8 w-8 animate-spin text-[var(--foreground-tertiary)] opacity-50" />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingView onComplete={() => {}} />;
  }

  return <HomeView />;
}
