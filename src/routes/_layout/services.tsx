import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { CTASection } from "@/components/site/cta-section";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { PillButton } from "@/components/site/pill-button";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { media } from "@/lib/media";
import {
  chinaProcurementService,
  chinaProcurementSpecs,
  faqs,
  goodsInTransitInsuranceService,
  grainSupplyService,
  localFreightService,
} from "@/lib/site-data";

export const Route = createFileRoute("/_layout/services")({
  head: () => ({
    meta: [
      { title: "services | adlam investment" },
      {
        name: "description",
        content:
          "Local freight, grain supply, China procurement with door-to-door delivery, and goods-in-transit insurance from adlam investment.",
      },
      { property: "og:title", content: "services | adlam investment" },
      {
        property: "og:description",
        content: "Freight, grain, procurement and cover from a Harare base.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const serviceNotes = [
  {
    label: "What we carry",
    value: "Freight, grain and goods sourced in China",
  },
  {
    label: "Where it goes",
    value: "Harare and beyond, then your delivery point",
  },
  {
    label: "Who it reaches",
    value: "Your company or your home",
  },
] as const;

function ServicesPage() {
  return (
    <>
      <section className="px-4 pt-28 sm:px-6 lg:px-10">
        <Container>
          <ImagePanel
            image={media.warehouse}
            className="min-h-[620px] sm:min-h-[560px]"
            objectPosition="center 36%"
            eager
          >
            <div className="mt-auto max-w-3xl p-7 sm:p-12">
              <Chip tone="accent">Our services</Chip>
              <h1 className="mt-7 text-[clamp(2.25rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
                The work we do, from a load across town to a container from China.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80 sm:text-lg">
                Four services from 1119N Rainham Park, Harare. Each one starts with what you need
                moved.
              </p>
              <PillButton variant="light" asChild className="mt-8">
                <Link to="/contact">Ask about a service</Link>
              </PillButton>
            </div>
          </ImagePanel>
        </Container>
      </section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12">
            <Reveal className="h-full lg:col-span-7">
              <ImagePanel image={media.truckLoading} className="h-full min-h-[480px]">
                <div className="mt-auto max-w-xl p-7 sm:p-9">
                  <Chip tone="light">Local freight</Chip>
                  <h2
                    id={localFreightService.id}
                    className="mt-6 scroll-mt-28 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]"
                  >
                    {localFreightService.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-paper/80">
                    {localFreightService.detail}
                  </p>
                  <Link
                    to="/fleet"
                    className="mt-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-paper transition-opacity hover:opacity-75"
                  >
                    See the vehicles <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="h-full lg:col-span-5" delay={90}>
              <div className="flex h-full min-h-[480px] flex-col justify-between rounded-[28px] bg-ink p-7 text-paper shadow-card sm:p-9">
                <div>
                  <Chip tone="accent">Matched to the load</Chip>
                  <p className="mt-7 text-2xl font-semibold leading-tight tracking-[-0.04em]">
                    From a 3-wheel skuta to 10-tonne side curtains.
                  </p>
                </div>
                <ul className="mt-10 flex flex-wrap gap-2" aria-label="Local freight details">
                  {localFreightService.points.map((point) => (
                    <li key={point}>
                      <Chip tone="outline" className="border-white/25 text-paper/80">
                        {point}
                      </Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-4 lg:grid-cols-12">
            <Reveal className="h-full lg:col-span-5">
              <ImagePanel
                image={media.grainDrying}
                className="h-full min-h-[500px]"
                objectPosition="center 48%"
              >
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Grain supply</Chip>
                  <h2
                    id={grainSupplyService.id}
                    className="mt-6 scroll-mt-28 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]"
                  >
                    {grainSupplyService.title}
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-paper/80">
                    {grainSupplyService.summary}
                  </p>
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="h-full lg:col-span-7" delay={90}>
              <div className="grid h-full gap-4">
                <ImagePanel
                  image={media.grainKernels}
                  className="min-h-[250px]"
                  objectPosition="center 52%"
                >
                  <div className="mt-auto p-7">
                    <Chip tone="light">Grain in detail</Chip>
                  </div>
                </ImagePanel>
                <div className="flex flex-col justify-between rounded-[28px] border border-border bg-card p-7 shadow-card sm:p-9">
                  <p className="max-w-2xl text-lg leading-relaxed text-ink">
                    {grainSupplyService.detail}
                  </p>
                  <dl className="mt-8 grid gap-5 sm:grid-cols-3">
                    {grainSupplyService.points.map((point) => (
                      <div key={point}>
                        <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                          Included
                        </dt>
                        <dd className="mt-2 text-base leading-relaxed text-ink">{point}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <Reveal className="max-w-2xl">
            <Chip tone="accent">Procurement from China</Chip>
            <h2
              id={chinaProcurementService.id}
              className="mt-6 scroll-mt-28 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]"
            >
              {chinaProcurementService.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-muted">
              {chinaProcurementService.summary}
            </p>
          </Reveal>

          <div className="mt-9 grid gap-4 lg:grid-cols-[5fr_7fr]">
            <Reveal className="h-full">
              <ImagePanel
                image={media.chinaPort}
                className="h-full min-h-[520px]"
                objectPosition="center 38%"
              >
                <div className="mt-auto p-7 sm:p-9">
                  <Chip tone="light">Packed in China</Chip>
                </div>
              </ImagePanel>
            </Reveal>

            <Reveal className="h-full" delay={90}>
              <div className="grid h-full gap-4">
                <ImagePanel
                  image={media.doorDelivery}
                  className="min-h-[300px]"
                  objectPosition="center 34%"
                >
                  <div className="mt-auto p-7 sm:p-9">
                    <Chip tone="light">Delivered at your door</Chip>
                  </div>
                </ImagePanel>
                <div className="rounded-[28px] border border-border bg-card p-7 shadow-card sm:p-9">
                  <p className="max-w-2xl text-lg leading-relaxed text-ink">
                    {chinaProcurementService.detail}
                  </p>
                  <dl className="mt-8 grid gap-3 sm:grid-cols-3">
                    {chinaProcurementSpecs.map((spec) => (
                      <div key={spec.label} className="rounded-2xl bg-secondary/70 p-4">
                        <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                          {spec.label}
                        </dt>
                        <dd className="mt-2 text-base leading-relaxed text-ink">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
        <Container>
          <div className="overflow-hidden rounded-[32px] bg-dark-surface p-8 text-paper shadow-card sm:p-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start lg:gap-12">
              <div className="border-l-4 border-accent-quiet pl-6">
                <p className="text-xs font-medium tracking-[0.08em] text-paper/60">Cover</p>
                <p className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-paper font-display">
                  Our business is insured for goods in transit.
                </p>
              </div>
              <div>
                <Chip tone="accent">Goods-in-transit insurance</Chip>
                <h2
                  id={goodsInTransitInsuranceService.id}
                  className="mt-6 scroll-mt-28 text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]"
                >
                  {goodsInTransitInsuranceService.title}
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-paper/85">
                  {goodsInTransitInsuranceService.detail}
                </p>
                <div className="mt-8 flex flex-wrap gap-2">
                  {goodsInTransitInsuranceService.points.map((point) => (
                    <Chip key={point} tone="outline" className="border-white/25 text-paper/80">
                      {point}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section tone="muted" className="py-12 sm:py-16">
        <Container>
          <Reveal className="max-w-2xl">
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
              A short version for choosing.
            </h2>
          </Reveal>
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {serviceNotes.map((note, index) => (
              <Reveal key={note.label} delay={index * 80}>
                <div className="h-full rounded-[24px] border border-border bg-card p-6 shadow-sm">
                  <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                    {note.label}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-ink">{note.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container className="grid gap-10 lg:grid-cols-[4fr_8fr] lg:gap-16">
          <Reveal>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.08] tracking-[-0.045em]">
              Questions we get.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-ink-muted">
              Send anything else with your load details.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </Container>
      </Section>

      <CTASection
        title="Tell us what you need."
        description="Freight, grain, a delivery from China, or a question about cover. Send the details and we will return the next step."
        label="Ask about a service"
      />
    </>
  );
}
