import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";

import { AddressLink } from "@/components/site/address-link";
import { SectionLabel } from "@/components/site/bilingual-label";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { CtaInlineLink, CtaLink } from "@/components/site/cta-link";
import { ImagePanel } from "@/components/site/image-panel";
import { Motto } from "@/components/site/motto";
import { ProofRow } from "@/components/site/proof-row";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { media } from "@/lib/media";
import { pageMeta } from "@/lib/seo";
import { fleetVehicles } from "@/lib/site-data";

export const Route = createFileRoute("/_layout/")({
  head: () =>
    pageMeta({
      title: "Adlam Logistics | Freight, Grain & Procurement in Harare",
      description:
        "Adlam Logistics provides local freight, grain supply and procurement from China with door-to-door delivery from its Harare base.",
      path: "/",
    }),
  component: HomePage,
});

const fleetImages = [
  media.truck5t,
  media.truck7t,
  media.truck10t,
  media.skuta,
  media.fleetTrucks,
] as const;

function HomePage() {
  const heroVisualRef = useRef<HTMLDivElement>(null);

  function handleHeroPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const element = heroVisualRef.current;
    if (!element || event.pointerType !== "mouse") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) {
      return;
    }

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    element.style.setProperty("--tilt-y", `${(x * 4).toFixed(2)}deg`);
    element.style.setProperty("--tilt-x", `${(-y * 3).toFixed(2)}deg`);
  }

  function handleHeroPointerLeave() {
    heroVisualRef.current?.style.setProperty("--tilt-x", "0deg");
    heroVisualRef.current?.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <>
      <section
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative isolate min-h-[720px] overflow-hidden bg-dark-surface text-paper sm:min-h-[82vh]"
      >
        <div ref={heroVisualRef} className="hero-3d absolute inset-0 -z-30">
          <img
            src={media.truckRoad.src}
            alt={media.truckRoad.alt}
            width={media.truckRoad.width}
            height={media.truckRoad.height}
            className="h-full w-full scale-[1.05] object-cover object-[64%_center]"
          />
          <div className="absolute inset-0 bg-dark-surface/62" aria-hidden="true" />
        </div>
        <Container className="relative flex min-h-[720px] flex-col justify-end pb-12 pt-32 sm:min-h-[82vh] sm:pb-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <Reveal
              index={0}
              className="page-load-item max-w-3xl rounded-[32px] border border-white/14 bg-dark-surface/95 p-7 shadow-float sm:p-10"
            >
              <h1 className="max-w-[18ch] text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
                Freight, grain and orders from China, delivered to your door.
              </h1>
              <div className="mt-6 h-1 w-16 rounded-pill bg-accent" aria-hidden="true" />
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
                Local freight, grain supply and China procurement, based at 1119 Rainham Park,
                Harare.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <CtaLink cta="sendDetails" to="/contact" variant="light" />
                <CtaLink
                  cta="seeServices"
                  to="/services"
                  variant="outline"
                  className="border-white/30 bg-transparent text-paper hover:bg-white/10"
                />
              </div>
            </Reveal>
            <Reveal delay={120} index={1} className="page-load-item hidden xl:block">
              <div className="w-[300px] rounded-[28px] bg-paper p-6 text-ink shadow-float">
                <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                  <SectionLabel section="ourBase" />
                </p>
                <AddressLink className="mt-3 text-base text-ink" />
                <div className="mt-6 h-1.5 w-16 rounded-pill bg-accent" aria-hidden="true" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <ProofRow />
        </Container>
      </Section>

      <Section tone="paper" className="pb-10 pt-6 sm:pb-14">
        <Container>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
                What we do.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="max-w-xl text-base leading-relaxed text-ink-muted">
                Three services from a Harare base. Each one starts with the cargo and ends at the
                place you named.
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            <Reveal className="sm:col-span-2 lg:col-span-6">
              <ImagePanel image={media.fleetTrucks} className="h-full min-h-[380px]">
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Local freight and distribution</Chip>
                  <h3 className="mt-6 max-w-[16ch] text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                    Across Harare and beyond.
                  </h3>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-paper/80">
                    Vehicles matched to the load, from a 3-wheel skuta to side curtains.
                  </p>
                  <CtaInlineLink
                    cta="exploreFreight"
                    to="/services"
                    hash="local-freight"
                    className="mt-6 text-paper"
                  />
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="lg:col-span-6">
              <ImagePanel
                image={media.grainSacks}
                className="h-full min-h-[380px]"
                objectPosition="center 42%"
              >
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Grain supply</Chip>
                  <h3 className="mt-6 max-w-[14ch] text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                    Grain, delivered with our fleet.
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-paper/80">
                    Send the quantity and delivery point and receive the supply and delivery plan.
                  </p>
                  <CtaInlineLink
                    cta="exploreGrain"
                    to="/services"
                    hash="grain-supply"
                    className="mt-6 text-paper"
                  />
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="sm:col-span-2 lg:col-span-12">
              <ImagePanel image={media.chinaPortAerial} className="h-full min-h-[320px]">
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Procurement from China</Chip>
                  <h3 className="mt-6 max-w-[22ch] text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                    Sourced in China. Delivered at your company or home.
                  </h3>
                  <CtaInlineLink
                    cta="exploreProcurement"
                    to="/services"
                    hash="china-procurement"
                    className="mt-6 text-paper"
                  />
                </div>
              </ImagePanel>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="py-14 sm:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <Reveal>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                The vehicles behind the work.
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <CtaInlineLink
                cta="seeFleet"
                to="/fleet"
                className="border border-border bg-card px-5 py-2.5 text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-100 hover:shadow-float"
              />
            </Reveal>
          </div>
          <div
            role="region"
            aria-label="Fleet vehicles"
            tabIndex={0}
            className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-4 sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:px-0 lg:pb-0"
          >
            {fleetVehicles.map((vehicle, index) => {
              const image = fleetImages[index as 0 | 1 | 2 | 3 | 4];
              return (
                <Reveal
                  key={vehicle.id}
                  variant="scale"
                  index={index}
                  className="min-w-[240px] snap-start sm:min-w-[260px] lg:min-w-0"
                >
                  <div className="h-full rounded-[28px] border border-border bg-card p-4 shadow-card">
                    <div className="h-36 overflow-hidden rounded-[20px] bg-secondary">
                      <img
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <Chip tone="light">{vehicle.label}</Chip>
                      <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] tabular-nums text-ink-heading font-display">
                        {vehicle.measure}
                      </p>
                      <p className="mt-2 text-base leading-relaxed text-ink-muted">
                        {vehicle.name}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-14 sm:py-20">
        <Container>
          <Reveal className="max-w-2xl">
            <Chip tone="accent">
              <SectionLabel section="chinaToZimbabwe" />
            </Chip>
            <h2 className="mt-6 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
              From China to your door.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">
              We source the goods in China, move them through Harare, then deliver at your company
              or home.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-[8fr_4fr]">
            <Reveal className="h-full">
              <ImagePanel
                image={media.chinaPortAerial}
                className="h-full min-h-[460px] sm:min-h-[520px]"
              >
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Sourced in China</Chip>
                  <h3 className="mt-6 max-w-[18ch] text-[clamp(1.75rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
                    One move, from port to your door.
                  </h3>
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-medium text-paper/90">
                    <span>China</span>
                    <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span>Harare</span>
                    <ArrowRight className="h-4 w-4 text-accent" aria-hidden="true" />
                    <span>Company or home</span>
                  </div>
                </div>
              </ImagePanel>
            </Reveal>
            <Reveal className="h-full" delay={90}>
              <div className="grid h-full gap-4">
                <ImagePanel
                  image={media.doorDelivery}
                  className="min-h-[260px]"
                  objectPosition="center 34%"
                >
                  <div className="mt-auto p-6 sm:p-7">
                    <Chip tone="light">Door to door</Chip>
                    <p className="mt-4 text-lg font-medium leading-snug tracking-[-0.02em]">
                      Delivered at your company or home.
                    </p>
                  </div>
                </ImagePanel>
                <div className="rounded-[28px] border border-border bg-card p-6 shadow-card sm:p-7">
                  <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Our base</p>
                  <AddressLink className="mt-3 text-base text-ink" />
                  <p className="mt-5 text-sm leading-relaxed text-ink-muted">
                    The move runs through our Harare base before the final delivery.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-dark-surface px-8 py-14 text-paper shadow-card sm:px-14 sm:py-20">
          <Reveal>
            <div className="h-1 w-16 rounded-pill bg-accent" aria-hidden="true" />
            <Motto heading className="mt-8 max-w-4xl text-paper" />
            <div className="mt-10 flex flex-col gap-6 border-t border-white/12 pt-8 sm:flex-row sm:items-end sm:justify-between">
              <AddressLink className="text-base text-paper/80" />
              <CtaLink cta="sendDetails" to="/contact" variant="light" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
