import { brand } from "@/lib/site-data";

export interface ReceiptValues {
  receiptNo: string;
  date: string;
  customerName: string;
  customerNumber: string;
  service: string;
  description: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  notes: string;
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function createReceiptNumber(date: Date, random: () => number = Math.random): string {
  const datePart = toDateInputValue(date).replace(/-/g, "");
  const suffix = Math.floor(random() * 9000) + 1000;

  return `ADL-${datePart}-${suffix}`;
}

export function formatReceiptAmount(amount: number, currency: string): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);

  return `${currency.trim() || "USD"} ${formatted}`;
}

export function toWhatsappDial(value: string): string {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("263")) return digits;
  if (digits.startsWith("0")) return `263${digits.slice(1)}`;

  return digits;
}

export function buildReceiptWhatsappMessage(values: ReceiptValues): string {
  const lines = [
    `Hello ${values.customerName.trim()},`,
    "",
    `Here is your receipt from ${brand.name}.`,
    "",
    `Receipt: ${values.receiptNo.trim()}`,
    `Date: ${values.date.trim()}`,
    `Service: ${values.service.trim()}`,
    `Description: ${values.description.trim()}`,
    `Amount: ${formatReceiptAmount(Number(values.amount), values.currency)}`,
  ];

  if (values.paymentMethod.trim()) {
    lines.push(`Payment method: ${values.paymentMethod.trim()}`);
  }

  if (values.notes.trim()) {
    lines.push(`Notes: ${values.notes.trim()}`);
  }

  lines.push("", brand.address, brand.motto, brand.mottoGloss);

  return lines.join("\n");
}

export function receiptFileBase(values: ReceiptValues): string {
  const safe = values.receiptNo.trim().replace(/[^a-zA-Z0-9_-]/g, "-");

  return safe || "adlam-receipt";
}
