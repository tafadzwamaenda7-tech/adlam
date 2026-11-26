import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PoweredBy } from "@/components/site/powered-by";
import { brand } from "@/lib/site-data";

describe("PoweredBy", () => {
  it("renders the credit from site data", () => {
    const { container } = render(<PoweredBy />);

    expect(container).toHaveTextContent(`Powered by ${brand.poweredBy}`);
  });
});
