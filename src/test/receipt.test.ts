import { describe, expect, it } from "vitest";

import {
  buildInvoiceWhatsappMessage,
  buildQuotationWhatsappMessage,
  buildReceiptWhatsappMessage,
  createInvoiceNumber,
  createQuotationNumber,
  createReceiptNumber,
  defaultDocumentColumns,
  documentLabel,
  formatReceiptAmount,
  itemAmount,
  receiptFileBase,
  receiptNumber,
  receiptTotals,
  resolvedColumns,
  toDateInputValue,
  toMonthBoundsInputValue,
  toValidUntilInputValue,
  toWhatsappDial,
  type ReceiptValues,
} from "@/lib/receipt";
import { brand } from "@/lib/site-data";

const sampleReceipt: ReceiptValues = {
  receiptNo: "ADL-20261126-1234",
  date: "2026-11-26",
  customerName: "Tendai Moyo",
  customerNumber: "0772 123 456",
  customerAddress: "12 Rainham Park, Harare",
  orderNo: "ORD-22",
  vatNo: "VAT-123",
  service: "Grain supply",
  items: [
    { quantity: "2", description: "Delivery of grain to Rainham Park", unitPrice: "125" },
    { quantity: "1", description: "Loading and offloading", unitPrice: "30" },
  ],
  currency: "USD",
  vatRate: "15",
  paymentMethod: "Cash on delivery",
  signature: "T Moyo",
  notes: "Handled by Adlam Logistics team.",
  footerNote: "Thank you for your business",
};

