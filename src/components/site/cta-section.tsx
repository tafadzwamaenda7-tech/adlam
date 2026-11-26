import { Reveal } from "@/components/site/reveal";
import { CtaLink } from "@/components/site/cta-link";
import { Container } from "@/components/site/container";
import type { CtaKey } from "@/lib/site-data";
import type { ReactNode } from "react";

type CTASectionProps = {
  title: ReactNode;
  description: string;
  cta: CtaKey;
};

export function CTASection({ title, description, cta }: CTASectionProps) {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-dark-surface px-7 py-12 text-paper shadow-card sm:px-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <Reveal>
            <h2 className="max-w-[20ch] text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              {title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/75 sm:text-lg">
              {description}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <CtaLink cta={cta} to="/contact" variant="light" className="w-full sm:w-auto" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
