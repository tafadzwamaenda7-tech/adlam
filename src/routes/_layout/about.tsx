import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { AddressLink } from "@/components/site/address-link";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { Motto } from "@/components/site/motto";
import { PillButton } from "@/components/site/pill-button";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { media } from "@/lib/media";
import { services } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_layout/about")({
  head: () => ({
    meta: [
      { title: "about | adlam investment" },
      {
        name: "description",
        content:
          "Based at 1119N Rainham Park, Harare, with local freight, grain supply, China procurement and goods-in-transit insurance.",
      },
      { property: "og:title", content: "about | adlam investment" },
      {
        property: "og:description",
        content: "Local freight, grain and procurement from a Harare base.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const serviceSpans = ["md:col-span-4", "md:col-span-4", "md:col-span-5", "md:col-span-3"] as const;

function AboutPage() {
  return (
    <>
      <section className="px-4 pt-28 sm:px-6 lg:px-10">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12">
            <Reveal className="h-full lg:col-span-5">
              <div className="flex h-full min-h-[620px] flex-col justify-between rounded-[32px] bg-ink p-8 text-paper shadow-card sm:p-12">
                <Chip tone="accent">Harare, Zimbabwe</Chip>
                <div className="mt-12">
                  <p className="text-xs font-medium tracking-[0.08em] text-paper/65">Our base</p>
                  <p className="mt-4 max-w-md text-2xl font-semibold leading-tight tracking-[-0.04em] text-paper font-display">
                    1119N Rainham Park.
                  </p>
                </div>
                <div className="mt-12">
                  <h1 className="text-[clamp(2.25rem,4vw,3.25rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
                    Work that starts in Rainham Park.
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/75">
                    adlam investment handles local freight, supplies grain and sources goods from
                    China for businesses in Harare and beyond. Our business is insured for goods in
                    transit.
                  </p>
                  <AddressLink className="mt-7 text-base text-paper/85" />
                </div>
              </div>
            </Reveal>

            <Reveal className="h-full lg:col-span-3" delay={90}>
              <ImagePanel
                image={media.grainSacks}
                objectPosition="center 42%"
                className="h-full min-h-[620px]"
              >
                <div className="mt-auto p-7">
                  <Chip tone="light">Grain supply</Chip>
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="h-full lg:col-span-4" delay={180}>
              <div className="grid h-full gap-4">
                <ImagePanel
                  image={media.fleetTrucks}
                  objectPosition="center 48%"
                  className="min-h-[300px]"
                >
                  <div className="mt-auto p-7">
                    <Chip tone="light">Five real vehicle types</Chip>
                  </div>
                </ImagePanel>
                <ImagePanel
                  image={media.grainKernels}
                  objectPosition="center 52%"
                  className="min-h-[300px]"
                >
                  <div className="mt-auto p-7">
                    <Chip tone="light">Delivered with our fleet</Chip>
                  </div>
                </ImagePanel>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              What we do.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Four services, run from 1119N Rainham Park, Harare, Zimbabwe.
            </p>
          </Reveal>
          <div className="mt-9 grid gap-4 md:grid-cols-12">
            {services.map((service, index) => (
              <Reveal key={service.id} className={cn("h-full", serviceSpans[index])}>
                <div className="flex h-full flex-col justify-between rounded-[28px] border border-border bg-card p-6 shadow-card sm:p-7">
                  <div>
                    <h3 className="text-2xl font-semibold leading-tight tracking-[-0.04em]">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-base leading-relaxed text-ink-muted">
                      {service.summary}
                    </p>
                  </div>
                  <Link
                    to="/services"
                    hash={`#${service.id}`}
                    className="mt-8 inline-flex items-center gap-2 rounded-full text-sm font-medium text-ink transition-opacity hover:opacity-70"
                  >
                    Service details
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <Container>
          <Reveal>
            <div className="grid gap-10 overflow-hidden rounded-[32px] bg-dark-surface p-8 text-paper shadow-card sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
              <div>
                <Chip tone="accent">Our motto</Chip>
                <Motto heading gloss className="mt-8 max-w-4xl text-paper" />
                <div className="mt-10 border-t border-white/12 pt-8">
                  <AddressLink className="text-base text-paper/80" />
                </div>
              </div>
              <PillButton variant="light" asChild>
                <Link to="/contact">Start a request</Link>
              </PillButton>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
