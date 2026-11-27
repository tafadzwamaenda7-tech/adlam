import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { AddressLink } from "@/components/site/address-link";
import { SectionLabel } from "@/components/site/bilingual-label";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { pageMeta } from "@/lib/seo";
import { brand, deliveryEnquiryMessage, navigation, whatsappNumbers } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/_layout/site-map")({
  head: () =>
    pageMeta({
      title: "Adlam Logistics | Site map",
      description:
        "Find every page on the Adlam Logistics website, including services, fleet, network, about, contact, receipts and quotations.",
      path: "/site-map",
    }),
  component: SiteMapPage,
});

const pageSummaries = {
  "/": "Who we are, what we move and how to reach us.",
  "/services": "Local freight, grain supply and procurement from China.",
  "/fleet": "The vehicles we use for each kind of load.",
  "/network": "Where we work, from Rainham Park to the corridor.",
  "/about": "Our base, our team and the work behind each delivery.",
  "/contact": "Requests, receipts, quotations and WhatsApp contacts.",
} as const;

const quickLinks = [
  { label: "Create a receipt or quotation", to: "/contact" },
  { label: "Ask for a price", to: "/contact" },
  { label: "See the fleet", to: "/fleet" },
  { label: "Explore our services", to: "/services" },
  { label: "Privacy policy", to: "/privacy" },
  { label: "Cookie policy", to: "/cookies" },
] as const;

function SiteMapPage() {
  return (
    <>
      <Section className="px-4 pt-28 sm:px-6 lg:px-10">
        <Container>
          <Reveal>
            <Chip tone="dark">{brand.name}</Chip>
            <p className="mt-8 text-xs font-medium tracking-[0.08em] text-ink-muted">
              <SectionLabel section="siteMap" />
            </p>
            <h1 className="mt-4 max-w-3xl text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              Every page, one place.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
              Use this site map to find a page quickly, jump to a request or get in touch with our
              team in Harare.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {navigation.map((item, index) => (
              <Reveal key={item.to} index={index} className="h-full">
                <Link
                  to={item.to}
                  className="group flex h-full flex-col justify-between rounded-[24px] border border-border bg-card p-6 shadow-card transition-colors hover:border-ink-heading hover:bg-secondary"
                >
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.03em] text-ink-heading">
                      {item.label}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                      {pageSummaries[item.to]}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-heading">
                    Open page
                    <ArrowUpRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Quick links</p>
              <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em]">
                Get to the useful bits.
              </h2>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {quickLinks.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <Link
                      to={link.to}
                      className="touch-surface inline-flex w-full items-center justify-between gap-4 rounded-full border border-border bg-card px-5 py-3 text-sm font-medium text-ink-heading transition-colors hover:bg-secondary"
                    >
                      {link.label}
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] bg-dark-surface p-8 text-paper shadow-card sm:p-10">
              <p className="text-xs font-medium tracking-[0.08em] text-paper/60">Our base</p>
              <AddressLink className="mt-4 text-base text-paper/90" />
              <p className="mt-8 text-xs font-medium tracking-[0.08em] text-paper/60">
                Call or WhatsApp
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {whatsappNumbers.map((number) => (
                  <a
                    key={number.dial}
                    href={whatsappUrl(number.dial, deliveryEnquiryMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="touch-surface rounded-full border border-paper/25 px-4 py-2 text-sm text-paper/90 transition-colors hover:bg-paper hover:text-dark-surface"
                  >
                    {number.label}
                  </a>
                ))}
              </div>
              <a
                href="/sitemap.xml"
                className="touch-surface mt-8 inline-flex items-center gap-2 text-sm text-paper/70 underline decoration-paper/40 underline-offset-4 transition-colors hover:text-paper"
              >
                XML sitemap
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
