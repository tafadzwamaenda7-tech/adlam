import { brand, navigation, whatsappNumbers, type NavigationHref } from "@/lib/site-data";

/**
 * Update this date when published page content changes. Google uses it as a
 * recrawl signal, so keep it honest rather than setting it on every build.
 */
export const SITE_LAST_MODIFIED = "2026-11-27";

/** Live production domain. VITE_SITE_URL can override it in another environment. */
export const DEFAULT_SITE_URL = "https://www.adlamlogistics.co.zw";

export function normalizeSiteUrl(value?: string | null): string {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const candidate = trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  const withProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(candidate)
    ? candidate
    : `https://${candidate}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return "";

    const path = url.pathname.replace(/\/+$/, "");
    return `${url.origin}${path}`;
  } catch {
    return "";
  }
}

const configuredSiteUrl = normalizeSiteUrl(import.meta.env["VITE_SITE_URL"] ?? "");

export const siteUrl = configuredSiteUrl || DEFAULT_SITE_URL;

export function absoluteUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${siteUrl}${normalizedPath}`;
}

export interface SeoPage {
  readonly title: string;
  readonly description: string;
  readonly path: string;
}

export function pageMeta(page: SeoPage) {
  const canonical = absoluteUrl(page.path);
  const image = absoluteUrl("/adlam-logistics-logo.png");

  const meta = [
    { title: page.title },
    { name: "description", content: page.description },
    {
      name: "robots",
      content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: brand.name },
    { property: "og:locale", content: "en_ZW" },
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: `${brand.name} logo` },
    { property: "og:image:width", content: "664" },
    { property: "og:image:height", content: "193" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:url", content: canonical },
    { name: "twitter:image", content: image },
  ];

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function organizationJsonLd(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#organization`,
    url: siteUrl,
    name: brand.name,
    image: absoluteUrl("/adlam-logistics-logo.png"),
    telephone: whatsappNumbers.map((number) => `+${number.dial}`),
    contactPoint: whatsappNumbers.map((number) => ({
      "@type": "ContactPoint",
      telephone: `+${number.dial}`,
      contactType: "customer service",
      areaServed: "ZW",
      availableLanguage: ["en", "sn"],
    })),
    address: {
      "@type": "PostalAddress",
      streetAddress: "1119 Rainham Park",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
    areaServed: "Zimbabwe",
  };

  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

export type SitemapPath = NavigationHref | "/site-map" | "/privacy" | "/cookies";

const sitemapSettings: Record<
  SitemapPath,
  { readonly changefreq: string; readonly priority: string }
> = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/services": { changefreq: "monthly", priority: "0.9" },
  "/fleet": { changefreq: "monthly", priority: "0.8" },
  "/network": { changefreq: "monthly", priority: "0.8" },
  "/about": { changefreq: "monthly", priority: "0.7" },
  "/contact": { changefreq: "monthly", priority: "0.9" },
  "/site-map": { changefreq: "monthly", priority: "0.5" },
  "/privacy": { changefreq: "yearly", priority: "0.3" },
  "/cookies": { changefreq: "yearly", priority: "0.3" },
};

export const sitemapPages: ReadonlyArray<{
  path: SitemapPath;
  changefreq: string;
  priority: string;
  lastmod: string;
}> = [
  ...navigation.map(({ to }) => ({
    path: to,
    ...sitemapSettings[to],
    lastmod: SITE_LAST_MODIFIED,
  })),
  { path: "/site-map", ...sitemapSettings["/site-map"], lastmod: SITE_LAST_MODIFIED },
  { path: "/privacy", ...sitemapSettings["/privacy"], lastmod: SITE_LAST_MODIFIED },
  { path: "/cookies", ...sitemapSettings["/cookies"], lastmod: SITE_LAST_MODIFIED },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildSitemapXml(): string {
  const urls = sitemapPages
    .map(
      ({ path, changefreq, priority, lastmod }) => `  <url>
    <loc>${escapeXml(absoluteUrl(path))}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function buildRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${absoluteUrl("/sitemap.xml")}
`;
}