describe("receipt helpers", () => {
  it("builds a receipt number from the date and a supplied random source", () => {
    const date = new Date(2026, 10, 26);

    expect(toDateInputValue(date)).toBe("2026-11-26");
    expect(createReceiptNumber(date, () => 0.5)).toBe("ADL-20261126-5500");
  });

  it("builds a quotation number and a default valid-until date", () => {
    const date = new Date(2026, 10, 26);

    expect(createQuotationNumber(date, () => 0.5)).toBe("ADL-Q-20261126-5500");
    expect(toValidUntilInputValue(date, 14)).toBe("2026-12-10");
  });

  it("builds separate invoice numbers for single loads and monthly statements", () => {
    const date = new Date(2026, 10, 26);

    expect(createInvoiceNumber(date, "load", () => 0.5)).toBe("ADL-INV-20261126-5500");
    expect(createInvoiceNumber(date, "monthly", () => 0.5)).toBe("ADL-INV-M-202611-5500");
    expect(toMonthBoundsInputValue(date)).toEqual({ from: "2026-11-01", to: "2026-11-30" });
  });

  it("uses invoice column defaults and keeps required columns when restoring columns", () => {
    expect(documentLabel("invoice")).toBe("Invoice");
    expect(defaultDocumentColumns("invoice")).toEqual([
      "date",
      "description",
      "quantity",
      "unitPrice",
      "amount",
    ]);
    expect(defaultDocumentColumns("receipt")).toEqual([
      "description",
      "quantity",
      "unitPrice",
      "amount",
    ]);
    expect(resolvedColumns({ columns: ["date", "quantity", "date"] }, "invoice")).toEqual([
      "date",
      "quantity",
      "description",
      "amount",
    ]);
  });

  it("formats amounts with a currency fallback", () => {
    expect(formatReceiptAmount(1234.5, "USD")).toBe("USD 1,234.50");
    expect(formatReceiptAmount(10, "")).toBe("USD 10.00");
  });

  it("treats invalid and negative numeric input as zero", () => {
    expect(receiptNumber("12.5")).toBe(12.5);
    expect(receiptNumber("-4")).toBe(0);
    expect(receiptNumber("not a number")).toBe(0);
  });

  it("calculates line amounts and receipt totals", () => {
    expect(itemAmount({ quantity: "3", description: "Test", unitPrice: "12.5" })).toBe(37.5);
    expect(receiptTotals(sampleReceipt)).toEqual({ subtotal: 280, vat: 42, total: 322 });
    expect(receiptTotals({ items: [], vatRate: "15" })).toEqual({
      subtotal: 0,
      vat: 0,
      total: 0,
    });
  });

  it("converts customer numbers to WhatsApp dial format", () => {
    expect(toWhatsappDial("0772 123 456")).toBe("263772123456");
    expect(toWhatsappDial("+263 77 123 4567")).toBe("263771234567");
    expect(toWhatsappDial("00263 77 123 4567")).toBe("263771234567");
    expect(toWhatsappDial("+44 7700 900123")).toBe("447700900123");
    expect(toWhatsappDial("not a number")).toBe("");
  });

  it("builds a WhatsApp message with line items, totals and brand facts", () => {
    const message = buildReceiptWhatsappMessage(sampleReceipt);

    expect(message).toContain("Hello Tendai Moyo");
    expect(message).toContain("ADL-20261126-1234");
    expect(message).toContain("Grain supply");
    expect(message).toContain("Order number: ORD-22");
    expect(message).toContain("VAT number: VAT-123");
    expect(message).toContain("12 Rainham Park, Harare");
    expect(message).toContain("2 x USD 125.00 — Delivery of grain to Rainham Park");
    expect(message).toContain("Sub total: USD 280.00");
    expect(message).toContain("VAT (15%): USD 42.00");
    expect(message).toContain("Total: USD 322.00");
    expect(message).toContain("Cash on delivery");
    expect(message).toContain(brand.address);
    expect(message).toContain("Titumeyi || Tinoenda");
    expect(message).toContain("Tinosvika || Tinodzoka");
    expect(message.endsWith(`${brand.address}\n${brand.motto}`)).toBe(true);
  });

  it("builds a WhatsApp message for a quotation", () => {
    const message = buildQuotationWhatsappMessage({
      ...sampleReceipt,
      receiptNo: "ADL-Q-20261126-1234",
      validUntil: "2026-12-10",
    });

    expect(message).toContain("Here is your quotation from");
    expect(message).toContain("Quotation: ADL-Q-20261126-1234");
    expect(message).toContain("Valid until: 2026-12-10");
    expect(message).toContain("Payment terms: Cash on delivery");
    expect(message).toContain("Total: USD 322.00");
    expect(message).toContain("Signed by: Elolaam Chitsa");
    expect(message).not.toContain("Receipt:");
  });

  it("builds a WhatsApp message for a monthly invoice with dated lines", () => {
    const message = buildInvoiceWhatsappMessage({
      ...sampleReceipt,
      receiptNo: "ADL-INV-M-202611-1234",
      invoiceMode: "monthly",
      periodFrom: "2026-11-01",
      periodTo: "2026-11-30",
      items: [
        {
          date: "2026-11-04",
          quantity: "2",
          description: "Grain delivery",
          unitPrice: "125",
        },
      ],
    });

    expect(message).toContain("Here is your invoice from");
    expect(message).toContain("Invoice: ADL-INV-M-202611-1234");
    expect(message).toContain("Issue date: 2026-11-26");
    expect(message).toContain("Period: 2026-11-01 to 2026-11-30");
    expect(message).toContain("Invoice type: Monthly statement");
    expect(message).toContain("1. 2026-11-04 — 2 x USD 125.00 — Grain delivery");
    expect(message).toContain("Payment terms: Cash on delivery");
    expect(message).toContain("Signed by: Elolaam Chitsa");
    expect(message).not.toContain("Receipt:");
  });

  it("uses the selected signatory in the invoice WhatsApp message", () => {
    const message = buildInvoiceWhatsappMessage({
      ...sampleReceipt,
      receiptNo: "ADL-INV-20261126-1234",
      signatory: "harris-chitsa",
    });

    expect(message).toContain("Signed by: Harris Chitsa");
    expect(message).not.toContain("Signed by: Elolaam Chitsa");
  });

  it("creates a safe PDF filename from the receipt number", () => {
    expect(receiptFileBase(sampleReceipt)).toBe("ADL-20261126-1234");
    expect(receiptFileBase({ ...sampleReceipt, receiptNo: "ADL/2026 11" })).toBe("ADL-2026-11");
  });
});
