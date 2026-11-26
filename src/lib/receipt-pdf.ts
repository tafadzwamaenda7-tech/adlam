import { brand } from "@/lib/site-data";
import { formatReceiptAmount, receiptFileBase, type ReceiptValues } from "@/lib/receipt";

const ink: [number, number, number] = [19, 56, 58];
const muted: [number, number, number] = [91, 111, 111];
const rule: [number, number, number] = [217, 226, 224];
const panel: [number, number, number] = [242, 246, 245];
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

export async function downloadReceiptPdf(values: ReceiptValues): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logoDataUrl = await loadLogoDataUrl();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  const columnGap = 8;
  const columnWidth = (contentWidth - columnGap) / 2;
  const rightColumnX = margin + columnWidth + columnGap;
  const amount = formatReceiptAmount(Number(values.amount), values.currency);

  let y = margin;

  if (logoDataUrl) {
    const logoWidth = 42;
    doc.addImage(logoDataUrl, "JPEG", margin, y, logoWidth, logoWidth * logoAspect);
  }

  const brandX = margin + 50;
  doc.setTextColor(...ink);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(brand.name, brandX, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(doc.splitTextToSize(brand.address, 62) as string[], brandX, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...ink);
  doc.text("RECEIPT", pageWidth - margin, y + 7, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(values.receiptNo || "ADL-YYYYMMDD-0000", pageWidth - margin, y + 13, {
    align: "right",
  });
  doc.text(values.date || "YYYY-MM-DD", pageWidth - margin, y + 18, { align: "right" });

  y = margin + 27;
  doc.setDrawColor(...rule);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("RECEIVED FROM", margin, y);
  doc.text("SERVICE", rightColumnX, y);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  doc.text(values.customerName || "Customer name", margin, y + 7);
  doc.text((values.service || "Service not selected").slice(0, 48), rightColumnX, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(values.customerNumber || "Customer number", margin, y + 13);
  if (values.paymentMethod.trim()) {
    doc.text(values.paymentMethod.trim().slice(0, 48), rightColumnX, y + 13);
  }
  y += 20;

  doc.setFillColor(...panel);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("DESCRIPTION", margin + 4, y + 6.5);
  doc.text("AMOUNT", pageWidth - margin - 4, y + 6.5, { align: "right" });
  y += 10;

  const descriptionLines = doc.splitTextToSize(
    values.description || "Receipt description",
    contentWidth - 60,
  ) as string[];
  const rowHeight = Math.max(20, descriptionLines.length * 5 + 12);
  doc.setDrawColor(...rule);
  doc.setLineWidth(0.3);
  doc.rect(margin, y, contentWidth, rowHeight);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(values.service || "Service not selected", margin + 4, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(descriptionLines, margin + 4, y + 13);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(amount, pageWidth - margin - 4, y + 8, { align: "right" });
  y += rowHeight;

  doc.setDrawColor(...rule);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text("Total", margin + 4, y + 7);
  doc.text(amount, pageWidth - margin - 4, y + 7, { align: "right" });
  y += 12;

  if (values.notes.trim()) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text("NOTES", margin, y);
    const noteLines = doc.splitTextToSize(values.notes.trim(), contentWidth) as string[];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...ink);
    doc.text(noteLines, margin, y + 6);
    y += 6 + noteLines.length * 5;
  }

  const footerY = pageHeight - 20;
  const signatureY = Math.min(Math.max(y + 14, pageHeight - 68), footerY - 18);
  doc.setDrawColor(...rule);
  doc.line(margin, signatureY, margin + columnWidth, signatureY);
  doc.line(rightColumnX, signatureY, pageWidth - margin, signatureY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(`Issued by ${brand.name}`, margin, signatureY + 6);
  doc.text("Received by", rightColumnX, signatureY + 6);

  doc.setDrawColor(...rule);
  doc.line(margin, footerY - 10, pageWidth - margin, footerY - 10);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...ink);
  doc.text(brand.motto.split("\n"), pageWidth / 2, footerY - 1, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...muted);
  doc.text(`Powered by ${brand.poweredBy}`, pageWidth / 2, footerY + 9, { align: "center" });

  doc.save(`${receiptFileBase(values)}.pdf`);
}
