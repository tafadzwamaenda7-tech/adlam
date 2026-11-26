import { zodResolver } from "@hookform/resolvers/zod";
import { Download } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
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
  buildReceiptWhatsappMessage,
  createReceiptNumber,
  formatReceiptAmount,
  toDateInputValue,
  toWhatsappDial,
  type ReceiptValues,
} from "@/lib/receipt";
import { downloadReceiptPdf } from "@/lib/receipt-pdf";
import { brand, services } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

const receiptSchema = z.object({
  receiptNo: z.string().trim().min(3, "Enter a receipt number."),
  date: z.string().min(1, "Choose a date."),
  customerName: z.string().trim().min(2, "Enter the customer name."),
  customerNumber: z
    .string()
    .trim()
    .min(9, "Enter the customer number.")
    .max(24, "Customer number is too long.")
    .regex(/^[+]?[\d\s()-]+$/, "Enter a valid customer number."),
  service: z.string().min(1, "Choose a service."),
  description: z.string().trim().min(4, "Add a short description."),
  amount: z
    .string()
    .trim()
    .min(1, "Enter an amount.")
    .refine((value) => Number(value) > 0, "Enter an amount greater than 0."),
  currency: z.string().trim().min(1, "Enter a currency.").max(8, "Currency is too long."),
  paymentMethod: z.string().trim().max(80, "Payment method is too long."),
  notes: z.string().trim().max(500, "Notes are too long."),
});

const fieldClass =
  "mt-2 h-12 w-full rounded-[14px] border border-input bg-card px-4 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";
const textareaClass =
  "mt-2 min-h-24 w-full resize-y rounded-[14px] border border-input bg-card px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";

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

