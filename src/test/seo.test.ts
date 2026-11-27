import { describe, expect, it } from "vitest";

import {
  absoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  DEFAULT_SITE_URL,
  normalizeSiteUrl,
  pageMeta,
  SITE_LAST_MODIFIED,
  sitemapPages,
  siteUrl,
} from "@/lib/seo";
import { navigation } from "@/lib/site-data";

describe("SEO", () => {
  it("normalizes site URLs safely", () => {
    expect(normalizeSiteUrl("  https://example.com/  ")).toBe("https://example.com");
    expect(normalizeSiteUrl("example.com/path/")).toBe("https://example.com/path");
    expect(normalizeSiteUrl("//example.com/")).toBe("https://example.com");
    expect(normalizeSiteUrl("HTTPS://Example.com/path/?x=1#top")).toBe("https://example.com/path");
    expect(normalizeSiteUrl("ftp://example.com")).toBe("");
    expect(normalizeSiteUrl("")).toBe("");
  });

  it("uses the live production domain by default", () => {
    expect(siteUrl).toBe(DEFAULT_SITE_URL);
    expect(DEFAULT_SITE_URL).toBe("https://www.adlamlogistics.co.zw");
    expect(absoluteUrl("/contact")).toBe("https://www.adlamlogistics.co.zw/contact");
    expect(absoluteUrl("services")).toBe("https://www.adlamlogistics.co.zw/services");
  });

  it("gives every route canonical, Open Graph and Twitter metadata", () => {
    navigation.forEach(({ to }) => {
      const title = `Adlam Logistics | ${to}`;
      const description = `Adlam Logistics service information for ${to}.`;
      const { meta, links } = pageMeta({ title, description, path: to });

      expect(links).toEqual([{ rel: "canonical", href: `https://www.adlamlogistics.co.zw${to}` }]);
      expect(meta).toContainEqual({ title });
      expect(meta).toContainEqual({ name: "description", content: description });
      expect(meta).toContainEqual({ property: "og:title", content: title });
      expect(meta).toContainEqual({ property: "og:locale", content: "en_ZW" });
      expect(meta).toContainEqual({
        property: "og:url",
        content: `https://www.adlamlogistics.co.zw${to}`,
      });
      expect(meta).toContainEqual({ name: "twitter:title", content: title });
      expect(meta).toContainEqual({ property: "og:type", content: "website" });
      expect(meta).toContainEqual({
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      });
    });
  });

  it("includes all public, site map and legal pages in the sitemap", () => {
    expect(sitemapPages.map((page) => page.path)).toEqual([
      ...navigation.map(({ to }) => to),
      "/site-map",
      "/privacy",
      "/cookies",
    ]);
    expect(sitemapPages.every((page) => Number(page.priority) > 0)).toBe(true);
    expect(sitemapPages.every((page) => /^\d{4}-\d{2}-\d{2}$/.test(page.lastmod))).toBe(true);
  });

  it("builds a valid sitemap with live-domain URLs and lastmod dates", () => {
    const xml = buildSitemapXml();

    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
    expect(xml).toContain("<loc>https://www.adlamlogistics.co.zw/</loc>");
    expect(xml).toContain("<loc>https://www.adlamlogistics.co.zw/contact</loc>");
    expect(xml.match(/<lastmod>/g)).toHaveLength(sitemapPages.length);
    expect(xml).toContain(`<lastmod>${SITE_LAST_MODIFIED}</lastmod>`);
    expect(xml).not.toContain("undefined");
  });

  it("builds a simple robots.txt that points to the live sitemap", () => {
    const robots = buildRobotsTxt();

    expect(robots).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://www.adlamlogistics.co.zw/sitemap.xml\n",
    );
    expect(robots.match(/User-agent:/g)).toHaveLength(1);
  });
});
