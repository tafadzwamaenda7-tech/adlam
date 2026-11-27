import { describe, expect, it } from "vitest";

import { navigation, services } from "@/lib/site-data";

const routeFiles = import.meta.glob("../routes/_layout/*.tsx");

describe("public routes", () => {
  it("has a route file for every navigation destination", () => {
    const files = Object.keys(routeFiles)
      .map((path) => path.match(/\/([^/]+)\.tsx$/)?.[1] ?? "")
      .filter((name) => name !== "" && name !== "_layout")
      .sort();

    const expected = navigation.map(({ to }) => (to === "/" ? "index" : to.slice(1))).sort();

    expect(files).toEqual(expected);
  });

  it("keeps service anchors unique so in-page links resolve", () => {
    const ids = services.map((service) => service.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(["local-freight", "grain-supply", "china-procurement"]);
  });
});