export function ReceiptBuilder() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReceiptValues>({
    resolver: zodResolver(receiptSchema),
    mode: "onBlur",
    defaultValues: {
      receiptNo: "",
      date: "",
      customerName: "",
      customerNumber: "",
      service: "",
      description: "",
      amount: "",
      currency: "USD",
      paymentMethod: "",
      notes: "",
    },
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const today = new Date();
    setValue("receiptNo", createReceiptNumber(today));
    setValue("date", toDateInputValue(today));
  }, [setValue]);

  useEffect(() => {
    const removePrintClass = () => document.body.classList.remove("printing-receipt");

    window.addEventListener("afterprint", removePrintClass);

    return () => {
      window.removeEventListener("afterprint", removePrintClass);
      removePrintClass();
    };
  }, []);

  const values = watch();
  const amount = formatReceiptAmount(Number(values.amount), values.currency ?? "USD");

  const printReceipt = handleSubmit(() => {
    document.body.classList.add("printing-receipt");
    window.print();
  });

  const sendReceipt = handleSubmit((submitted) => {
    const dial = toWhatsappDial(submitted.customerNumber);

    if (!dial) return;

    const link = document.createElement("a");
    link.href = whatsappUrl(dial, buildReceiptWhatsappMessage(submitted));
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  });

  const downloadPdf = handleSubmit(async (submitted) => {
    setIsDownloading(true);

    try {
      await downloadReceiptPdf(submitted);
    } finally {
      setIsDownloading(false);
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
      <form className="receipt-no-print min-w-0 rounded-[28px] border border-border bg-card p-7 shadow-card sm:p-9">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
          <SectionLabel section="receiptDetails" />
        </p>
        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">Fill in the receipt.</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          The preview updates as you type. Nothing is sent or saved.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ReceiptField id="receipt-no" label="Receipt number" error={errors.receiptNo?.message}>
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
            id="receipt-description"
            label="Description"
            error={errors.description?.message}
            className="sm:col-span-2"
          >
            <Textarea
              id="receipt-description"
              rows={3}
              placeholder="What was supplied or moved"
              className={textareaClass}
              aria-invalid={errors.description ? true : false}
              aria-describedby={errors.description ? "receipt-description-error" : undefined}
              {...register("description")}
            />
          </ReceiptField>

          <ReceiptField id="receipt-amount" label="Amount" error={errors.amount?.message}>
            <Input
              id="receipt-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="0.00"
              className={fieldClass}
              aria-invalid={errors.amount ? true : false}
              aria-describedby={errors.amount ? "receipt-amount-error" : undefined}
              {...register("amount")}
            />
          </ReceiptField>

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

          <ReceiptField
            id="receipt-payment-method"
            label="Payment method"
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

          <ReceiptField
            id="receipt-notes"
            label="Notes"
            error={errors.notes?.message}
            className="sm:col-span-2"
          >
            <Textarea
              id="receipt-notes"
              rows={2}
              placeholder="Optional"
              className={textareaClass}
              aria-invalid={errors.notes ? true : false}
              aria-describedby={errors.notes ? "receipt-notes-error" : undefined}
              {...register("notes")}
            />
          </ReceiptField>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <PillButton type="button" className="w-full" onClick={() => void printReceipt()}>
            <CtaLabel cta="printReceipt" />
          </PillButton>
          <PillButton
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => void sendReceipt()}
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
            <Download aria-hidden="true" />
            <CtaLabel cta="downloadReceipt" />
          </PillButton>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          WhatsApp opens with the receipt ready. Press Send in WhatsApp to deliver it. Download
          saves a PDF on this device.
        </p>
      </form>

      <div
        role="region"
        aria-label="Receipt preview"
        className="receipt-print-area h-fit min-w-0 rounded-[28px] border border-border bg-white p-7 text-ink shadow-card sm:p-10"
      >
        <header className="flex flex-col gap-6 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <img
              src="/adlam-logo.jpeg"
              alt="Adlam Logistics"
              className="h-14 w-auto max-w-[110px] object-contain sm:h-16 sm:max-w-[180px]"
            />
            <div className="min-w-0">
              <p className="font-display text-xl font-semibold tracking-[-0.03em]">{brand.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{brand.address}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-medium tracking-[0.12em] text-ink-muted">Receipt</p>
            <p className="mt-2 font-medium tabular-nums">
              {values.receiptNo || "ADL-YYYYMMDD-0000"}
            </p>
            <p className="mt-1 text-sm text-ink-muted">{values.date || "YYYY-MM-DD"}</p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Received from</p>
            <p className="mt-2 text-base font-medium">{values.customerName || "Customer name"}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {values.customerNumber || "Customer number"}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Service</p>
            <p className="mt-2 text-base font-medium">{values.service || "Service"}</p>
            {values.paymentMethod ? (
              <p className="mt-1 text-sm text-ink-muted">{values.paymentMethod}</p>
            ) : null}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[20px] border border-border">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 bg-secondary/60 px-5 py-3 text-xs font-medium tracking-[0.08em] text-ink-muted">
            <span>Description</span>
            <span>Amount</span>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-5">
            <div>
              <p className="text-base font-medium">{values.service || "Service not selected"}</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
                {values.description || "Receipt description"}
              </p>
            </div>
            <p className="whitespace-nowrap text-base font-semibold tabular-nums">{amount}</p>
          </div>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-t border-border px-5 py-4">
            <span className="font-semibold">Total</span>
            <span className="whitespace-nowrap font-semibold tabular-nums">{amount}</span>
          </div>
        </div>

        {values.notes ? (
          <div className="mt-6">
            <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Notes</p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{values.notes}</p>
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          <div>
            <div className="h-px bg-border" aria-hidden="true" />
            <p className="mt-3 text-sm">Issued by {brand.name}</p>
          </div>
          <div>
            <div className="h-px bg-border" aria-hidden="true" />
            <p className="mt-3 text-sm">Received by</p>
          </div>
        </div>

        <Motto className="mt-10 text-ink-muted" gloss />
        <p className="mt-6 border-t border-border pt-4 text-xs text-ink-muted">
          Powered by {brand.poweredBy}
        </p>
      </div>
    </div>
  );
}
