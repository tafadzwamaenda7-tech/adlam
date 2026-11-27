import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  LoaderCircle,
  Plus,
  Printer,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFieldArray, useForm, type FieldErrors } from "react-hook-form";
import { z } from "zod";

import { SectionLabel } from "@/components/site/bilingual-label";
import { CtaLabel } from "@/components/site/cta-link";
import { Motto } from "@/components/site/motto";
import { PillButton } from "@/components/site/pill-button";
import { WhatsAppIcon } from "@/components/site/whatsapp-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ALL_DOCUMENT_COLUMNS,
  buildInvoiceWhatsappMessage,
  buildQuotationWhatsappMessage,
  buildReceiptWhatsappMessage,
  columnLabel,
  createDocumentNumber,
  defaultDocumentColumns,
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
  type DocumentColumn,
  type DocumentKind,
  type InvoiceMode,
  type ReceiptItem,
  type ReceiptValues,
} from "@/lib/receipt";
import { downloadInvoicePdf, downloadQuotationPdf, downloadReceiptPdf } from "@/lib/receipt-pdf";
import { brand, ctaLabels, services, type CtaKey, type SectionLabelKey } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

const MAX_RECEIPT_LINES = 20;
const decimalPattern = /^\d+(?:\.\d{1,2})?$/;

const documentCopy = {
  receipt: {
    label: "Receipt",
    numberLabel: "Receipt number",
    detailsSection: "receiptDetails",
    actionsSection: "receiptActions",
    downloadCta: "downloadReceipt",
    printCta: "printReceipt",
    newCta: "newReceipt",
    acceptanceLabel: "Received by",
    customerLabel: "Received from",
    linesSection: "lineItems",
    paymentLabel: "Payment method",
  },
  quotation: {
    label: "Quotation",
    numberLabel: "Quotation number",
    detailsSection: "quotationDetails",
    actionsSection: "quotationActions",
    downloadCta: "downloadQuotation",
    printCta: "printQuotation",
    newCta: "newQuotation",
    acceptanceLabel: "Accepted by",
    customerLabel: "Prepared for",
    linesSection: "quotationLines",
    paymentLabel: "Payment terms",
  },
  invoice: {
    label: "Invoice",
    numberLabel: "Invoice number",
    detailsSection: "invoiceDetails",
    actionsSection: "invoiceActions",
    downloadCta: "downloadInvoice",
    printCta: "printInvoice",
    newCta: "newInvoice",
    acceptanceLabel: "Accepted by",
    customerLabel: "Bill to",
    linesSection: "invoiceLines",
    paymentLabel: "Payment terms",
  },
} as const satisfies Record<
  DocumentKind,
  {
    label: string;
    numberLabel: string;
    detailsSection: SectionLabelKey;
    actionsSection: SectionLabelKey;
    downloadCta: CtaKey;
    printCta: CtaKey;
    newCta: CtaKey;
    acceptanceLabel: string;
    customerLabel: string;
    linesSection: SectionLabelKey;
    paymentLabel: string;
  }
>;

const lineSchema = z.object({
  date: z.string().trim().max(30, "Date is too long.").optional(),
  quantity: z
    .string()
    .trim()
    .min(1, "Enter a quantity.")
    .regex(decimalPattern, "Enter a valid quantity.")
    .refine((value) => Number(value) > 0, "Quantity must be greater than 0."),
  description: z.string().trim().min(2, "Add a line description."),
  unitPrice: z
    .string()
    .trim()
    .min(1, "Enter a unit price.")
    .regex(decimalPattern, "Enter a valid unit price.")
    .refine((value) => Number(value) >= 0, "Unit price cannot be negative."),
});

