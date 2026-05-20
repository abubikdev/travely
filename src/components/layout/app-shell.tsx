"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function AppShell({
  children,
  className,
  header,
  footer,
}: AppShellProps) {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center bg-[var(--background)]">
      <motion.div
        className="relative flex min-h-[100dvh] w-full max-w-2xl flex-col text-[var(--foreground)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {header && (
          <header className="relative z-10 w-full shrink-0 px-5 pt-[max(16px,var(--safe-top))] pb-4">
            {header}
          </header>
        )}
        <main
          className={cn("relative z-10 flex w-full flex-1 flex-col", className)}
        >
          {children}
        </main>
        {footer && (
          <footer className="relative z-10 w-full shrink-0">{footer}</footer>
        )}
      </motion.div>
    </div>
  );
}

export function StepHeader({
  title,
  subtitle,
  onBack,
  size = "default",
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  size?: "default" | "large";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {onBack && (
        <motion.button
          type="button"
          onClick={onBack}
          className="mb-4 text-[15px] font-medium text-[var(--foreground-secondary)]"
          whileTap={{ scale: 0.98 }}
        >
          Back
        </motion.button>
      )}
      <h1
        className={cn(
          "font-semibold tracking-[-0.03em] text-[var(--foreground)]",
          size === "large"
            ? "text-[34px] leading-[1.1]"
            : "text-[28px] leading-[1.15]",
        )}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-[32rem] text-[17px] leading-relaxed text-[var(--foreground-secondary)]">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function ScreenSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("w-full px-5 py-6", className)}>{children}</section>
  );
}
