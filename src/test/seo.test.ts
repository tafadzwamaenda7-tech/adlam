import { describe, expect, it } from "vitest";

import { absoluteUrl, normalizeSiteUrl, pageMeta, sitemapPages } from "@/lib/seo";
import { navigation } from "@/lib/site-data";

describe("SEO", () => {
  it("normalizes site URLs without inventing a protocol", () => {
    expect(normalizeSiteUrl("  https://example.com/  ")).toBe("https://example.com");
    expect(normalizeSiteUrl("example.com/path/")).toBe("https://example.com/path");
    expect(normalizeSiteUrl("")).toBe("");
  });

  it("resolves absolute URLs from a request origin when no site URL is configured", () => {
    expect(absoluteUrl("/contact", "https://preview.example/")).toBe(
      "https://preview.example/contact",
    );
    expect(absoluteUrl("services", "https://preview.example")).toBe(
      "https://preview.example/services",
    );
  });

  it("gives every route canonical, Open Graph and Twitter metadata", () => {
    navigation.forEach(({ to }) => {
      const title = `Adlam Logistics | ${to}`;
      const description = `Adlam Logistics service information for ${to}.`;
      const { meta, links } = pageMeta({ title, description, path: to });

      expect(links).toEqual([{ rel: "canonical", href: absoluteUrl(to) }]);
      expect(meta).toContainEqual({ title });
      expect(meta).toContainEqual({ name: "description", content: description });
      expect(meta).toContainEqual({ property: "og:title", content: title });
      expect(meta).toContainEqual({ name: "twitter:title", content: title });
      expect(meta).toContainEqual({ property: "og:type", content: "website" });
      expect(meta).toContainEqual({
        name: "robots",
        content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      });
    });
  });

  it("includes all six public routes in the sitemap", () => {
    expect(sitemapPages.map((page) => page.path)).toEqual(navigation.map(({ to }) => to));
    expect(sitemapPages.every((page) => Number(page.priority) > 0)).toBe(true);
  });
});
