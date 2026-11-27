import { zodResolver } from "@hookform/resolvers/zod";
import { Download, LoaderCircle, Plus, Printer, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
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
  buildQuotationWhatsappMessage,
  buildReceiptWhatsappMessage,
  createQuotationNumber,
  createReceiptNumber,
  formatReceiptAmount,
  itemAmount,
  receiptFileBase,
  receiptNumber,
  receiptTotals,
  toDateInputValue,
  toValidUntilInputValue,
  toWhatsappDial,
  type DocumentKind,
  type ReceiptValues,
} from "@/lib/receipt";
import { downloadQuotationPdf, downloadReceiptPdf } from "@/lib/receipt-pdf";
import { brand, ctaLabels, services } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

const MAX_RECEIPT_LINES = 10;
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
} as const satisfies Record<
  DocumentKind,
  {
    label: string;
    numberLabel: string;
    detailsSection: "receiptDetails" | "quotationDetails";
    actionsSection: "receiptActions" | "quotationActions";
    downloadCta: "downloadReceipt" | "downloadQuotation";
    printCta: "printReceipt" | "printQuotation";
    newCta: "newReceipt" | "newQuotation";
    acceptanceLabel: string;
    customerLabel: string;
    linesSection: "lineItems" | "quotationLines";
    paymentLabel: string;
  }
>;

