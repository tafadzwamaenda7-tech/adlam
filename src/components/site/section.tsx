import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type SectionTone = "paper" | "ink" | "muted";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone?: SectionTone;
};

const toneClasses: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  ink: "bg-dark-surface text-paper",
  muted: "bg-secondary text-ink",
};

export function Section({ tone = "paper", className, children, ...props }: SectionProps) {
  return (
    <section className={cn(toneClasses[tone], className)} {...props}>
      {children}
    </section>
  );
}
