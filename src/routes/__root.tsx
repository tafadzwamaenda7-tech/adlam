import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { PillButton } from "../components/site/pill-button";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="page-bg flex min-h-screen items-center px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-border bg-card p-8 shadow-card sm:p-12">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">404</p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
          This page was not found.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
          The address may have changed. Return home and choose a route.
        </p>
        <PillButton asChild className="mt-9">
          <Link to="/">Return home</Link>
        </PillButton>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="page-bg flex min-h-screen items-center px-4 py-24 sm:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-border bg-card p-8 shadow-card sm:p-12">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Error</p>
        <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.045em]">
          This page could not be loaded.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-muted">
          Try again, or return to the home page.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <PillButton
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </PillButton>
          <PillButton asChild variant="outline">
            <Link to="/">Return home</Link>
          </PillButton>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adlam Logistics | freight, grain and procurement" },
      {
        name: "description",
        content:
          "Adlam Logistics is based at 1119 Rainham Park, Harare, Zimbabwe. Local freight, grain supply and procurement from China with door-to-door delivery.",
      },
      { property: "og:title", content: "Adlam Logistics | freight, grain and procurement" },
      {
        property: "og:description",
        content:
          "Adlam Logistics is based at 1119 Rainham Park, Harare, Zimbabwe. Local freight, grain supply and procurement from China with door-to-door delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
