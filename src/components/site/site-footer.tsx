import { Link } from "@tanstack/react-router";

import { AddressLink } from "@/components/site/address-link";
import { Container } from "@/components/site/container";
import { Motto } from "@/components/site/motto";
import { navigation } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-4 pt-8 sm:px-6 sm:pb-6 sm:pt-10 lg:px-10 lg:pb-10 lg:pt-12">
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-[32px] bg-dark-surface text-paper shadow-card">
        <Container className="py-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-16">
            <Link to="/" className="flex w-fit items-center" aria-label="adlam investment, home">
              <img
                src="/adlam-logo-transparent.png"
                alt="adlam investment"
                width={1080}
                height={297}
                className="block h-auto w-[180px] brightness-0 invert sm:w-[216px]"
              />
            </Link>
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-2 sm:justify-end">
                {navigation.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-paper/80 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-paper"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-12 grid gap-10 border-t border-white/12 pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <p className="text-xs font-medium tracking-[0.08em] text-paper/60">Based in Harare</p>
              <AddressLink className="mt-3 inline-flex rounded-full text-base text-paper/85" />
            </div>
            <Motto className="text-paper/80" gloss />
          </div>
        </Container>
      </div>
    </footer>
  );
}
