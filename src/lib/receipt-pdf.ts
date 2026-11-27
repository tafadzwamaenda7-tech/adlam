import type { jsPDF } from "jspdf";

import { getSignatory, type Signatory } from "@/lib/signatories";
import { brand, brandLetterhead } from "@/lib/site-data";
import {
  columnLabel,
  documentLabel,
  formatReceiptAmount,
  itemAmount,
  receiptFileBase,
  receiptNumber,
  receiptTotals,
  resolvedColumns,
  type DocumentColumn,
  type DocumentKind,
  type ReceiptValues,
} from "@/lib/receipt";

type PdfDoc = jsPDF;
type Cell = { column: DocumentColumn; x: number; width: number };
type Alignment = "left" | "center" | "right";

const ink: [number, number, number] = [19, 56, 58];
const muted: [number, number, number] = [91, 111, 111];
const rule: [number, number, number] = [203, 219, 216];
const panel: [number, number, number] = [242, 246, 245];
const white: [number, number, number] = [255, 255, 255];
const logoAspect = 301 / 1080;
const letterheadAspect = brandLetterhead.width / brandLetterhead.height;
const imageDataUrlCache = new Map<string, string>();

const columnWeights: Record<DocumentColumn, number> = {
  date: 26,
  description: 82,
  quantity: 16,
  unitPrice: 30,
  amount: 30,
};

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read the image."));
    reader.readAsDataURL(blob);
  });
}

async function loadImageDataUrl(path: string): Promise<string | null> {
  const cached = imageDataUrlCache.get(path);
  if (cached) return cached;

  try {
    const response = await fetch(path);

    if (!response.ok) return null;

    const dataUrl = await blobToDataUrl(await response.blob());
    if (!dataUrl) return null;

    imageDataUrlCache.set(path, dataUrl);
    return dataUrl;
  } catch {
    return null;
  }
}

function columnCells(
  columns: readonly DocumentColumn[],
  contentWidth: number,
  margin: number,
): Cell[] {
  const totalWeight = columns.reduce((sum, column) => sum + columnWeights[column], 0);
  let x = margin;

  return columns.map((column) => {
    const width = (contentWidth * columnWeights[column]) / totalWeight;
    const cell = { column, x, width };
    x += width;
    return cell;
  });
}

function cellAlignment(column: DocumentColumn): Alignment {
  if (column === "unitPrice" || column === "amount") return "right";
  if (column === "quantity") return "center";
  return "left";
}

function fittedImageSize(
  image: Pick<Signatory, "width" | "height">,
  maxWidth: number,
  maxHeight: number,
): { width: number; height: number } {
  const scale = Math.min(maxWidth / image.width, maxHeight / image.height);

  return { width: image.width * scale, height: image.height * scale };
}

function itemDate(
  item: ReceiptValues["items"][number],
  values: ReceiptValues,
  kind: DocumentKind,
): string {
  const explicit = item.date?.trim();
  if (explicit) return explicit;
  if (kind === "invoice" && values.invoiceMode === "load") return values.date || "—";
  return "—";
}

function cellValue(
  column: DocumentColumn,
  item: ReceiptValues["items"][number],
  values: ReceiptValues,
  kind: DocumentKind,
  currency: string,
): string {
  if (column === "date") return itemDate(item, values, kind);
  if (column === "description") return item.description.trim() || "—";
  if (column === "quantity") return item.quantity.trim() || "—";
  if (column === "unitPrice") return formatReceiptAmount(receiptNumber(item.unitPrice), currency);
  return formatReceiptAmount(itemAmount(item), currency);
}

