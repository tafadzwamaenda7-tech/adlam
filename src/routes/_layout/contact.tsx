import { createFileRoute } from "@tanstack/react-router";

import { AddressLink } from "@/components/site/address-link";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { Motto } from "@/components/site/motto";
import { QuoteForm } from "@/components/site/quote-form";
import { Reveal } from "@/components/site/reveal";
import { media } from "@/lib/media";

export const Route = createFileRoute("/_layout/contact")({
  head: () => ({
    meta: [
      { title: "contact | Adlam Logistics" },
      {
        name: "description",
        content:
          "Send freight, grain, China procurement and insurance details to Adlam Logistics, based at Ita 1119 Rainham Park, Harare, Zimbabwe.",
      },
      { property: "og:title", content: "contact | Adlam Logistics" },
      {
        property: "og:description",
        content: "Request a quote from Adlam Logistics in Harare.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="px-4 pb-10 pt-28 sm:px-6 sm:pb-12 lg:px-10">
      <Container>
        <div className="grid gap-4 lg:grid-cols-[5fr_7fr] lg:gap-6">
          <Reveal className="h-full">
            <ImagePanel
              image={media.doorHandover}
              objectPosition="center 42%"
              className="h-full min-h-[640px]"
            >
              <div className="flex h-full flex-col justify-between p-7 sm:p-10">
                <div>
                  <Chip tone="accent">Get in touch</Chip>
                  <h1 className="mt-7 max-w-[16ch] text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.045em]">
                    Tell us what you need moved.
                  </h1>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-paper/80">
                    Local freight, grain, procurement from China or goods-in-transit insurance. This
                    form reviews the request in your browser.
                  </p>
                </div>
                <div className="mt-12 border-t border-white/15 pt-8">
                  <p className="text-xs font-medium tracking-[0.08em] text-paper/60">Our base</p>
                  <AddressLink className="mt-3 text-base text-paper/85" />
                  <Motto className="mt-8 text-paper/80" gloss />
                </div>
              </div>
            </ImagePanel>
          </Reveal>

          <Reveal className="h-full" delay={90}>
            <div className="h-full rounded-[32px] border border-border bg-card p-7 shadow-card sm:p-10 lg:p-12">
              <QuoteForm />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
