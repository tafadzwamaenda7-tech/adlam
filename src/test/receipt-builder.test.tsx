import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DocumentWorkspace } from "@/components/site/document-workspace";
import {
  InvoiceBuilder,
  QuotationBuilder,
  ReceiptBuilder,
} from "@/components/site/receipt-builder";

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

function headersIn(preview: HTMLElement): string[] {
  return within(preview)
    .getAllByRole("columnheader")
    .map((header) => header.textContent?.trim() ?? "");
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
    expect(screen.getByRole("button", { name: /Tumirai paWhatsApp/i })).toBeInTheDocument();
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

    fireEvent.click(screen.getByRole("button", { name: /Tumirai paWhatsApp/i }));

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
    const preview = screen.getByRole("region", { name: "Quotation preview" });

    expect(screen.getByLabelText("Quotation number")).toBeInTheDocument();
    expect(screen.getByLabelText("Valid until")).toBeInTheDocument();
    expect(preview).toBeInTheDocument();
    expect(
      within(preview).getByRole("img", { name: "Adlam Logistics letterhead" }),
    ).toHaveAttribute("src", "/Adlam_letterhead_updated.png");
    expect(within(preview).queryByRole("img", { name: "Adlam Logistics" })).not.toBeInTheDocument();
    expect(within(preview).getByText("Quotation")).toBeInTheDocument();
    expect(within(preview).getByText("Number")).toBeInTheDocument();
    expect(within(preview).queryByText("Accepted by")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Signatory")).toHaveValue("elolaam-chitsa");
    expect(
      within(preview).getByRole("img", { name: "Signature of Elolaam Chitsa" }),
    ).toHaveAttribute("src", "/WhatsApp%20Image%202026-11-27%20at%2019.13.28.jpeg");
    expect(screen.getByRole("button", { name: /Tora Chirevo/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dhinda Chirevo/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Chirevo Chitsva/ })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      /WhatsApp opens a chat with the quotation/,
    );

    fireEvent.change(screen.getByLabelText("Signatory"), { target: { value: "samantha-chitsa" } });

    expect(
      within(preview).getByRole("img", { name: "Signature of Samantha Chitsa" }),
    ).toHaveAttribute("src", "/WhatsApp%20Image%202026-11-27%20at%2019.18.53.jpeg");
    expect(preview).toHaveTextContent("Samantha Chitsa");
  });

  it("renders an invoice builder with invoice labels, dated lines and invoice actions", () => {
    render(<InvoiceBuilder />);
    const preview = screen.getByRole("region", { name: "Invoice preview" });

    expect(screen.getByLabelText("Invoice number")).toBeInTheDocument();
    expect(screen.getByLabelText("Invoice type")).toHaveValue("load");
    expect(screen.getByLabelText("Line date")).toBeInTheDocument();
    expect(within(preview).getByText("Invoice")).toBeInTheDocument();
    expect(
      within(preview).getByRole("img", { name: "Adlam Logistics letterhead" }),
    ).toHaveAttribute("src", "/Adlam_letterhead_updated.png");
    expect(within(preview).queryByRole("img", { name: "Adlam Logistics" })).not.toBeInTheDocument();
    expect(within(preview).queryByText("Receipt")).not.toBeInTheDocument();
    expect(within(preview).getByText("To customer")).toBeInTheDocument();
    expect(within(preview).queryByText("Bill to")).not.toBeInTheDocument();
    expect(within(preview).getByText("Number")).toBeInTheDocument();
    expect(within(preview).queryByText("Customer signature")).not.toBeInTheDocument();
    expect(within(preview).queryByText("Accepted by")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tora Invoice/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Dhinda Invoice/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Invoice Itsva/ })).toBeInTheDocument();
    expect(screen.getByText(/Zvekuita neinvoice/)).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/WhatsApp opens a chat with the invoice/);
  });

  it("lets the user choose any of the three signatures on an invoice", () => {
    render(<InvoiceBuilder />);
    const preview = screen.getByRole("region", { name: "Invoice preview" });
    const signatory = screen.getByLabelText("Signatory");

    expect(signatory).toHaveValue("elolaam-chitsa");
    expect(signatory).toHaveTextContent("Elolaam Chitsa");
    expect(signatory).toHaveTextContent("Samantha Chitsa");
    expect(signatory).toHaveTextContent("Harris Chitsa");

    fireEvent.change(signatory, { target: { value: "harris-chitsa" } });

    expect(
      within(preview).getByRole("img", { name: "Signature of Harris Chitsa" }),
    ).toHaveAttribute("src", "/WhatsApp%20Image%202026-11-27%20at%2019.19.07.jpeg");
    expect(preview).toHaveTextContent("Harris Chitsa");
  });

  it("switches an invoice to a monthly statement with a period and dated invoice number", () => {
    render(<InvoiceBuilder />);

    fireEvent.change(screen.getByLabelText("Invoice type"), { target: { value: "monthly" } });

    expect(screen.getByLabelText("Period from")).toBeInTheDocument();
    expect(screen.getByLabelText("Period to")).toBeInTheDocument();
    expect((screen.getByLabelText("Invoice number") as HTMLInputElement).value).toMatch(
      /^ADL-INV-M-\d{6}-\d{4}$/,
    );
    expect(screen.getByRole("region", { name: "Invoice preview" })).toHaveTextContent(
      "Monthly statement",
    );
  });

  it("lets the user swap, hide and restore columns while keeping quantity in the middle", () => {
    render(<InvoiceBuilder />);
    const preview = screen.getByRole("region", { name: "Invoice preview" });

    expect(headersIn(preview)).toEqual(["Date", "Description", "Qty", "Unit price", "Amount"]);

    fireEvent.click(screen.getByRole("button", { name: "Move Date right" }));

    expect(headersIn(preview)).toEqual(["Description", "Date", "Qty", "Unit price", "Amount"]);

    fireEvent.click(screen.getByRole("button", { name: "Hide Date column" }));

    expect(headersIn(preview)).not.toContain("Date");
    expect(screen.queryByLabelText("Line date")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Add Date column" }));

    expect(headersIn(preview)).toEqual(["Date", "Description", "Qty", "Unit price", "Amount"]);
    expect(screen.getByLabelText("Line date")).toBeInTheDocument();
  });

  it("offers only quotation and invoice in the document workspace", () => {
    render(<DocumentWorkspace />);

    expect(screen.getByRole("region", { name: "Invoice preview" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Receipts/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Receipt preview" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Quotations/i }));

    expect(screen.getByRole("region", { name: "Quotation preview" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Invoice preview" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Invoices/i }));

    expect(screen.getByRole("region", { name: "Invoice preview" })).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Quotation preview" })).not.toBeInTheDocument();
  });
});
