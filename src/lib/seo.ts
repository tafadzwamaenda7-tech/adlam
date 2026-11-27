import { brand, navigation, whatsappNumbers, type NavigationHref } from "@/lib/site-data";

const configuredSiteUrl = String(import.meta.env["VITE_SITE_URL"] ?? "").trim();

export function normalizeSiteUrl(value?: string | null): string {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withProtocol.replace(/\/+$/, "");
}

export const siteUrl = normalizeSiteUrl(configuredSiteUrl);

export function absoluteUrl(path: string, origin?: string | null): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const base = siteUrl || normalizeSiteUrl(origin);

  return base ? `${base}${normalizedPath}` : normalizedPath;
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
    { property: "og:title", content: page.title },
    { property: "og:description", content: page.description },
    { property: "og:image", content: image },
    { property: "og:image:alt", content: `${brand.name} logo` },
    { property: "og:image:width", content: "664" },
    { property: "og:image:height", content: "193" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: page.title },
    { name: "twitter:description", content: page.description },
    { name: "twitter:image", content: image },
  ];

  if (siteUrl) {
    meta.push(
      { property: "og:url", content: canonical },
      { name: "twitter:url", content: canonical },
    );
  }

  return {
    meta,
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function organizationJsonLd(): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: brand.name,
    url: siteUrl || undefined,
    image: siteUrl ? absoluteUrl("/adlam-logistics-logo.png") : undefined,
    telephone: whatsappNumbers.map((number) => `+${number.dial}`),
    address: {
      "@type": "PostalAddress",
      streetAddress: "1119 Rainham Park",
      addressLocality: "Harare",
      addressCountry: "ZW",
    },
  };

  return JSON.stringify(schema).replace(/</g, "\\u003c");
}

const sitemapSettings: Record<
  NavigationHref,
  { readonly changefreq: string; readonly priority: string }
> = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/services": { changefreq: "monthly", priority: "0.9" },
  "/fleet": { changefreq: "monthly", priority: "0.8" },
  "/network": { changefreq: "monthly", priority: "0.8" },
  "/about": { changefreq: "monthly", priority: "0.7" },
  "/contact": { changefreq: "monthly", priority: "0.9" },
};

export const sitemapPages = navigation.map(({ to }) => ({
  path: to,
  ...sitemapSettings[to],
}));
