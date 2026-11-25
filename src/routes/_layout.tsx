import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

export const Route = createFileRoute("/_layout")({
  component: SiteLayout,
});

function SiteLayout() {
  return (
    <div className="page-bg relative flex min-h-screen flex-col overflow-x-hidden text-ink">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
