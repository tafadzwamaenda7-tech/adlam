import type { jsPDF } from "jspdf";

import { brand } from "@/lib/site-data";
import {
  formatReceiptAmount,
  itemAmount,
  receiptFileBase,
  receiptNumber,
  receiptTotals,
  type DocumentKind,
  type ReceiptValues,
} from "@/lib/receipt";

type PdfDoc = jsPDF;

const ink: [number, number, number] = [19, 56, 58];
const muted: [number, number, number] = [91, 111, 111];
const rule: [number, number, number] = [203, 219, 216];
const panel: [number, number, number] = [242, 246, 245];
const white: [number, number, number] = [255, 255, 255];
const logoAspect = 301 / 1080;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };
    reader.onerror = () => reject(reader.error ?? new Error("Unable to read the logo."));
    reader.readAsDataURL(blob);
  });
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch("/adlam-logo.jpeg");

    if (!response.ok) return null;

    const dataUrl = await blobToDataUrl(await response.blob());

    return dataUrl || null;
  } catch {
    return null;
  }
}

function drawHeader(
  doc: PdfDoc,
  values: ReceiptValues,
  logoDataUrl: string | null,
  pageWidth: number,
  margin: number,
  kind: DocumentKind,
): number {
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
  doc.text(kind === "receipt" ? "RECEIPT" : "QUOTATION", pageWidth - margin, margin + 5.2, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
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
  doc.text(
    `${brand.name} — ${kind === "receipt" ? "Receipt" : "Quotation"} ${values.receiptNo}`,
    margin,
    margin + 4,
  );

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
  const boxHeight = kind === "quotation" ? 43.5 : 38;
  const rightX = margin + columnWidth + 8;

  doc.setDrawColor(...rule);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, columnWidth, boxHeight, 2, 2, "S");
  doc.roundedRect(rightX, y, columnWidth, boxHeight, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("CUSTOMER", margin + 4, y + 5);
  doc.text(kind === "receipt" ? "RECEIPT DETAILS" : "QUOTATION DETAILS", rightX + 4, y + 5);

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

  const details: ReadonlyArray<readonly [string, string]> = [
    ["Date", values.date || "—"],
    ...(kind === "quotation" && values.validUntil?.trim()
      ? ([["Valid until", values.validUntil.trim()]] as const)
      : []),
    ["Order No.", values.orderNo.trim() || "—"],
    ["VAT No.", values.vatNo.trim() || "—"],
    ["Service", values.service.trim() || "—"],
    [kind === "quotation" ? "Terms" : "Payment", values.paymentMethod.trim() || "—"],
  ];

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

function drawTableHeader(doc: PdfDoc, y: number, margin: number, contentWidth: number): number {
  doc.setFillColor(...ink);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...white);
  doc.text("QTY", margin + 3, y + 5.2);
  doc.text("DESCRIPTION", margin + 16, y + 5.2);
  doc.text("UNIT PRICE", margin + contentWidth - 40, y + 5.2, { align: "right" });
  doc.text("AMOUNT", margin + contentWidth - 3, y + 5.2, { align: "right" });

  return y + 8;
}

export async function downloadReceiptPdf(
  values: ReceiptValues,
  kind: DocumentKind = "receipt",
): Promise<void> {
  const { jsPDF: JsPdf } = await import("jspdf");
  const doc = new JsPdf({ unit: "mm", format: "a4" });
  const logoDataUrl = await loadLogoDataUrl();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const columnWidth = (contentWidth - 8) / 2;
  const currency = values.currency.trim() || "USD";
  const totals = receiptTotals(values);
  const footerY = pageHeight - 24;

  let y = drawHeader(doc, values, logoDataUrl, pageWidth, margin, kind) + 4;
  y = drawBoxes(doc, values, y, columnWidth, margin, kind) + 5;

  const ensureSpace = (height: number) => {
    if (y + height <= footerY - 34) return;

    doc.addPage();
    y = drawContinuationHeader(doc, values, pageWidth, margin, kind) + 3;
    y = drawTableHeader(doc, y, margin, contentWidth);
  };

  y = drawTableHeader(doc, y, margin, contentWidth);

  if (values.items.length === 0) {
    doc.setDrawColor(...rule);
    doc.rect(margin, y, contentWidth, 10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text("Add at least one receipt line.", margin + 4, y + 6);
    y += 10;
  }

  values.items.forEach((item) => {
    const descriptionLines = doc.splitTextToSize(item.description.trim() || "—", 112) as string[];
    const rowHeight = Math.max(10, descriptionLines.length * 4.6 + 6);

    ensureSpace(rowHeight + 2);

    doc.setDrawColor(...rule);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentWidth, rowHeight);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...ink);
    doc.text(item.quantity.trim() || "—", margin + 3, y + 5.5);
    doc.text(descriptionLines, margin + 16, y + 5.5);
    doc.text(
      formatReceiptAmount(receiptNumber(item.unitPrice), currency),
      margin + contentWidth - 40,
      y + 5.5,
      { align: "right" },
    );
    doc.text(formatReceiptAmount(itemAmount(item), currency), margin + contentWidth - 3, y + 5.5, {
      align: "right",
    });

    y += rowHeight;
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
  doc.line(margin + columnWidth + 8, y + 12, pageWidth - margin, y + 12);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...muted);
  doc.text("AUTHORISED SIGNATURE", margin, y);
  doc.text(kind === "receipt" ? "RECEIVED BY" : "ACCEPTED BY", margin + columnWidth + 8, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("Issued by " + brand.name, margin, y + 17);
  doc.setFont("helvetica", "normal");
  doc.text("Name and signature", margin + columnWidth + 8, y + 17);

  if (values.signature.trim()) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text(values.signature.trim().slice(0, 48), margin + 2, y + 9);
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
