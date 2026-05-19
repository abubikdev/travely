import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={cn(
      "flex h-[52px] w-full rounded-full bg-[var(--background-elevated)] px-5 text-[16px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-pink)]/25",
      className
    )}
    ref={ref}
    {...props}
  />
));
Input.displayName = "Input";