const documentSchema = z.object({
  receiptNo: z.string().trim().min(3, "Enter a document number."),
  date: z.string().min(1, "Choose a date."),
  validUntil: z.string().trim().max(40, "Valid-until date is too long.").optional(),
  invoiceMode: z.enum(["load", "monthly"]).optional(),
  periodFrom: z.string().trim().max(30, "Period date is too long.").optional(),
  periodTo: z.string().trim().max(30, "Period date is too long.").optional(),
  columns: z.array(z.enum(["date", "description", "quantity", "unitPrice", "amount"])).optional(),
  customerName: z.string().trim().min(2, "Enter the customer name."),
  customerNumber: z
    .string()
    .trim()
    .min(9, "Enter the customer number.")
    .max(24, "Customer number is too long.")
    .regex(/^[+]?[\d\s()-]+$/, "Enter a valid customer number.")
    .refine((value) => toWhatsappDial(value).length >= 9, "Enter a valid customer number."),
  customerAddress: z.string().trim().max(160, "Customer address is too long."),
  orderNo: z.string().trim().max(40, "Order number is too long."),
  vatNo: z.string().trim().max(40, "VAT number is too long."),
  service: z.string().min(1, "Choose a service."),
  items: z
    .array(lineSchema)
    .min(1, "Add at least one line.")
    .max(MAX_RECEIPT_LINES, `Use up to ${MAX_RECEIPT_LINES} lines.`),
  currency: z.string().trim().min(1, "Enter a currency.").max(8, "Currency is too long."),
  vatRate: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (decimalPattern.test(value) && Number(value) <= 100),
      "Enter a VAT rate from 0 to 100.",
    ),
  paymentMethod: z.string().trim().max(80, "Payment method is too long."),
  signature: z.string().trim().max(80, "Signature is too long."),
  notes: z.string().trim().max(500, "Notes are too long."),
  footerNote: z.string().trim().max(120, "Footer note is too long."),
});

const fieldClass =
  "mt-2 h-12 w-full rounded-[14px] border border-input bg-card px-4 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";
const textareaClass =
  "mt-2 min-h-20 w-full resize-y rounded-[14px] border border-input bg-card px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";
const lineInputClass =
  "mt-2 h-11 w-full rounded-[12px] border border-input bg-card px-3 text-base text-ink";

const fieldIds: Partial<Record<keyof ReceiptValues, string>> = {
  receiptNo: "receipt-no",
  date: "receipt-date",
  validUntil: "receipt-valid-until",
  invoiceMode: "receipt-invoice-mode",
  periodFrom: "receipt-period-from",
  periodTo: "receipt-period-to",
  customerName: "receipt-customer",
  customerNumber: "receipt-customer-number",
  customerAddress: "receipt-customer-address",
  orderNo: "receipt-order-number",
  vatNo: "receipt-vat-number",
  service: "receipt-service",
  currency: "receipt-currency",
  vatRate: "receipt-vat-rate",
  paymentMethod: "receipt-payment-method",
  signature: "receipt-signature",
  notes: "receipt-notes",
  footerNote: "receipt-footer-note",
};

const lineFieldWidth: Record<Exclude<DocumentColumn, "amount">, string> = {
  date: "min-w-[132px] flex-1 sm:max-w-[170px]",
  description: "min-w-[210px] flex-[2]",
  quantity: "w-[92px] shrink-0",
  unitPrice: "w-[126px] shrink-0",
};

const cellWidth: Record<DocumentColumn, string> = {
  date: "w-28",
  description: "",
  quantity: "w-20",
  unitPrice: "w-32",
  amount: "w-32",
};

function columnAlignmentClass(column: DocumentColumn): string {
  if (column === "quantity") return "text-center";
  if (column === "unitPrice" || column === "amount") return "text-right";
  return "";
}

type ActionStatus = {
  tone: "info" | "success" | "error";
  message: string;
};

function defaultDocument(
  kind: DocumentKind,
  mode: InvoiceMode = "load",
  date: Date | null = null,
): ReceiptValues {
  const month = date ? toMonthBoundsInputValue(date) : null;

  return {
    receiptNo: date ? createDocumentNumber(kind, date, mode) : "",
    date: date ? toDateInputValue(date) : "",
    validUntil: date && kind === "quotation" ? toValidUntilInputValue(date) : "",
    invoiceMode: mode,
    periodFrom: kind === "invoice" && month && mode === "monthly" ? month.from : "",
    periodTo: kind === "invoice" && month && mode === "monthly" ? month.to : "",
    columns: defaultDocumentColumns(kind),
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    orderNo: "",
    vatNo: "",
    service: "",
    items: [{ date: "", quantity: "1", description: "", unitPrice: "" }],
    currency: "USD",
    vatRate: "0",
    paymentMethod: "",
    signature: "",
    notes: "",
    footerNote: "Thank you for your business",
  };
}

function bilingualCta(key: CtaKey): string {
  const label = ctaLabels[key];
  return `${label.shona} / ${label.english}`;
}

function previewCellText(
  column: DocumentColumn,
  item: ReceiptItem,
  values: ReceiptValues,
  kind: DocumentKind,
  currency: string,
): string {
  if (column === "date") {
    return (
      item.date?.trim() ||
      (kind === "invoice" && values.invoiceMode === "load" ? values.date : "") ||
      "—"
    );
  }
  if (column === "description") return item.description?.trim() || "—";
  if (column === "quantity") return item.quantity?.trim() || "—";
  if (column === "unitPrice") {
    return formatReceiptAmount(receiptNumber(item.unitPrice ?? ""), currency);
  }
  return formatReceiptAmount(item ? itemAmount(item) : 0, currency);
}

