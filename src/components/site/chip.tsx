import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ChipTone = "light" | "dark" | "accent" | "outline";

type ChipProps = {
  children: ReactNode;
  tone?: ChipTone;
  className?: string;
};

const toneClasses: Record<ChipTone, string> = {
  light: "bg-paper text-ink-heading",
  dark: "bg-dark-surface text-paper",
  accent: "bg-accent-soft text-ink-heading",
  outline: "border border-current/25 bg-transparent text-current",
};

export function Chip({ children, tone = "light", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-[0.01em]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
