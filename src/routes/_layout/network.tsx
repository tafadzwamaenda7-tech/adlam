import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { AddressLink } from "@/components/site/address-link";
import { CTASection } from "@/components/site/cta-section";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { PillButton } from "@/components/site/pill-button";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { media } from "@/lib/media";

export const Route = createFileRoute("/_layout/network")({
  head: () => ({
    meta: [
      { title: "network | adlam investment" },
      {
        name: "description",
        content:
          "adlam investment is based at 1119N Rainham Park, Harare. Local distribution across Harare and beyond, and China procurement delivered to your company or home.",
      },
      { property: "og:title", content: "network | adlam investment" },
      {
        property: "og:description",
        content: "A Harare base, local distribution and door-to-door delivery from China.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NetworkPage,
});

const corridor = [
  {
    label: "China",
    title: "Packed in China",
    description: "We procure the goods before the move begins.",
    image: media.containerYard,
    objectPosition: "center 40%",
  },
  {
    label: "To Zimbabwe",
    title: "Freight to Harare",
    description: "We arrange the move through to our Rainham Park base.",
    image: media.truckRoad,
    objectPosition: "center 52%",
  },
  {
    label: "Final mile",
    title: "Delivered at your company or home",
    description: "Door-to-door delivery ends at the place you named.",
    image: media.doorDelivery,
    objectPosition: "center 34%",
  },
] as const;

function NetworkPage() {
  return (
    <>
      <section className="px-4 pt-28 sm:px-6 lg:px-10">
        <Container>
          <ImagePanel
            image={media.chinaPortAerial}
            className="min-h-[620px] sm:min-h-[580px]"
            eager
          >
            <div className="mt-auto grid gap-8 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <div className="max-w-3xl">
                <Chip tone="accent">China to Zimbabwe</Chip>
                <h1 className="mt-7 text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
                  From China to your door.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
                  Local distribution across Harare and beyond. Procurement from China with delivery
                  at your company or home.
                </p>
              </div>
              <div className="w-fit rounded-[28px] bg-paper p-6 text-ink shadow-float">
                <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">The route</p>
                <div className="mt-5 flex flex-wrap items-center gap-2 text-base font-semibold tracking-[-0.02em]">
                  <span>China</span>
                  <ArrowRight className="h-4 w-4 text-accent-quiet" aria-hidden="true" />
                  <span>Harare</span>
                  <ArrowRight className="h-4 w-4 text-accent-quiet" aria-hidden="true" />
                  <span>Your door</span>
                </div>
              </div>
            </div>
          </ImagePanel>
        </Container>
      </section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-[32px] bg-ink p-8 text-paper shadow-card sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-16">
              <div>
                <Chip tone="accent">Our base</Chip>
                <AddressLink className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-[-0.04em] text-paper" />
                <p className="mt-4 max-w-xl text-base leading-relaxed text-paper/70">
                  Freight, grain and orders from China all start from 1119N Rainham Park, Harare,
                  Zimbabwe.
                </p>
              </div>
              <PillButton variant="light" asChild>
                <Link to="/contact">Plan the move</Link>
              </PillButton>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <Reveal className="max-w-2xl">
            <Chip tone="accent">The corridor</Chip>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              How the move runs.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted">
              Procurement, the move to Zimbabwe, and delivery at your company or home.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {corridor.map((stop, index) => (
              <Reveal key={stop.label} delay={index * 90}>
                <ImagePanel
                  image={stop.image}
                  objectPosition={stop.objectPosition}
                  className="h-full min-h-[460px]"
                >
                  <div className="mt-auto p-7 sm:p-8">
                    <Chip tone="light">{stop.label}</Chip>
                    <h3 className="mt-6 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-[-0.04em]">
                      {stop.title}
                    </h3>
                    <p className="mt-3 text-base leading-relaxed text-paper/80">
                      {stop.description}
                    </p>
                  </div>
                </ImagePanel>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container className="grid gap-8 lg:grid-cols-[6fr_6fr] lg:gap-16">
          <Reveal className="h-full">
            <ImagePanel
              image={media.doorHandover}
              objectPosition="center 38%"
              className="h-full min-h-[440px]"
            >
              <div className="mt-auto p-7 sm:p-9">
                <Chip tone="light">Company or home</Chip>
                <h3 className="mt-6 max-w-[16ch] text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                  Delivery ends at your door.
                </h3>
              </div>
            </ImagePanel>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
              Local distribution.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink">
              Local delivery vehicles based in Rainham Park handle freight across Harare and beyond.
              Send the pickup and delivery points with your load details.
            </p>
            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
                <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                  Local freight
                </dt>
                <dd className="mt-3 text-lg font-medium text-ink">Harare and beyond</dd>
              </div>
              <div className="rounded-[24px] border border-border bg-card p-6 shadow-sm">
                <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                  China procurement
                </dt>
                <dd className="mt-3 text-lg font-medium text-ink">Your company or home</dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </Section>

      <CTASection
        title="Plan the move with us."
        description="Give us the origin, destination and timing. We will return the service and the next step."
        label="Plan the move"
      />
    </>
  );
}
