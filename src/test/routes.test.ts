import { describe, expect, it } from "vitest";

import { media } from "@/lib/media";
import { sitemapPages } from "@/lib/seo";
import { navigation, services } from "@/lib/site-data";

const routeFiles = import.meta.glob("../routes/_layout/*.tsx");

describe("public routes", () => {
  it("has a route file for every public page", () => {
    const files = Object.keys(routeFiles)
      .map((path) => path.match(/\/([^/]+)\.tsx$/)?.[1] ?? "")
      .filter((name) => name !== "" && name !== "_layout")
      .sort();

    const expected = [
      ...navigation.map(({ to }) => (to === "/" ? "index" : to.slice(1))),
      "site-map",
      "privacy",
      "cookies",
    ].sort();

    expect(files).toEqual(expected);
  });

  it("has legal pages and includes them in the sitemap", () => {
    const files = Object.keys(routeFiles);
    const paths = sitemapPages.map((page) => page.path);

    expect(files).toContain("../routes/_layout/site-map.tsx");
    expect(files).toContain("../routes/_layout/privacy.tsx");
    expect(files).toContain("../routes/_layout/cookies.tsx");
    expect(paths).toContain("/site-map");
    expect(paths).toContain("/privacy");
    expect(paths).toContain("/cookies");
  });

  it("uses the requested contact hero image", () => {
    expect(media.contactEnquiry.src).toBe("/WhatsApp%20Image%202026-11-27%20at%2019.37.25.jpeg");
    expect(media.contactEnquiry.width).toBe(695);
    expect(media.contactEnquiry.height).toBe(1080);
  });

  it("keeps service anchors unique so in-page links resolve", () => {
    const ids = services.map((service) => service.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["local-freight", "grain-supply", "china-procurement"]);
  });
});
