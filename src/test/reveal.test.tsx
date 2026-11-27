import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Reveal } from "@/components/site/reveal";

describe("Reveal", () => {
  it("exposes stable variant and stagger attributes while preserving delay", () => {
    render(
      <>
        <Reveal>Default content</Reveal>
        <Reveal variant="scale" index={2} delay={40}>
          Staggered content
        </Reveal>
      </>,
    );

    const defaultItem = screen.getByText("Default content");
    const staggeredItem = screen.getByText("Staggered content");

    expect(defaultItem).toHaveAttribute("data-variant", "rise");
    expect(defaultItem).toHaveAttribute("data-index", "0");
    expect(defaultItem).toHaveAttribute("data-visible", "true");

    expect(staggeredItem).toHaveAttribute("data-variant", "scale");
    expect(staggeredItem).toHaveAttribute("data-index", "2");
    expect(staggeredItem).toHaveStyle({ transitionDelay: "200ms" });
  });
});
