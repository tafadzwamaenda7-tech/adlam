import { createFileRoute } from "@tanstack/react-router";

import { CTASection } from "@/components/site/cta-section";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { media } from "@/lib/media";
import { sideCurtainTrucks, supportVehicles } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_layout/fleet")({
  head: () => ({
    meta: [
      { title: "fleet | Adlam Logistics" },
      {
        name: "description",
        content:
          "The Adlam Logistics fleet: skuta 3-wheel, twin cab and 5, 7 and 10-tonne side-curtain trucks.",
      },
      { property: "og:title", content: "fleet | Adlam Logistics" },
      {
        property: "og:description",
        content: "Skuta 3-wheel, twin cab and 5t, 7t and 10t side-curtain trucks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FleetPage,
});

const sideCurtainLayout = [
  {
    image: media.truck5t,
    objectPosition: "center 50%",
    span: "lg:col-span-5",
  },
  {
    image: media.truck7t,
    objectPosition: "center 50%",
    span: "lg:col-span-3",
  },
  {
    image: media.truck10t,
    objectPosition: "center 50%",
    span: "lg:col-span-4",
  },
] as const;

const supportLayout = [
  { image: media.skuta, objectPosition: "center 50%" },
  { image: media.truckRoad, objectPosition: "center 46%" },
] as const;

function FleetPage() {
  return (
    <>
      <section className="px-4 pt-28 sm:px-6 lg:px-10">
        <Container>
          <ImagePanel
            image={media.fleetTrucks}
            className="min-h-[620px] sm:min-h-[580px]"
            objectPosition="center 45%"
            eager
          >
            <div className="mt-auto grid gap-8 p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
              <div className="max-w-3xl">
                <Chip tone="accent">The fleet</Chip>
                <h1 className="mt-7 text-[clamp(2.5rem,5vw,4.25rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
                  The vehicles that do the work.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
                  Five vehicle types for different loads, including a twin cab and three
                  side-curtain sizes.
                </p>
              </div>
              <div className="w-fit max-w-xs rounded-[28px] bg-paper p-6 text-ink shadow-float">
                <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">The fleet</p>
                <p className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-ink-heading font-display">
                  Five real vehicle types
                </p>
                <p className="mt-3 text-sm text-ink-muted">
                  Three side-curtain sizes, a skuta 3-wheel and a twin cab.
                </p>
              </div>
            </div>
          </ImagePanel>
        </Container>
      </section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
                Side-curtain trucks.
              </h2>
            </Reveal>
            <Reveal delay={90}>
              <p className="max-w-md text-base leading-relaxed text-ink-muted">
                Three payload sizes, matched to the cargo you send.
              </p>
            </Reveal>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-12">
            {sideCurtainTrucks.map((vehicle, index) => {
              const layout = sideCurtainLayout[index as 0 | 1 | 2];
              return (
                <Reveal key={vehicle.id} className={cn("h-full", layout.span)}>
                  <ImagePanel
                    image={layout.image}
                    objectPosition={layout.objectPosition}
                    className="h-full min-h-[420px]"
                  >
                    <div className="mt-auto p-7 sm:p-8">
                      <Chip tone="light">{vehicle.label}</Chip>
                      <p className="mt-6 text-[clamp(4rem,8vw,6rem)] font-semibold leading-none tracking-[-0.06em] tabular-nums font-display">
                        {vehicle.measure}
                      </p>
                      <h3 className="mt-5 text-xl font-semibold tracking-[-0.035em]">
                        {vehicle.name}
                      </h3>
                    </div>
                  </ImagePanel>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
              Support vehicles.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              The skuta 3-wheel and twin cab handle local work alongside the side-curtain trucks.
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {supportVehicles.map((vehicle, index) => {
              const layout = supportLayout[index as 0 | 1];
              return (
                <Reveal key={vehicle.id} delay={index * 90}>
                  <div className="grid h-full overflow-hidden rounded-[28px] bg-card shadow-card sm:grid-cols-[0.85fr_1.15fr]">
                    <div className="min-h-[230px] overflow-hidden bg-secondary sm:min-h-full">
                      <img
                        src={layout.image.src}
                        alt={layout.image.alt}
                        width={layout.image.width}
                        height={layout.image.height}
                        style={{ objectPosition: layout.objectPosition }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between p-7">
                      <Chip tone="accent">{vehicle.label}</Chip>
                      <div className="mt-10">
                        <p className="text-4xl font-semibold leading-none tracking-[-0.05em] font-display">
                          {vehicle.measure}
                        </p>
                        <h3 className="mt-4 text-xl font-semibold tracking-[-0.035em]">
                          {vehicle.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <Container>
          <Reveal>
            <div className="rounded-[28px] border border-border bg-card p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-semibold tracking-[-0.04em]">
                Side curtains load from the side.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
                Send the cargo details and we will match the vehicle to the job.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <CTASection
        title="Match the vehicle to the job."
        description="Local freight, grain supply or a delivery from China. Send the details and we will return the plan."
        label="Ask about a vehicle"
      />
    </>
  );
}
