import { ArrowUpRight } from "lucide-react";

import { SectionLabel } from "@/components/site/bilingual-label";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import {
  brand,
  deliveryEnquiryMessage,
  whatsappNumbers,
  type SectionLabelKey,
} from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

type LegalPageProps = {
  labelSection: SectionLabelKey;
  title: string;
  intro: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
  related: readonly { label: string; href: string }[];
};

export function LegalPage({
  labelSection,
  title,
  intro,
  lastUpdated,
  sections,
  related,
}: LegalPageProps) {
  return (
    <Section className="px-4 pt-28 sm:px-6 lg:px-10">
      <Container>
        <Reveal>
          <Chip tone="dark">{brand.name}</Chip>
          <p className="mt-8 text-xs font-medium tracking-[0.08em] text-ink-muted">
            <SectionLabel section={labelSection} />
          </p>
          <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">{intro}</p>
          <p className="mt-4 text-sm text-ink-muted">Last updated: {lastUpdated}</p>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-10">
          <article className="min-w-0 space-y-4">
            {sections.map((section, index) => (
              <Reveal key={section.id} index={index}>
                <section
                  id={section.id}
                  className="scroll-mt-28 rounded-[24px] border border-border bg-card p-6 shadow-card sm:p-8"
                >
                  <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink-heading sm:text-2xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-muted sm:text-base">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets ? (
                      <ul className="list-disc space-y-2 pl-5 marker:text-ink-heading">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              </Reveal>
            ))}
          </article>

          <aside className="h-fit rounded-[28px] border border-border bg-secondary p-6 sm:p-8 lg:sticky lg:top-28">
            <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">On this page</p>
            <nav aria-label="On this page">
              <ul className="mt-4 space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="touch-surface inline-flex rounded-full px-3 py-1.5 text-sm text-ink-heading transition-colors hover:bg-card"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-sm font-semibold text-ink-heading">Questions?</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Talk to us on WhatsApp or visit our Harare base.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {whatsappNumbers.map((number) => (
                  <a
                    key={number.dial}
                    href={whatsappUrl(number.dial, deliveryEnquiryMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-surface inline-flex rounded-full border border-border bg-card px-3 py-2 text-xs text-ink-heading transition-colors hover:bg-paper"
                  >
                    {number.label}
                  </a>
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{brand.address}</p>
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Related</p>
              <ul className="mt-3 space-y-2">
                {related.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="touch-surface inline-flex items-center gap-1.5 text-sm text-ink-heading underline decoration-current/30 underline-offset-4 transition-opacity hover:opacity-75"
                    >
                      {item.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
