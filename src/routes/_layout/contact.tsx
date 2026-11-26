import { createFileRoute } from "@tanstack/react-router";

import { AddressLink } from "@/components/site/address-link";
import { Chip } from "@/components/site/chip";
import { Container } from "@/components/site/container";
import { ImagePanel } from "@/components/site/image-panel";
import { Motto } from "@/components/site/motto";
import { PillButton } from "@/components/site/pill-button";
import { QuoteForm } from "@/components/site/quote-form";
import { Reveal } from "@/components/site/reveal";
import { media } from "@/lib/media";
import { whatsappNumbers } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/_layout/contact")({
  head: () => ({
    meta: [
      { title: "Adlam Logistics | Contact" },
      {
        name: "description",
        content:
          "Contact Adlam Logistics about freight, grain, China procurement and insurance. Based at Ita 1119 Rainham Park, Harare, Zimbabwe.",
      },
      { property: "og:title", content: "Adlam Logistics | Contact" },
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
                    Local freight, grain, procurement from China or goods-in-transit insurance.
                    Review your request here, then send it through WhatsApp.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    {whatsappNumbers.map((number) => (
                      <PillButton
                        key={number.dial}
                        asChild
                        variant="outline"
                        className="border-white/25 bg-transparent text-paper shadow-none hover:bg-white/10 hover:text-paper hover:shadow-none"
                      >
                        <a
                          href={whatsappUrl(
                            number.dial,
                            "Hello Adlam Logistics, I would like to ask about a delivery.",
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          WhatsApp {number.label}
                        </a>
                      </PillButton>
                    ))}
                  </div>
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
