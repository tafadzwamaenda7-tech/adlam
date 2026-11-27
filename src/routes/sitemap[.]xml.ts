import { createFileRoute } from "@tanstack/react-router";

import { buildSitemapXml, SITE_LAST_MODIFIED } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const xml = buildSitemapXml();

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, must-revalidate",
            "Last-Modified": new Date(`${SITE_LAST_MODIFIED}T00:00:00Z`).toUTCString(),
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
