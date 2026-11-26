import { Link } from "@tanstack/react-router";

import { AddressLink } from "@/components/site/address-link";
import { Container } from "@/components/site/container";
import { Motto } from "@/components/site/motto";
import { PoweredBy } from "@/components/site/powered-by";
import { navigation } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pb-10 lg:pt-12">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] border border-border bg-card text-ink shadow-card">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <Link to="/" className="flex w-fit items-center" aria-label="Adlam Logistics, home">
              <img
                src="/adlam-logistics-logo.png"
                alt="Adlam Logistics"
                width={664}
                height={193}
                className="block h-auto w-[200px] sm:w-[240px]"
              />
            </Link>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-2 sm:justify-end">
                {navigation.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex rounded-full border border-border px-4 py-2 text-sm text-ink-muted transition-colors hover:border-accent-quiet hover:bg-secondary hover:text-ink-heading"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 grid gap-10 border-t border-border pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
                Based in Harare
              </p>
              <AddressLink className="mt-3 inline-flex rounded-full text-base text-ink-muted" />
              <PoweredBy className="mt-4" />
            </div>
            <Motto className="text-ink-muted" gloss />
          </div>
        </Container>
      </div>
    </footer>
  );
}