function drawHeader(
  doc: PdfDoc,
  values: ReceiptValues,
  logoDataUrl: string | null,
  letterheadDataUrl: string | null,
  pageWidth: number,
  margin: number,
  kind: DocumentKind,
): number {
  if (kind !== "receipt" && letterheadDataUrl) {
    const letterheadWidth = 92;
    const letterheadHeight = letterheadWidth / letterheadAspect;
    const letterheadY = margin - 5;
    const ruleY = letterheadY + letterheadHeight + 4;

    doc.addImage(letterheadDataUrl, "PNG", margin, letterheadY, letterheadWidth, letterheadHeight);

    doc.setDrawColor(...rule);
    doc.line(margin, ruleY, pageWidth - margin, ruleY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(...ink);
    doc.text(documentLabel(kind).toUpperCase(), margin, ruleY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(brand.address, margin, ruleY + 15);

    const metaX = pageWidth - margin;
    doc.setTextColor(...muted);
    doc.text("NUMBER", metaX, ruleY + 5, { align: "right" });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...ink);
    doc.text(values.receiptNo.trim() || "—", metaX, ruleY + 10, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(values.date || "—", metaX, ruleY + 15, { align: "right" });

    return ruleY + 21;
  }

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "JPEG", margin, margin, 44, 44 * logoAspect);
  }

  const brandX = margin + 51;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(brand.name, brandX, margin + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(doc.splitTextToSize(brand.address, 70) as string[], brandX, margin + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ink);
  doc.text(documentLabel(kind).toUpperCase(), pageWidth - margin, margin + 5.2, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(values.receiptNo.trim() || "—", pageWidth - margin, margin + 14, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(values.date || "—", pageWidth - margin, margin + 20, { align: "right" });

  return margin + 26;
}

function drawContinuationHeader(
  doc: PdfDoc,
  values: ReceiptValues,
  pageWidth: number,
  margin: number,
  kind: DocumentKind,
): number {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(`${brand.name} — ${documentLabel(kind)} ${values.receiptNo}`, margin, margin + 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(values.date, pageWidth - margin, margin + 4, { align: "right" });

  doc.setDrawColor(...rule);
  doc.setLineWidth(0.4);
  doc.line(margin, margin + 8, pageWidth - margin, margin + 8);

  return margin + 12;
}

function drawBoxes(
  doc: PdfDoc,
  values: ReceiptValues,
  y: number,
  columnWidth: number,
  margin: number,
  kind: DocumentKind,
): number {
  const isMonthlyInvoice = kind === "invoice" && values.invoiceMode === "monthly";
  const details: ReadonlyArray<readonly [string, string]> = [
    ...(kind === "quotation" && values.validUntil?.trim()
      ? ([["Valid until", values.validUntil.trim()]] as const)
      : []),
    ...(isMonthlyInvoice
      ? ([
          ["Period", `${values.periodFrom?.trim() || "—"} to ${values.periodTo?.trim() || "—"}`],
        ] as const)
      : []),
    ...(kind === "invoice"
      ? ([["Type", isMonthlyInvoice ? "Monthly statement" : "Per load"]] as const)
      : []),
    ["Order No.", values.orderNo.trim() || "—"],
    ["VAT No.", values.vatNo.trim() || "—"],
    ["Service", values.service.trim() || "—"],
    [kind === "receipt" ? "Payment" : "Terms", values.paymentMethod.trim() || "—"],
  ];
  const boxHeight = Math.max(38, 16 + details.length * 5.5);
  const rightX = margin + columnWidth + 8;

  doc.setDrawColor(...rule);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, columnWidth, boxHeight, 2, 2, "S");
  doc.roundedRect(rightX, y, columnWidth, boxHeight, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text(kind === "invoice" ? "TO CUSTOMER" : "CUSTOMER", margin + 4, y + 5);
  doc.text(`${documentLabel(kind).toUpperCase()} DETAILS`, rightX + 4, y + 5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(values.customerName.trim() || "—", margin + 4, y + 11);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  const addressLines = doc.splitTextToSize(
    values.customerAddress.trim() || "—",
    columnWidth - 8,
  ) as string[];
  doc.text(addressLines.slice(0, 2), margin + 4, y + 16);
  doc.text(values.customerNumber.trim() || "—", margin + 4, y + 29);

  details.forEach(([label, value], index) => {
    const lineY = y + 11 + index * 5.5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text(`${label}:`, rightX + 4, lineY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...ink);
    doc.text(value.slice(0, 34), rightX + 25, lineY);
  });

  return y + boxHeight;
}

function drawTableHeader(
  doc: PdfDoc,
  y: number,
  margin: number,
  contentWidth: number,
  columns: readonly DocumentColumn[],
): number {
  doc.setFillColor(...ink);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...white);

  columnCells(columns, contentWidth, margin).forEach((cell) => {
    const alignment = cellAlignment(cell.column);
    const x =
      cell.x +
      (alignment === "right" ? cell.width - 2 : alignment === "center" ? cell.width / 2 : 2);

    doc.text(columnLabel(cell.column).toUpperCase(), x, y + 5.2, { align: alignment });
  });

  return y + 8;
}

function tableRowLines(
  doc: PdfDoc,
  contentWidth: number,
  columns: readonly DocumentColumn[],
  item: ReceiptValues["items"][number],
  values: ReceiptValues,
  kind: DocumentKind,
  currency: string,
): Map<DocumentColumn, string[]> {
  const linesByColumn = new Map<DocumentColumn, string[]>();

  columnCells(columns, contentWidth, 0).forEach((cell) => {
    const value = cellValue(cell.column, item, values, kind, currency);
    const lines = doc.splitTextToSize(value, cell.width - 4) as string[];
    linesByColumn.set(cell.column, lines.slice(0, 3));
  });

  return linesByColumn;
}

function tableRowHeight(linesByColumn: Map<DocumentColumn, string[]>): number {
  const maxLines = Math.max(...Array.from(linesByColumn.values(), (lines) => lines.length));

  return Math.max(10, maxLines * 4.6 + 6);
}

function measureTableRowHeight(
  doc: PdfDoc,
  contentWidth: number,
  columns: readonly DocumentColumn[],
  item: ReceiptValues["items"][number],
  values: ReceiptValues,
  kind: DocumentKind,
  currency: string,
): number {
  return tableRowHeight(tableRowLines(doc, contentWidth, columns, item, values, kind, currency));
}

function drawTableRow(
  doc: PdfDoc,
  y: number,
  margin: number,
  contentWidth: number,
  columns: readonly DocumentColumn[],
  item: ReceiptValues["items"][number],
  values: ReceiptValues,
  kind: DocumentKind,
  currency: string,
): number {
  const cells = columnCells(columns, contentWidth, margin);
  const linesByColumn = tableRowLines(doc, contentWidth, columns, item, values, kind, currency);
  const rowHeight = tableRowHeight(linesByColumn);

  doc.setDrawColor(...rule);
  doc.setLineWidth(0.3);

  cells.forEach((cell) => {
    doc.rect(cell.x, y, cell.width, rowHeight);

    const alignment = cellAlignment(cell.column);
    const x =
      cell.x +
      (alignment === "right" ? cell.width - 2 : alignment === "center" ? cell.width / 2 : 2);
    const isDescription = cell.column === "description";
    const isTotal = cell.column === "amount";

    doc.setFont("helvetica", isDescription || isTotal ? "bold" : "normal");
    doc.setFontSize(isDescription ? 8.2 : 8);
    doc.setTextColor(...(isDescription || isTotal ? ink : muted));
    doc.text(linesByColumn.get(cell.column) ?? ["—"], x, y + 5.5, { align: alignment });
  });

  return rowHeight;
}

export async function downloadReceiptPdf(
  values: ReceiptValues,
  kind: DocumentKind = "receipt",
): Promise<void> {
  const { jsPDF: JsPdf } = await import("jspdf");
  const doc = new JsPdf({ unit: "mm", format: "a4" });
  const logoDataUrl = await loadImageDataUrl("/adlam-logo.jpeg");
  const letterheadDataUrl = kind === "receipt" ? null : await loadImageDataUrl(brandLetterhead.src);
  const signatory = getSignatory(values.signatory);
  const signatureDataUrl =
    kind === "receipt" ? null : await loadImageDataUrl(signatory.signatureSrc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const columnWidth = (contentWidth - 8) / 2;
  const currency = values.currency.trim() || "USD";
  const totals = receiptTotals(values);
  const columns = resolvedColumns(values, kind);
  const footerY = pageHeight - 24;

  let y = drawHeader(doc, values, logoDataUrl, letterheadDataUrl, pageWidth, margin, kind) + 4;
  y = drawBoxes(doc, values, y, columnWidth, margin, kind) + 5;

  const ensureSpace = (height: number) => {
    if (y + height <= footerY - 34) return;

    doc.addPage();
    y = drawContinuationHeader(doc, values, pageWidth, margin, kind) + 3;
    y = drawTableHeader(doc, y, margin, contentWidth, columns);
  };

  y = drawTableHeader(doc, y, margin, contentWidth, columns);

  if (values.items.length === 0) {
    doc.setDrawColor(...rule);
    doc.rect(margin, y, contentWidth, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(`Add at least one ${documentLabel(kind).toLowerCase()} line.`, margin + 4, y + 6);
    y += 10;
  }

  values.items.forEach((item) => {
    const rowHeight = measureTableRowHeight(
      doc,
      contentWidth,
      columns,
      item,
      values,
      kind,
      currency,
    );

    ensureSpace(rowHeight + 2);
    y += drawTableRow(doc, y, margin, contentWidth, columns, item, values, kind, currency);
  });

  if (values.notes.trim()) {
    const noteLines = doc.splitTextToSize(values.notes.trim(), contentWidth - 8) as string[];
    const notesHeight = 8 + noteLines.length * 4.6;

    ensureSpace(notesHeight + 3);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text("NOTES", margin + 2, y + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...ink);
    doc.text(noteLines, margin + 2, y + 9.5);
    y += notesHeight;
  }

  // Keep the totals and the signature block together on the same page.
  ensureSpace(60);

  const totalsWidth = 72;
  const totalsX = margin + contentWidth - totalsWidth;
  const totalsRows: ReadonlyArray<readonly [string, string]> = [
    ["SUB TOTAL", formatReceiptAmount(totals.subtotal, currency)],
    [`VAT (${receiptNumber(values.vatRate)}%)`, formatReceiptAmount(totals.vat, currency)],
    ["TOTAL", formatReceiptAmount(totals.total, currency)],
  ];

  totalsRows.forEach(([label, amount], index) => {
    const rowY = y + index * 7;
    doc.setFillColor(...(index === 2 ? ink : panel));
    doc.rect(totalsX, rowY, totalsWidth, 7, "F");
    doc.setFont("helvetica", index === 2 ? "bold" : "normal");
    doc.setFontSize(index === 2 ? 9 : 8);
    doc.setTextColor(...(index === 2 ? white : ink));
    doc.text(label, totalsX + 3, rowY + 4.7);
    doc.text(amount, totalsX + totalsWidth - 3, rowY + 4.7, { align: "right" });
  });
  y += 29;

  const signatureWidth = columnWidth;
  doc.setDrawColor(...rule);
  doc.line(margin, y + 12, margin + signatureWidth, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("AUTHORISED SIGNATURE", margin, y);

  if (kind === "receipt") {
    doc.line(margin + columnWidth + 8, y + 12, pageWidth - margin, y + 12);
    doc.text("RECEIVED BY", margin + columnWidth + 8, y);
  }

  if (kind !== "receipt" && signatureDataUrl) {
    const signatureSize = fittedImageSize(signatory, signatureWidth - 4, 10);

    doc.addImage(
      signatureDataUrl,
      "JPEG",
      margin + 2,
      y + 1 + (10 - signatureSize.height),
      signatureSize.width,
      signatureSize.height,
    );
  } else if (values.signature.trim()) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text(values.signature.trim().slice(0, 48), margin + 2, y + 9);
  }

  doc.setFontSize(8);
  if (kind !== "receipt") {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ink);
    doc.text(signatory.name, margin, y + 17);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(`Issued by ${brand.name}`, margin, y + 21);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...muted);
    doc.text(`Issued by ${brand.name}`, margin, y + 17);
  }
  if (kind === "receipt") {
    doc.setTextColor(...muted);
    doc.text("Name and signature", margin + columnWidth + 8, y + 17);
  }

  doc.setDrawColor(...rule);
  doc.line(margin, footerY - 12, pageWidth - margin, footerY - 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(values.footerNote.trim() || "Thank you for your business", pageWidth / 2, footerY - 6, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...ink);
  doc.text(brand.motto.split("\n"), pageWidth / 2, footerY + 1, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text(`Powered by ${brand.poweredBy}`, pageWidth / 2, footerY + 8, { align: "center" });

  doc.save(`${receiptFileBase(values, kind)}.pdf`);
}

export async function downloadQuotationPdf(values: ReceiptValues): Promise<void> {
  await downloadReceiptPdf(values, "quotation");
}

export async function downloadInvoicePdf(values: ReceiptValues): Promise<void> {
  await downloadReceiptPdf(values, "invoice");
}
