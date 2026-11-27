import { brand } from "@/lib/site-data";

export interface ReceiptItem {
  quantity: string;
  description: string;
  unitPrice: string;
}

export type DocumentKind = "receipt" | "quotation";

export interface ReceiptValues {
  receiptNo: string;
  date: string;
  validUntil?: string | undefined;
  customerName: string;
  customerNumber: string;
  customerAddress: string;
  orderNo: string;
  vatNo: string;
  service: string;
  items: ReceiptItem[];
  currency: string;
  vatRate: string;
  paymentMethod: string;
  signature: string;
  notes: string;
  footerNote: string;
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

export function createQuotationNumber(date: Date, random: () => number = Math.random): string {
  const datePart = toDateInputValue(date).replace(/-/g, "");
  const suffix = Math.floor(random() * 9000) + 1000;

  return `ADL-Q-${datePart}-${suffix}`;
}

export function toValidUntilInputValue(date: Date, days = 14): string {
  const expiry = new Date(date);
  expiry.setDate(expiry.getDate() + days);

  return toDateInputValue(expiry);
}

export function formatReceiptAmount(amount: number, currency: string): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);

  return `${currency.trim() || "USD"} ${formatted}`;
}

export function receiptNumber(value: string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export function itemAmount(item: ReceiptItem): number {
  return receiptNumber(item.quantity) * receiptNumber(item.unitPrice);
}

export function receiptTotals(values: Pick<ReceiptValues, "items" | "vatRate">): {
  subtotal: number;
  vat: number;
  total: number;
} {
  const subtotal = values.items.reduce((sum, item) => sum + itemAmount(item), 0);
  const rate = receiptNumber(values.vatRate);
  const vat = (subtotal * rate) / 100;

  return { subtotal, vat, total: subtotal + vat };
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

export function buildDocumentWhatsappMessage(
  values: ReceiptValues,
  kind: DocumentKind = "receipt",
): string {
  const currency = values.currency.trim() || "USD";
  const totals = receiptTotals(values);
  const documentLabel = kind === "receipt" ? "Receipt" : "Quotation";

  const lines = [
    `Hello ${values.customerName.trim()},`,
    "",
    `Here is your ${kind === "receipt" ? "receipt" : "quotation"} from ${brand.name}.`,
    "",
    `${documentLabel}: ${values.receiptNo.trim()}`,
    `Date: ${values.date.trim()}`,
  ];

  if (kind === "quotation" && values.validUntil?.trim()) {
    lines.push(`Valid until: ${values.validUntil.trim()}`);
  }

  lines.push(`Service: ${values.service.trim()}`);

  if (values.orderNo.trim()) {
    lines.push(`Order number: ${values.orderNo.trim()}`);
  }

  if (values.vatNo.trim()) {
    lines.push(`VAT number: ${values.vatNo.trim()}`);
  }

  if (values.customerAddress.trim()) {
    lines.push(`Customer address: ${values.customerAddress.trim()}`);
  }

  lines.push("", "Items:");

  values.items.forEach((item, index) => {
    const quantity = item.quantity.trim() || "1";
    const description = item.description.trim() || "Line item";
    lines.push(
      `${index + 1}. ${quantity} x ${formatReceiptAmount(receiptNumber(item.unitPrice), currency)} — ${description} = ${formatReceiptAmount(itemAmount(item), currency)}`,
    );
  });

  lines.push(
    "",
    `Sub total: ${formatReceiptAmount(totals.subtotal, currency)}`,
    `VAT (${receiptNumber(values.vatRate)}%): ${formatReceiptAmount(totals.vat, currency)}`,
    `Total: ${formatReceiptAmount(totals.total, currency)}`,
  );

  if (values.paymentMethod.trim()) {
    const paymentLabel = kind === "quotation" ? "Payment terms" : "Payment method";
    lines.push(`${paymentLabel}: ${values.paymentMethod.trim()}`);
  }

  if (values.notes.trim()) {
    lines.push(`Notes: ${values.notes.trim()}`);
  }

  lines.push("", brand.address, brand.motto);

  return lines.join("\n");
}

export function buildReceiptWhatsappMessage(values: ReceiptValues): string {
  return buildDocumentWhatsappMessage(values, "receipt");
}

export function buildQuotationWhatsappMessage(values: ReceiptValues): string {
  return buildDocumentWhatsappMessage(values, "quotation");
}

export function receiptFileBase(values: ReceiptValues, kind: DocumentKind = "receipt"): string {
  const safe = values.receiptNo.trim().replace(/[^a-zA-Z0-9_-]/g, "-");

  return safe || `adlam-${kind}`;
}