function ReceiptField({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  className?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function DocumentBuilder({ kind }: { kind: DocumentKind }) {
  const copy = documentCopy[kind];
  const [initialValues] = useState(() => defaultDocument(kind));
  const {
    control,
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ReceiptValues>({
    resolver: zodResolver(documentSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null);

  const values = watch();
  const invoiceMode = values.invoiceMode ?? "load";
  const activeColumns = resolvedColumns(values, kind);
  const hiddenColumns = ALL_DOCUMENT_COLUMNS.filter((column) => !activeColumns.includes(column));
  const modeRef = useRef<InvoiceMode>(invoiceMode);
  const currency = values.currency?.trim() || "USD";
  const totals = receiptTotals({ items: values.items ?? [], vatRate: values.vatRate ?? "0" });
  const subTotalLabel = formatReceiptAmount(totals.subtotal, currency);
  const vatLabel = formatReceiptAmount(totals.vat, currency);
  const totalLabel = formatReceiptAmount(totals.total, currency);
  const documentLabelText = copy.label.toLowerCase();
  const documentDateLabel =
    kind === "invoice" ? (invoiceMode === "monthly" ? "Issue date" : "Load date") : "Date";

  useEffect(() => {
    // Keep the server and first client render identical; fill these after hydration.
    const initial = defaultDocument(kind, invoiceMode, new Date());
    if (!getValues("receiptNo")) setValue("receiptNo", initial.receiptNo);
    if (!getValues("date")) setValue("date", initial.date);
    if (kind === "quotation" && !getValues("validUntil")) {
      setValue("validUntil", initial.validUntil ?? "");
    }
    if (kind === "invoice" && invoiceMode === "monthly") {
      if (!getValues("periodFrom")) setValue("periodFrom", initial.periodFrom ?? "");
      if (!getValues("periodTo")) setValue("periodTo", initial.periodTo ?? "");
    }
  }, [getValues, invoiceMode, kind, setValue]);

  useEffect(() => {
    if (kind !== "invoice" || modeRef.current === invoiceMode) return;

    modeRef.current = invoiceMode;
    setValue("receiptNo", createDocumentNumber(kind, new Date(), invoiceMode));

    if (invoiceMode === "monthly") {
      const month = toMonthBoundsInputValue(new Date());
      setValue("periodFrom", month.from);
      setValue("periodTo", month.to);
    }
  }, [invoiceMode, kind, setValue]);

  useEffect(() => {
    const clearPrintMode = () => document.body.classList.remove("printing-receipt");

    window.addEventListener("afterprint", clearPrintMode);

    return () => {
      window.removeEventListener("afterprint", clearPrintMode);
      clearPrintMode();
    };
  }, []);

  const moveColumn = (column: DocumentColumn, direction: -1 | 1) => {
    const index = activeColumns.indexOf(column);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= activeColumns.length) return;

    const next = [...activeColumns];
    [next[index], next[target]] = [next[target], next[index]];
    setValue("columns", next, { shouldDirty: true });
  };

  const toggleColumn = (column: DocumentColumn) => {
    if (column === "description" || column === "amount") return;

    if (activeColumns.includes(column)) {
      setValue(
        "columns",
        activeColumns.filter((entry) => entry !== column),
        { shouldDirty: true },
      );
      return;
    }

    const canonicalIndex = ALL_DOCUMENT_COLUMNS.indexOf(column);
    const insertIndex = activeColumns.findIndex(
      (entry) => ALL_DOCUMENT_COLUMNS.indexOf(entry) > canonicalIndex,
    );
    const next = [...activeColumns];
    next.splice(insertIndex === -1 ? next.length : insertIndex, 0, column);

    setValue("columns", next, { shouldDirty: true });
  };

  const focusFirstInvalid = (invalid: FieldErrors<ReceiptValues>) => {
    const firstKey = Object.keys(invalid)[0] as keyof ReceiptValues | undefined;

    if (firstKey === "items") {
      const itemErrors = invalid.items as unknown;
      if (Array.isArray(itemErrors)) {
        const index = itemErrors.findIndex((entry) => Boolean(entry));
        const itemError = itemErrors[index] as Record<string, unknown> | undefined;
        const lineField = itemError ? Object.keys(itemError)[0] : undefined;

        if (lineField) {
          document.getElementById(`receipt-item-${index}-${lineField}`)?.focus();
          return;
        }
      }
    }

    const id = firstKey ? fieldIds[firstKey] : undefined;
    if (id) document.getElementById(id)?.focus();
  };

  const onInvalid = (invalid: FieldErrors<ReceiptValues>) => {
    setActionStatus({
      tone: "error",
      message: "Complete the highlighted fields before using this action.",
    });
    focusFirstInvalid(invalid);
  };

  const printDocument = handleSubmit(() => {
    setActionStatus({
      tone: "info",
      message: "Print dialog opened. Choose Save as PDF to keep a copy.",
    });

    document.body.classList.add("printing-receipt");
    window.print();
  }, onInvalid);

  const sendDocument = handleSubmit((submitted) => {
    const dial = toWhatsappDial(submitted.customerNumber);

    if (!dial) {
      setActionStatus({
        tone: "error",
        message: "Enter a valid customer number for WhatsApp.",
      });
      return;
    }

    const message =
      kind === "receipt"
        ? buildReceiptWhatsappMessage(submitted)
        : kind === "quotation"
          ? buildQuotationWhatsappMessage(submitted)
          : buildInvoiceWhatsappMessage(submitted);
    const link = document.createElement("a");
    link.href = whatsappUrl(dial, message);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
    setActionStatus({
      tone: "success",
      message: `WhatsApp opened with the ${documentLabelText}. Press Send there to deliver it.`,
    });
  }, onInvalid);

  const downloadPdf = handleSubmit(async (submitted) => {
    setIsDownloading(true);
    setActionStatus({ tone: "info", message: "Preparing your PDF…" });

    try {
      if (kind === "receipt") {
        await downloadReceiptPdf(submitted);
      } else if (kind === "quotation") {
        await downloadQuotationPdf(submitted);
      } else {
        await downloadInvoicePdf(submitted);
      }
      setActionStatus({
        tone: "success",
        message: `PDF downloaded: ${receiptFileBase(submitted, kind)}.pdf`,
      });
    } catch {
      setActionStatus({
        tone: "error",
        message: "The PDF could not be created. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  }, onInvalid);

  const startNewDocument = () => {
    if (!window.confirm(`Clear this ${documentLabelText} and start a new one?`)) return;

    reset(defaultDocument(kind, invoiceMode, new Date()));
    modeRef.current = invoiceMode;
    setActionStatus({
      tone: "info",
      message: `Started a new ${documentLabelText}. Add the customer and line items.`,
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      <form className="receipt-no-print min-w-0 rounded-[28px] border border-border bg-card p-7 shadow-card sm:p-9">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
          <SectionLabel section={copy.detailsSection} />
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
          Fill in the {documentLabelText}.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Add the lines, then print, download or send the {documentLabelText} on WhatsApp. Nothing
          is sent or saved.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ReceiptField id="receipt-no" label={copy.numberLabel} error={errors.receiptNo?.message}>
            <Input
              id="receipt-no"
              className={fieldClass}
              aria-invalid={errors.receiptNo ? true : false}
              aria-describedby={errors.receiptNo ? "receipt-no-error" : undefined}
              {...register("receiptNo")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-date" label={documentDateLabel} error={errors.date?.message}>
            <Input
              id="receipt-date"
              type="date"
              className={fieldClass}
              aria-invalid={errors.date ? true : false}
              aria-describedby={errors.date ? "receipt-date-error" : undefined}
              {...register("date")}
            />
          </ReceiptField>

          {kind === "invoice" ? (
            <ReceiptField id="receipt-invoice-mode" label="Invoice type" className="sm:col-span-2">
              <select id="receipt-invoice-mode" className={fieldClass} {...register("invoiceMode")}>
                <option value="load">Per load</option>
                <option value="monthly">Monthly statement</option>
              </select>
            </ReceiptField>
          ) : null}

          {kind === "invoice" && invoiceMode === "monthly" ? (
            <>
              <ReceiptField
                id="receipt-period-from"
                label="Period from"
                error={errors.periodFrom?.message}
              >
                <Input
                  id="receipt-period-from"
                  type="date"
                  className={fieldClass}
                  aria-invalid={errors.periodFrom ? true : false}
                  {...register("periodFrom")}
                />
              </ReceiptField>
              <ReceiptField
                id="receipt-period-to"
                label="Period to"
                error={errors.periodTo?.message}
              >
                <Input
                  id="receipt-period-to"
                  type="date"
                  className={fieldClass}
                  aria-invalid={errors.periodTo ? true : false}
                  {...register("periodTo")}
                />
              </ReceiptField>
            </>
          ) : null}

          {kind === "quotation" ? (
            <ReceiptField
              id="receipt-valid-until"
              label="Valid until"
              error={errors.validUntil?.message}
            >
              <Input
                id="receipt-valid-until"
                type="date"
                className={fieldClass}
                aria-invalid={errors.validUntil ? true : false}
                aria-describedby={errors.validUntil ? "receipt-valid-until-error" : undefined}
                {...register("validUntil")}
              />
            </ReceiptField>
          ) : null}

          <ReceiptField
            id="receipt-customer"
            label="Customer name"
            error={errors.customerName?.message}
          >
            <Input
              id="receipt-customer"
              autoComplete="name"
              className={fieldClass}
              aria-invalid={errors.customerName ? true : false}
              aria-describedby={errors.customerName ? "receipt-customer-error" : undefined}
              {...register("customerName")}
            />
          </ReceiptField>

          <ReceiptField
            id="receipt-customer-number"
            label="Customer number"
            error={errors.customerNumber?.message}
          >
            <Input
              id="receipt-customer-number"
              inputMode="tel"
              placeholder="0772 000 000"
              className={fieldClass}
              aria-invalid={errors.customerNumber ? true : false}
              aria-describedby={errors.customerNumber ? "receipt-customer-number-error" : undefined}
              {...register("customerNumber")}
            />
          </ReceiptField>

          <ReceiptField
            id="receipt-customer-address"
            label="Customer address"
            error={errors.customerAddress?.message}
            className="sm:col-span-2"
          >
            <Textarea
              id="receipt-customer-address"
              rows={2}
              placeholder="Optional"
              className={textareaClass}
              aria-invalid={errors.customerAddress ? true : false}
              aria-describedby={
                errors.customerAddress ? "receipt-customer-address-error" : undefined
              }
              {...register("customerAddress")}
            />
          </ReceiptField>

          <ReceiptField
            id="receipt-service"
            label="Service"
            error={errors.service?.message}
            className="sm:col-span-2"
          >
            <select
              id="receipt-service"
              className={fieldClass}
              aria-invalid={errors.service ? true : false}
              aria-describedby={errors.service ? "receipt-service-error" : undefined}
              {...register("service")}
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
          </ReceiptField>

          <ReceiptField
            id="receipt-order-number"
            label="Order number"
            error={errors.orderNo?.message}
          >
            <Input
              id="receipt-order-number"
              placeholder="Optional"
              className={fieldClass}
              aria-invalid={errors.orderNo ? true : false}
              aria-describedby={errors.orderNo ? "receipt-order-number-error" : undefined}
              {...register("orderNo")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-vat-number" label="VAT number" error={errors.vatNo?.message}>
            <Input
              id="receipt-vat-number"
              placeholder="Optional"
              className={fieldClass}
              aria-invalid={errors.vatNo ? true : false}
              aria-describedby={errors.vatNo ? "receipt-vat-number-error" : undefined}
              {...register("vatNo")}
            />
          </ReceiptField>
        </div>

        <div className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
              <SectionLabel section={copy.linesSection} />
            </p>
            <PillButton
              type="button"
              size="default"
              variant="secondary"
              disabled={fields.length >= MAX_RECEIPT_LINES}
              onClick={() => append({ date: "", quantity: "1", description: "", unitPrice: "" })}
            >
              <Plus aria-hidden="true" />
              <CtaLabel cta="addLine" />
            </PillButton>
          </div>

          <div className="mt-4 rounded-[18px] border border-border bg-secondary/35 p-4">
            <div>
              <p className="text-sm font-semibold text-ink-heading">Table columns</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                Swap columns with the arrows. Quantity sits in the middle by default on invoices.
              </p>
            </div>
            <ul className="mt-4 space-y-2">
              {activeColumns.map((column, index) => (
                <li
                  key={column}
                  className="flex items-center justify-between gap-3 rounded-full border border-border bg-card px-3 py-2"
                >
                  <span className="text-sm font-medium text-ink-heading">
                    {columnLabel(column)}
                  </span>
                  <div className="flex items-center gap-1">
                    {column !== "description" && column !== "amount" ? (
                      <button
                        type="button"
                        className="touch-surface inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-secondary hover:text-ink-heading"
                        aria-label={`Hide ${columnLabel(column)} column`}
                        onClick={() => toggleColumn(column)}
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="touch-surface inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-secondary hover:text-ink-heading disabled:opacity-40"
                      aria-label={`Move ${columnLabel(column)} left`}
                      disabled={index === 0}
                      onClick={() => moveColumn(column, -1)}
                    >
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="touch-surface inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-secondary hover:text-ink-heading disabled:opacity-40"
                      aria-label={`Move ${columnLabel(column)} right`}
                      disabled={index === activeColumns.length - 1}
                      onClick={() => moveColumn(column, 1)}
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {hiddenColumns.length > 0 ? (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <span className="text-xs font-medium text-ink-muted">Add column</span>
                {hiddenColumns.map((column) => (
                  <button
                    key={column}
                    type="button"
                    className="touch-surface inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-ink-heading transition-colors hover:bg-paper"
                    aria-label={`Add ${columnLabel(column)} column`}
                    onClick={() => toggleColumn(column)}
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    {columnLabel(column)}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-wrap items-start gap-3 rounded-[18px] border border-border bg-secondary/35 p-4"
              >
                {activeColumns
                  .filter(
                    (column): column is Exclude<DocumentColumn, "amount"> => column !== "amount",
                  )
                  .map((column) => {
                    if (column === "date") {
                      return (
                        <ReceiptField
                          key={column}
                          id={`receipt-item-${index}-date`}
                          label={kind === "invoice" ? "Line date" : "Date"}
                          error={errors.items?.[index]?.date?.message}
                          className={lineFieldWidth[column]}
                        >
                          <Input
                            id={`receipt-item-${index}-date`}
                            type="date"
                            className={lineInputClass}
                            aria-invalid={errors.items?.[index]?.date ? true : false}
                            {...register(`items.${index}.date`)}
                          />
                        </ReceiptField>
                      );
                    }

                    if (column === "description") {
                      return (
                        <ReceiptField
                          key={column}
                          id={`receipt-item-${index}-description`}
                          label="Description"
                          error={errors.items?.[index]?.description?.message}
                          className={lineFieldWidth[column]}
                        >
                          <Input
                            id={`receipt-item-${index}-description`}
                            className={lineInputClass}
                            aria-invalid={errors.items?.[index]?.description ? true : false}
                            {...register(`items.${index}.description`)}
                          />
                        </ReceiptField>
                      );
                    }

                    if (column === "quantity") {
                      return (
                        <ReceiptField
                          key={column}
                          id={`receipt-item-${index}-quantity`}
                          label="Qty"
                          error={errors.items?.[index]?.quantity?.message}
                          className={lineFieldWidth[column]}
                        >
                          <Input
                            id={`receipt-item-${index}-quantity`}
                            inputMode="decimal"
                            className={lineInputClass}
                            aria-invalid={errors.items?.[index]?.quantity ? true : false}
                            {...register(`items.${index}.quantity`)}
                          />
                        </ReceiptField>
                      );
                    }

                    return (
                      <ReceiptField
                        key={column}
                        id={`receipt-item-${index}-unitPrice`}
                        label="Unit price"
                        error={errors.items?.[index]?.unitPrice?.message}
                        className={lineFieldWidth[column]}
                      >
                        <Input
                          id={`receipt-item-${index}-unitPrice`}
                          inputMode="decimal"
                          placeholder="0.00"
                          className={lineInputClass}
                          aria-invalid={errors.items?.[index]?.unitPrice ? true : false}
                          {...register(`items.${index}.unitPrice`)}
                        />
                      </ReceiptField>
                    );
                  })}
                <button
                  type="button"
                  className="touch-surface ml-auto mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink-muted transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={fields.length === 1}
                  aria-label={bilingualCta("removeLine")}
                  onClick={() => remove(index)}
                >
                  <Trash2 aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ReceiptField id="receipt-currency" label="Currency" error={errors.currency?.message}>
            <Input
              id="receipt-currency"
              maxLength={8}
              className={fieldClass}
              aria-invalid={errors.currency ? true : false}
              aria-describedby={errors.currency ? "receipt-currency-error" : undefined}
              {...register("currency")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-vat-rate" label="VAT rate (%)" error={errors.vatRate?.message}>
            <Input
              id="receipt-vat-rate"
              inputMode="decimal"
              className={fieldClass}
              aria-invalid={errors.vatRate ? true : false}
              aria-describedby={errors.vatRate ? "receipt-vat-rate-error" : undefined}
              {...register("vatRate")}
            />
          </ReceiptField>

          <ReceiptField
            id="receipt-payment-method"
            label={copy.paymentLabel}
            error={errors.paymentMethod?.message}
            className="sm:col-span-2"
          >
            <Input
              id="receipt-payment-method"
              placeholder="Optional"
              className={fieldClass}
              aria-invalid={errors.paymentMethod ? true : false}
              aria-describedby={errors.paymentMethod ? "receipt-payment-method-error" : undefined}
              {...register("paymentMethod")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-signature" label="Signature" error={errors.signature?.message}>
            <Input
              id="receipt-signature"
              placeholder="Optional"
              className={fieldClass}
              aria-invalid={errors.signature ? true : false}
              aria-describedby={errors.signature ? "receipt-signature-error" : undefined}
              {...register("signature")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-notes" label="Notes" error={errors.notes?.message}>
            <Input
              id="receipt-notes"
              placeholder="Optional"
              className={fieldClass}
              aria-invalid={errors.notes ? true : false}
              aria-describedby={errors.notes ? "receipt-notes-error" : undefined}
              {...register("notes")}
            />
          </ReceiptField>

          <ReceiptField
            id="receipt-footer-note"
            label="Footer note"
            error={errors.footerNote?.message}
            className="sm:col-span-2"
          >
            <Input
              id="receipt-footer-note"
              className={fieldClass}
              aria-invalid={errors.footerNote ? true : false}
              aria-describedby={errors.footerNote ? "receipt-footer-note-error" : undefined}
              {...register("footerNote")}
            />
          </ReceiptField>
        </div>

        <div
          className="mt-8 rounded-[20px] border border-border bg-secondary/45 p-4 sm:p-5"
          aria-busy={isDownloading}
        >
          <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
            <SectionLabel section={copy.actionsSection} />
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <PillButton
              type="button"
              variant="accent"
              className="w-full"
              disabled={isDownloading}
              onClick={() => void sendDocument()}
            >
              <WhatsAppIcon className="h-4 w-4" />
              <CtaLabel cta="sendToWhatsapp" />
            </PillButton>
            <PillButton
              type="button"
              variant="secondary"
              className="w-full"
              disabled={isDownloading}
              aria-busy={isDownloading}
              onClick={() => void downloadPdf()}
            >
              {isDownloading ? (
                <LoaderCircle className="animate-spin" aria-hidden="true" />
              ) : (
                <Download aria-hidden="true" />
              )}
              <CtaLabel cta={copy.downloadCta} />
            </PillButton>
            <PillButton
              type="button"
              variant="outline"
              className="w-full"
              disabled={isDownloading}
              onClick={() => void printDocument()}
            >
              <Printer aria-hidden="true" />
              <CtaLabel cta={copy.printCta} />
            </PillButton>
            <PillButton
              type="button"
              variant="outline"
              className="w-full"
              disabled={isDownloading}
              onClick={startNewDocument}
            >
              <RotateCcw aria-hidden="true" />
              <CtaLabel cta={copy.newCta} />
            </PillButton>
          </div>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`mt-4 min-h-10 text-sm leading-relaxed ${
              actionStatus?.tone === "error" ? "font-medium text-ink" : "text-ink-muted"
            }`}
          >
            {actionStatus?.message ??
              `Print opens your browser dialog. WhatsApp opens a chat with the ${documentLabelText} ready. Download saves a PDF here.`}
          </p>
        </div>
      </form>

      <div
        role="region"
        aria-label={`${copy.label} preview`}
        className="receipt-print-area h-fit min-w-0 rounded-[28px] border border-border bg-paper p-4 text-ink shadow-card sm:p-7"
      >
        <div className="receipt-sheet mx-auto max-w-[820px] overflow-hidden rounded-[18px] border border-hairline bg-white">
          <div className="p-5 sm:p-8">
            <header className="flex flex-col gap-5 border-b border-hairline pb-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <img
                  src="/adlam-logo.jpeg"
                  alt="Adlam Logistics"
                  className="h-12 w-auto max-w-[96px] object-contain sm:h-14 sm:max-w-[128px]"
                />
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold uppercase tracking-[-0.02em] text-ink-heading sm:text-2xl">
                    {brand.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                    {brand.address}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="border-b-2 border-ink-heading pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-heading">
                  {copy.label}
                </p>
                <p className="mt-2 text-sm font-semibold tabular-nums text-ink-heading">
                  {values.receiptNo || "—"}
                </p>
                <p className="mt-1 text-xs tabular-nums text-ink-muted">{values.date || "—"}</p>
              </div>
            </header>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  {copy.customerLabel}
                </p>
                <p className="mt-2 text-base font-semibold text-ink-heading">
                  {values.customerName || "—"}
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-ink-muted">
                  {values.customerAddress || "—"}
                </p>
                <p className="mt-1 text-xs tabular-nums text-ink-muted">
                  {values.customerNumber || "—"}
                </p>
              </div>
              <dl className="space-y-2 text-xs sm:border-l sm:border-hairline sm:pl-6">
                {(
                  [
                    ...(kind === "quotation"
                      ? ([["Valid until", values.validUntil]] as const)
                      : []),
                    ...(kind === "invoice" && invoiceMode === "monthly"
                      ? ([
                          [
                            "Period",
                            `${values.periodFrom?.trim() || "—"} to ${values.periodTo?.trim() || "—"}`,
                          ],
                        ] as const)
                      : []),
                    ...(kind === "invoice"
                      ? ([
                          ["Type", invoiceMode === "monthly" ? "Monthly statement" : "Per load"],
                        ] as const)
                      : []),
                    ["Order No.", values.orderNo],
                    ["VAT No.", values.vatNo],
                    ["Service", values.service],
                    [copy.paymentLabel, values.paymentMethod],
                  ] as const
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-ink-muted">{label}</dt>
                    <dd className="max-w-[65%] truncate text-right font-medium text-ink-heading">
                      {value?.trim() || "—"}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div
              className="mt-6 overflow-x-auto"
              role="region"
              aria-label={`${copy.label} line items`}
              tabIndex={0}
            >
              <table
                className={`w-full border-collapse text-left text-sm ${
                  activeColumns.includes("date") ? "min-w-[640px]" : "min-w-[520px]"
                }`}
              >
                <thead>
                  <tr className="bg-ink-heading text-paper">
                    {activeColumns.map((column) => (
                      <th
                        key={column}
                        className={`${cellWidth[column]} px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${columnAlignmentClass(column)}`}
                      >
                        {columnLabel(column)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(values.items ?? []).map((item, index) => (
                    <tr key={index} className="receipt-line-row align-top">
                      {activeColumns.map((column) => (
                        <td
                          key={column}
                          className={`border-b border-hairline px-3 py-3 ${
                            column === "description"
                              ? "font-medium text-ink-heading"
                              : "tabular-nums"
                          } ${columnAlignmentClass(column)} ${
                            column === "amount" ? "font-semibold" : ""
                          }`}
                        >
                          {previewCellText(column, item, values, kind, currency)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {(values.items ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={activeColumns.length}
                        className="border-b border-hairline px-3 py-5 text-center text-ink-muted"
                      >
                        Add at least one line item.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            {values.notes?.trim() ? (
              <section className="mt-6 border-t border-hairline pt-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  Notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink">
                  {values.notes.trim()}
                </p>
              </section>
            ) : null}

            <div className="mt-7 grid gap-7 sm:grid-cols-2 sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
                  Authorised signature
                </p>
                <div className="mt-8 min-h-7 border-b border-ink/40 pb-1 text-sm italic text-ink-heading">
                  {values.signature || ""}
                </div>
                <p className="mt-2 text-[11px] text-ink-muted">Issued by {brand.name}</p>
                <div className="mt-5 min-h-7 border-b border-ink/40" aria-hidden="true" />
                <p className="mt-2 text-[11px] text-ink-muted">{copy.acceptanceLabel}</p>
              </div>
              <dl className="w-full max-w-[320px] justify-self-end text-sm">
                <div className="flex justify-between gap-4 border-b border-hairline px-3 py-2">
                  <dt className="text-ink-muted">Sub total</dt>
                  <dd className="font-semibold tabular-nums">{subTotalLabel}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-hairline px-3 py-2">
                  <dt className="text-ink-muted">VAT ({receiptNumber(values.vatRate ?? "0")}%)</dt>
                  <dd className="font-semibold tabular-nums">{vatLabel}</dd>
                </div>
                <div className="flex justify-between gap-4 bg-ink-heading px-3 py-2.5 text-paper">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-semibold tabular-nums">{totalLabel}</dd>
                </div>
              </dl>
            </div>

            <Motto className="mt-8 text-center text-ink-muted [&>p]:text-center" />
            <p className="mt-4 text-center text-xs font-medium text-ink-heading">
              {values.footerNote || "Thank you for your business"}
            </p>
            <p className="mt-3 border-t border-hairline pt-3 text-center text-[11px] text-ink-muted">
              Powered by {brand.poweredBy}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReceiptBuilder() {
  return <DocumentBuilder kind="receipt" />;
}

export function QuotationBuilder() {
  return <DocumentBuilder kind="quotation" />;
}

export function InvoiceBuilder() {
  return <DocumentBuilder kind="invoice" />;
}
