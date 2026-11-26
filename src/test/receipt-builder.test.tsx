import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ReceiptBuilder } from "@/components/site/receipt-builder";

describe("ReceiptBuilder", () => {
  it("renders the logo letterhead, form, delivery actions and print-ready preview", () => {
    render(<ReceiptBuilder />);

    expect(screen.getByRole("img", { name: "Adlam Logistics" })).toHaveAttribute(
      "src",
      "/adlam-logo.jpeg",
    );
    expect(screen.getByRole("region", { name: "Receipt preview" })).toBeInTheDocument();
    expect(screen.getByLabelText("Customer name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dhinda Risiti/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tumirai paWhatsApp/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tora Risiti/ })).toBeInTheDocument();
    expect(screen.getByText(/Zvekuita nerisiti/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Print opens your browser dialog/);
  });
});
