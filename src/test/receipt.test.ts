import { describe, expect, it } from "vitest";

import {
  buildReceiptWhatsappMessage,
  createReceiptNumber,
  formatReceiptAmount,
  receiptFileBase,
  toDateInputValue,
  toWhatsappDial,
  type ReceiptValues,
} from "@/lib/receipt";
import { brand } from "@/lib/site-data";

const sampleReceipt: ReceiptValues = {
  receiptNo: "ADL-20261126-1234",
  date: "2026-11-26",
  customerName: "Tendai Moyo",
  customerNumber: "0772 123 456",
  service: "Grain supply",
  description: "Delivery of grain to Rainham Park",
  amount: "250",
  currency: "USD",
  paymentMethod: "Cash on delivery",
  notes: "Handled by Adlam Logistics team.",
};

describe("receipt helpers", () => {
  it("builds a receipt number from the date and a supplied random source", () => {
    const date = new Date(2026, 10, 26);

    expect(toDateInputValue(date)).toBe("2026-11-26");
    expect(createReceiptNumber(date, () => 0.5)).toBe("ADL-20261126-5500");
  });

  it("formats amounts with a currency fallback", () => {
    expect(formatReceiptAmount(1234.5, "USD")).toBe("USD 1,234.50");
    expect(formatReceiptAmount(10, "")).toBe("USD 10.00");
  });

  it("converts customer numbers to WhatsApp dial format", () => {
    expect(toWhatsappDial("0772 123 456")).toBe("263772123456");
    expect(toWhatsappDial("+263 77 123 4567")).toBe("263771234567");
    expect(toWhatsappDial("00263 77 123 4567")).toBe("263771234567");
    expect(toWhatsappDial("+44 7700 900123")).toBe("447700900123");
    expect(toWhatsappDial("not a number")).toBe("");
  });

  it("builds a WhatsApp message with the receipt details and brand facts", () => {
    const message = buildReceiptWhatsappMessage(sampleReceipt);

    expect(message).toContain("Hello Tendai Moyo");
    expect(message).toContain("ADL-20261126-1234");
    expect(message).toContain("Grain supply");
    expect(message).toContain("USD 250.00");
    expect(message).toContain("Cash on delivery");
    expect(message).toContain(brand.address);
    expect(message).toContain("Titumeyi || Tinoenda");
    expect(message).toContain("Tinosvika || Tinodzoka");
    expect(message.endsWith(`${brand.address}\n${brand.motto}`)).toBe(true);
  });

  it("creates a safe PDF filename from the receipt number", () => {
    expect(receiptFileBase(sampleReceipt)).toBe("ADL-20261126-1234");
    expect(receiptFileBase({ ...sampleReceipt, receiptNo: "ADL/2026 11" })).toBe("ADL-2026-11");
  });
});
