import { Link, useLocation } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";

import { Container } from "@/components/site/container";
import { PillButton } from "@/components/site/pill-button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navigation } from "@/lib/site-data";

export function SiteHeader() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-paper/95 text-ink shadow-[0_10px_40px_-28px_rgb(11_43_46_/_0.45)]">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-3 focus:z-10 focus:rounded-full focus:bg-dark-surface focus:px-5 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <Container className="flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center" aria-label="Adlam Logistics, home">
          <img
            src="/adlam-logistics-logo.png"
            alt="Adlam Logistics"
            width={664}
            height={193}
            className="block h-auto w-[132px] sm:w-[156px]"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 rounded-full bg-secondary/80 p-1 lg:flex"
        >
          {navigation.map((item) => {
            const active =
              pathname === item.to || (item.to !== "/" && pathname.startsWith(`${item.to}/`));
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "rounded-full bg-card px-4 py-2 text-sm font-medium text-ink-heading shadow-sm"
                    : "rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-card hover:text-ink-heading"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <PillButton asChild className="hidden lg:inline-flex">
          <Link to="/contact">Request a quote</Link>
        </PillButton>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink-heading transition-colors hover:bg-secondary lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="flex w-[min(88vw,22rem)] flex-col gap-0 rounded-l-[32px] border-l-0 bg-paper p-0 text-ink shadow-float"
          >
            <SheetHeader className="border-b border-border p-6 text-left">
              <SheetTitle className="text-2xl font-semibold tracking-[-0.04em] text-ink-heading">
                Menu
              </SheetTitle>
              <SheetDescription className="text-sm text-ink-muted">
                Freight, grain and procurement
              </SheetDescription>
            </SheetHeader>
            <nav aria-label="Mobile navigation" className="px-4 py-6">
              <ul className="space-y-2">
                {navigation.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <li key={item.to}>
                      <SheetClose asChild>
                        <Link
                          to={item.to}
                          className={
                            active
                              ? "flex items-center justify-between rounded-2xl bg-dark-surface px-4 py-3.5 text-lg font-medium text-paper"
                              : "flex items-center justify-between rounded-2xl px-4 py-3.5 text-lg font-medium text-ink-heading hover:bg-secondary"
                          }
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="mt-auto border-t border-border p-6">
              <PillButton asChild className="w-full">
                <Link to="/contact">Request a quote</Link>
              </PillButton>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
}
