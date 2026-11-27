import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocumentWorkspace } from "@/components/site/document-workspace";
import { QuotationBuilder, ReceiptBuilder } from "@/components/site/receipt-builder";

afterEach(() => {
  document.body.classList.remove("printing-receipt");
  vi.restoreAllMocks();
});

function fillRequiredReceiptFields() {
  fireEvent.change(screen.getByLabelText("Customer name"), {
    target: { value: "Tendai Moyo" },
  });
  fireEvent.change(screen.getByLabelText("Customer number"), {
    target: { value: "0772 123 456" },
  });
  fireEvent.change(screen.getByLabelText("Service"), {
    target: { value: "Grain supply" },
  });
  fireEvent.change(screen.getAllByLabelText("Description")[0]!, {
    target: { value: "Delivery of grain" },
  });
  fireEvent.change(screen.getAllByLabelText("Unit price")[0]!, {
    target: { value: "125" },
  });
}

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
    expect(screen.getByRole("button", { name: /Wedzera Mutsetse/ })).toBeInTheDocument();
    expect(screen.getByText(/Zvekuita nerisiti/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/Print opens your browser dialog/);
  });

  it("adds and removes lines and updates the VAT-inclusive preview", () => {
    render(<ReceiptBuilder />);

    fillRequiredReceiptFields();
    fireEvent.change(screen.getByLabelText("VAT rate (%)"), { target: { value: "15" } });

    expect(screen.getByText("USD 143.75")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Wedzera Mutsetse/ }));
    fireEvent.change(screen.getAllByLabelText("Qty")[1]!, { target: { value: "2" } });
    fireEvent.change(screen.getAllByLabelText("Description")[1]!, {
      target: { value: "Loading and offloading" },
    });
    fireEvent.change(screen.getAllByLabelText("Unit price")[1]!, { target: { value: "30" } });

    expect(screen.getByText("USD 212.75")).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /Bvisa Mutsetse/ })[1]!);

    expect(screen.getByText("USD 143.75")).toBeInTheDocument();
  });

  it("focuses the first invalid field and explains a blocked action", async () => {
    render(<ReceiptBuilder />);

    fireEvent.click(screen.getByRole("button", { name: /Tumirai paWhatsApp/ }));

    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText("Customer name"));
    });
    expect(screen.getByRole("status")).toHaveTextContent(/Complete the highlighted fields/);
  });

  it("restores the page after the print dialog closes", async () => {
    const printSpy = vi.fn();
    Object.defineProperty(window, "print", { value: printSpy, configurable: true });

    render(<ReceiptBuilder />);
    fillRequiredReceiptFields();

    fireEvent.click(screen.getByRole("button", { name: /Dhinda Risiti/ }));

    await waitFor(() => expect(printSpy).toHaveBeenCalledTimes(1));
    expect(document.body.classList.contains("printing-receipt")).toBe(true);

    fireEvent(window, new Event("afterprint"));

    expect(document.body.classList.contains("printing-receipt")).toBe(false);
  });

  it("renders a quotation builder with quotation-specific fields and actions", () => {
    render(<QuotationBuilder />);

    expect(screen.getByLabelText("Quotation number")).toBeInTheDocument();
    expect(screen.getByLabelText("Valid until")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Quotation preview" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tora Chirevo/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dhinda Chirevo/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chirevo Chitsva/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /WhatsApp opens a chat with the quotation/,
    );
  });

  it("switches between receipt and quotation in the document workspace", () => {
    render(<DocumentWorkspace />);

    expect(screen.getByRole("region", { name: "Receipt preview" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Quotations/i }));

    expect(screen.getByRole("region", { name: "Quotation preview" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Receipt preview" })).not.toBeInTheDocument();
  });
});