const lineSchema = z.object({
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

const receiptSchema = z.object({
  receiptNo: z.string().trim().min(3, "Enter a document number."),
  date: z.string().min(1, "Choose a date."),
  validUntil: z.string().trim().max(40, "Valid-until date is too long.").optional(),
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

const fieldIds: Partial<Record<keyof ReceiptValues, string>> = {
  receiptNo: "receipt-no",
  date: "receipt-date",
  validUntil: "receipt-valid-until",
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

type ActionStatus = {
  tone: "info" | "success" | "error";
  message: string;
};

function defaultDocument(kind: DocumentKind, date: Date | null = null): ReceiptValues {
  return {
    receiptNo: date
      ? kind === "receipt"
        ? createReceiptNumber(date)
        : createQuotationNumber(date)
      : "",
    date: date ? toDateInputValue(date) : "",
    validUntil: date && kind === "quotation" ? toValidUntilInputValue(date) : "",
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    orderNo: "",
    vatNo: "",
    service: "",
    items: [{ quantity: "1", description: "", unitPrice: "" }],
    currency: "USD",
    vatRate: "0",
    paymentMethod: "",
    signature: "",
    notes: "",
    footerNote: "Thank you for your business",
  };
}

function bilingualCta(key: "addLine" | "newReceipt" | "newQuotation" | "removeLine"): string {
  const label = ctaLabels[key];
  return `${label.shona} / ${label.english}`;
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
    resolver: zodResolver(receiptSchema),
    mode: "onBlur",
    defaultValues: initialValues,
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const [isDownloading, setIsDownloading] = useState(false);
  const [actionStatus, setActionStatus] = useState<ActionStatus | null>(null);

  useEffect(() => {
    // Keep the server and first client render identical; fill these after hydration.
    const initial = defaultDocument(kind, new Date());
    if (!getValues("receiptNo")) setValue("receiptNo", initial.receiptNo);
    if (!getValues("date")) setValue("date", initial.date);
    if (kind === "quotation" && !getValues("validUntil")) {
      setValue("validUntil", initial.validUntil ?? "");
    }
  }, [getValues, kind, setValue]);

  useEffect(() => {
    const clearPrintMode = () => document.body.classList.remove("printing-receipt");

    window.addEventListener("afterprint", clearPrintMode);

    return () => {
      window.removeEventListener("afterprint", clearPrintMode);
      clearPrintMode();
    };
  }, []);

  const values = watch();
  const currency = values.currency?.trim() || "USD";
  const totals = receiptTotals({ items: values.items ?? [], vatRate: values.vatRate ?? "0" });
  const subTotalLabel = formatReceiptAmount(totals.subtotal, currency);
  const vatLabel = formatReceiptAmount(totals.vat, currency);
  const totalLabel = formatReceiptAmount(totals.total, currency);

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

    const link = document.createElement("a");
    link.href = whatsappUrl(
      dial,
      kind === "receipt"
        ? buildReceiptWhatsappMessage(submitted)
        : buildQuotationWhatsappMessage(submitted),
    );
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
    setActionStatus({
      tone: "success",
      message: `WhatsApp opened with the ${copy.label.toLowerCase()}. Press Send there to deliver it.`,
    });
  }, onInvalid);

  const downloadPdf = handleSubmit(async (submitted) => {
    setIsDownloading(true);
    setActionStatus({ tone: "info", message: "Preparing your PDF…" });

    try {
      if (kind === "receipt") {
        await downloadReceiptPdf(submitted);
      } else {
        await downloadQuotationPdf(submitted);
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
    if (!window.confirm(`Clear this ${copy.label.toLowerCase()} and start a new one?`)) return;

    reset(defaultDocument(kind, new Date()));
    setActionStatus({
      tone: "info",
      message: `Started a new ${copy.label.toLowerCase()}. Add the customer and line items.`,
    });
  };

  const documentLabel = copy.label.toLowerCase();

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      <form className="receipt-no-print min-w-0 rounded-[28px] border border-border bg-card p-7 shadow-card sm:p-9">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
          <SectionLabel section={copy.detailsSection} />
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
          Fill in the {documentLabel}.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Add the lines, then print, download or send the {documentLabel} on WhatsApp. Nothing is
          sent or saved.
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

          <ReceiptField id="receipt-date" label="Date" error={errors.date?.message}>
            <Input
              id="receipt-date"
              type="date"
              className={fieldClass}
              aria-invalid={errors.date ? true : false}
              aria-describedby={errors.date ? "receipt-date-error" : undefined}
              {...register("date")}
            />
          </ReceiptField>

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
              onClick={() => append({ quantity: "1", description: "", unitPrice: "" })}
            >
              <Plus aria-hidden="true" />
              <CtaLabel cta="addLine" />
            </PillButton>
          </div>

          <div className="mt-4 space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-[18px] border border-border bg-secondary/35 p-4 sm:grid-cols-[76px_minmax(0,1fr)_120px_auto] sm:items-start"
              >
                <ReceiptField
                  id={`receipt-item-${index}-quantity`}
                  label="Qty"
                  error={errors.items?.[index]?.quantity?.message}
                >
                  <Input
                    id={`receipt-item-${index}-quantity`}
                    inputMode="decimal"
                    className="mt-2 h-11 w-full rounded-[12px] border border-input bg-card px-3 text-base text-ink"
                    aria-invalid={errors.items?.[index]?.quantity ? true : false}
                    aria-describedby={
                      errors.items?.[index]?.quantity
                        ? `receipt-item-${index}-quantity-error`
                        : undefined
                    }
                    {...register(`items.${index}.quantity`)}
                  />
                </ReceiptField>

                <ReceiptField
                  id={`receipt-item-${index}-description`}
                  label="Description"
                  error={errors.items?.[index]?.description?.message}
                >
                  <Input
                    id={`receipt-item-${index}-description`}
                    className="mt-2 h-11 w-full rounded-[12px] border border-input bg-card px-3 text-base text-ink"
                    aria-invalid={errors.items?.[index]?.description ? true : false}
                    aria-describedby={
                      errors.items?.[index]?.description
                        ? `receipt-item-${index}-description-error`
                        : undefined
                    }
                    {...register(`items.${index}.description`)}
                  />
                </ReceiptField>

                <ReceiptField
                  id={`receipt-item-${index}-unitPrice`}
                  label="Unit price"
                  error={errors.items?.[index]?.unitPrice?.message}
                >
                  <Input
                    id={`receipt-item-${index}-unitPrice`}
                    inputMode="decimal"
                    placeholder="0.00"
                    className="mt-2 h-11 w-full rounded-[12px] border border-input bg-card px-3 text-base text-ink"
                    aria-invalid={errors.items?.[index]?.unitPrice ? true : false}
                    aria-describedby={
                      errors.items?.[index]?.unitPrice
                        ? `receipt-item-${index}-unitPrice-error`
                        : undefined
                    }
                    {...register(`items.${index}.unitPrice`)}
                  />
                </ReceiptField>

                <button
                  type="button"
                  className="touch-surface mt-7 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-ink-muted transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
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
              `Print opens your browser dialog. WhatsApp opens a chat with the ${documentLabel} ready. Download saves a PDF here.`}
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-ink">
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
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-ink-heading text-paper">
                    <th className="w-20 px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                      Qty
                    </th>
                    <th className="px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em]">
                      Description
                    </th>
                    <th className="w-32 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em]">
                      Unit price
                    </th>
                    <th className="w-32 px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-[0.08em]">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(values.items ?? []).map((item, index) => (
                    <tr key={index} className="receipt-line-row align-top">
                      <td className="border-b border-hairline px-3 py-3 tabular-nums">
                        {item?.quantity || "—"}
                      </td>
                      <td className="border-b border-hairline px-3 py-3 font-medium text-ink-heading">
                        {item?.description || "—"}
                      </td>
                      <td className="border-b border-hairline px-3 py-3 text-right tabular-nums">
                        {formatReceiptAmount(receiptNumber(item?.unitPrice ?? ""), currency)}
                      </td>
                      <td className="border-b border-hairline px-3 py-3 text-right font-semibold tabular-nums">
                        {formatReceiptAmount(item ? itemAmount(item) : 0, currency)}
                      </td>
                    </tr>
                  ))}
                  {(values.items ?? []).length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
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
