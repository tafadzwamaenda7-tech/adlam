import { getSignatory, type SignatoryId } from "@/lib/signatories";
import { brand } from "@/lib/site-data";

export type DocumentKind = "receipt" | "quotation" | "invoice";
export type InvoiceMode = "load" | "monthly";
export type DocumentColumn = "date" | "description" | "quantity" | "unitPrice" | "amount";

export const ALL_DOCUMENT_COLUMNS: readonly DocumentColumn[] = [
  "date",
  "description",
  "quantity",
  "unitPrice",
  "amount",
];

export const STANDARD_DOCUMENT_COLUMNS: readonly DocumentColumn[] = [
  "description",
  "quantity",
  "unitPrice",
  "amount",
];

export const INVOICE_DOCUMENT_COLUMNS: readonly DocumentColumn[] = [
  "date",
  "description",
  "quantity",
  "unitPrice",
  "amount",
];

export interface ReceiptItem {
  quantity: string;
  description: string;
  unitPrice: string;
  date?: string;
}

export interface ReceiptValues {
  receiptNo: string;
  date: string;
  validUntil?: string | undefined;
  invoiceMode?: InvoiceMode;
  periodFrom?: string;
  periodTo?: string;
  columns?: DocumentColumn[];
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
  signatory?: SignatoryId;
  notes: string;
  footerNote: string;
}

export function documentLabel(kind: DocumentKind): string {
  if (kind === "invoice") return "Invoice";
  if (kind === "quotation") return "Quotation";
  return "Receipt";
}

export function columnLabel(column: DocumentColumn): string {
  const labels: Record<DocumentColumn, string> = {
    date: "Date",
    description: "Description",
    quantity: "Qty",
    unitPrice: "Unit price",
    amount: "Amount",
  };

  return labels[column];
}

function isDocumentColumn(value: unknown): value is DocumentColumn {
  return typeof value === "string" && ALL_DOCUMENT_COLUMNS.includes(value as DocumentColumn);
}

export function resolvedColumns(
  values: Pick<ReceiptValues, "columns">,
  kind: DocumentKind,
): DocumentColumn[] {
  const fallback = kind === "invoice" ? INVOICE_DOCUMENT_COLUMNS : STANDARD_DOCUMENT_COLUMNS;
  const preferred = values.columns?.filter(isDocumentColumn) ?? [];
  const source = preferred.length > 0 ? preferred : fallback;
  const unique = source.filter((column, index) => source.indexOf(column) === index);

  return ["description", "amount"].reduce<DocumentColumn[]>((columns, required) => {
    return columns.includes(required) ? columns : [...columns, required];
  }, unique);
}

export function defaultDocumentColumns(kind: DocumentKind): DocumentColumn[] {
  return [...(kind === "invoice" ? INVOICE_DOCUMENT_COLUMNS : STANDARD_DOCUMENT_COLUMNS)];
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function toMonthBoundsInputValue(date: Date): { from: string; to: string } {
  const from = new Date(date.getFullYear(), date.getMonth(), 1);
  const to = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  return { from: toDateInputValue(from), to: toDateInputValue(to) };
}

function documentSuffix(random: () => number): string {
  return String(Math.floor(random() * 9000) + 1000);
}

export function createReceiptNumber(date: Date, random: () => number = Math.random): string {
  return `ADL-${toDateInputValue(date).replace(/-/g, "")}-${documentSuffix(random)}`;
}

export function createQuotationNumber(date: Date, random: () => number = Math.random): string {
  return `ADL-Q-${toDateInputValue(date).replace(/-/g, "")}-${documentSuffix(random)}`;
}

export function createInvoiceNumber(
  date: Date,
  mode: InvoiceMode = "load",
  random: () => number = Math.random,
): string {
  const datePart = toDateInputValue(date).replace(/-/g, "");

  if (mode === "monthly") {
    return `ADL-INV-M-${datePart.slice(0, 6)}-${documentSuffix(random)}`;
  }

  return `ADL-INV-${datePart}-${documentSuffix(random)}`;
}

export function createDocumentNumber(
  kind: DocumentKind,
  date: Date,
  mode: InvoiceMode = "load",
  random: () => number = Math.random,
): string {
  if (kind === "quotation") return createQuotationNumber(date, random);
  if (kind === "invoice") return createInvoiceNumber(date, mode, random);
  return createReceiptNumber(date, random);
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
  const label = documentLabel(kind);
  const isMonthlyInvoice = kind === "invoice" && values.invoiceMode === "monthly";

  const lines = [
    `Hello ${values.customerName.trim()},`,
    "",
    `Here is your ${label.toLowerCase()} from ${brand.name}.`,
    "",
    `${label}: ${values.receiptNo.trim()}`,
    `${isMonthlyInvoice ? "Issue date" : "Date"}: ${values.date.trim()}`,
  ];

  if (kind === "quotation" && values.validUntil?.trim()) {
    lines.push(`Valid until: ${values.validUntil.trim()}`);
  }

  if (isMonthlyInvoice && values.periodFrom?.trim() && values.periodTo?.trim()) {
    lines.push(`Period: ${values.periodFrom.trim()} to ${values.periodTo.trim()}`);
  }

  if (kind === "invoice") {
    lines.push(`Invoice type: ${isMonthlyInvoice ? "Monthly statement" : "Per load"}`);
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
    const date = item.date?.trim();
    const prefix = date ? `${index + 1}. ${date} — ` : `${index + 1}. `;

    lines.push(
      `${prefix}${quantity} x ${formatReceiptAmount(receiptNumber(item.unitPrice), currency)} — ${description} = ${formatReceiptAmount(itemAmount(item), currency)}`,
    );
  });

  lines.push(
    "",
    `Sub total: ${formatReceiptAmount(totals.subtotal, currency)}`,
    `VAT (${receiptNumber(values.vatRate)}%): ${formatReceiptAmount(totals.vat, currency)}`,
    `Total: ${formatReceiptAmount(totals.total, currency)}`,
  );

  if (values.paymentMethod.trim()) {
    const paymentLabel = kind === "receipt" ? "Payment method" : "Payment terms";
    lines.push(`${paymentLabel}: ${values.paymentMethod.trim()}`);
  }

  if (values.notes.trim()) {
    lines.push(`Notes: ${values.notes.trim()}`);
  }

  if (kind !== "receipt") {
    lines.push("", `Signed by: ${getSignatory(values.signatory).name}`);
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

export function buildInvoiceWhatsappMessage(values: ReceiptValues): string {
  return buildDocumentWhatsappMessage(values, "invoice");
}

export function receiptFileBase(values: ReceiptValues, kind: DocumentKind = "receipt"): string {
  const safe = values.receiptNo.trim().replace(/[^a-zA-Z0-9_-]/g, "-");

  return safe || `adlam-${kind}`;
}
