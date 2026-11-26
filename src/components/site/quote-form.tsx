import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SectionLabel } from "@/components/site/bilingual-label";
import { CtaLabel } from "@/components/site/cta-link";
import { PillButton } from "@/components/site/pill-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services, whatsappNumbers } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

const urgencyOptions = ["Today", "Within 2 days", "This week", "Flexible"] as const;

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  company: z.string().trim().max(120, "Company name is too long."),
  phone: z
    .string()
    .trim()
    .min(9, "Enter your phone number.")
    .max(24, "Phone number is too long.")
    .regex(/^[+]?[\d\s()-]+$/, "Enter a valid phone number."),
  pickup: z.string().trim().min(2, "Pickup location is required."),
  delivery: z.string().trim().min(2, "Delivery location is required."),
  service: z.string().min(1, "Choose a service."),
  urgency: z.string().min(1, "Choose how urgent this is."),
  details: z.string().trim().min(10, "Add a little more cargo detail."),
});

type QuoteValues = z.infer<typeof quoteSchema>;

const fieldClass =
  "mt-2 h-12 w-full rounded-[14px] border border-input bg-card px-4 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";
const textareaClass =
  "mt-2 min-h-32 w-full resize-y rounded-[14px] border border-input bg-card px-4 py-3 text-base text-ink placeholder:text-ink-muted/70 focus-visible:border-accent-quiet focus-visible:ring-2 focus-visible:ring-accent-quiet focus-visible:ring-offset-2";
const labelClass = "text-sm font-medium text-ink";

function FieldError({ id, message }: { id: string; message: string | undefined }) {
  if (!message) {
    return null;
  }
  return (
    <p id={id} className="mt-2 text-sm font-medium leading-relaxed text-ink">
      {message}
    </p>
  );
}

function buildRequestMessage(values: QuoteValues): string {
  const lines = ["Quote request - Adlam Logistics", `Name: ${values.name}`];
  if (values.company.trim()) {
    lines.push(`Company: ${values.company.trim()}`);
  }
  lines.push(
    `Customer number: ${values.phone}`,
    `Service: ${values.service}`,
    `Pickup: ${values.pickup}`,
    `Delivery: ${values.delivery}`,
    `Urgency: ${values.urgency}`,
    "",
    "Cargo details:",
    values.details,
  );
  return lines.join("\n");
}

function PreviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] bg-card p-5 shadow-sm">
      <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">{label}</p>
      <p className="mt-2 text-base leading-relaxed text-ink">{value || "Not provided"}</p>
    </div>
  );
}

export function QuoteForm() {
  const [prepared, setPrepared] = useState<QuoteValues | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      phone: "",
      pickup: "",
      delivery: "",
      service: "",
      urgency: "",
      details: "",
    },
  });

  const onSubmit = (values: QuoteValues) => {
    setPrepared(values);
  };

  if (prepared) {
    const message = buildRequestMessage(prepared);
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[28px] border border-border bg-secondary/60 p-7 sm:p-9"
      >
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
          <SectionLabel section="requestPreview" />
        </p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.045em]">
          Check it before you send
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted">
          Nothing has been sent yet. Choose a WhatsApp number below and WhatsApp will open with this
          message ready for you to check and send.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <PreviewItem label="Name" value={prepared.name} />
          <PreviewItem label="Company" value={prepared.company} />
          <PreviewItem label="Customer number" value={prepared.phone} />
          <PreviewItem label="Urgency" value={prepared.urgency} />
          <PreviewItem label="Service" value={prepared.service} />
          <PreviewItem label="Lane" value={`${prepared.pickup} to ${prepared.delivery}`} />
        </div>

        <div className="mt-4 rounded-[20px] bg-card p-5 shadow-sm">
          <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Cargo details</p>
          <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-ink">
            {prepared.details}
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-medium text-ink">Send this request to WhatsApp</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            {whatsappNumbers.map((number) => (
              <PillButton key={number.dial} asChild>
                <a
                  href={whatsappUrl(number.dial, message)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CtaLabel cta="sendToWhatsapp" />
                  <span>{number.label}</span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </PillButton>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-muted">
            The message opens in WhatsApp for your final check. It is only sent when you press Send
            there.
          </p>
        </div>

        <PillButton
          type="button"
          variant="outline"
          className="mt-8"
          onClick={() => setPrepared(null)}
        >
          <CtaLabel cta="editRequest" />
        </PillButton>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b border-border pb-8">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">
          <SectionLabel section="quoteRequest" />
        </p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.045em]">
          Tell us the load.
        </h2>
        <p className="mt-3 text-base leading-[1.6] text-ink-muted">
          Review every detail first, then send through WhatsApp.
        </p>
      </div>

      {Object.keys(errors).length > 0 ? (
        <div
          role="alert"
          tabIndex={-1}
          className="mt-8 rounded-2xl border border-accent-quiet/30 bg-accent-quiet/10 px-4 py-3 text-sm font-medium leading-relaxed text-ink"
        >
          Check the highlighted fields and try again.
        </div>
      ) : null}

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div>
          <Label htmlFor="quote-name" className={labelClass}>
            Full name
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <Input
            id="quote-name"
            autoComplete="name"
            placeholder="Your name"
            aria-required={true}
            aria-invalid={errors.name ? true : false}
            aria-describedby={errors.name ? "quote-name-error" : undefined}
            className={fieldClass}
            {...register("name")}
          />
          <FieldError id="quote-name-error" message={errors.name?.message} />
        </div>

        <div>
          <Label htmlFor="quote-company" className={labelClass}>
            Company
          </Label>
          <Input
            id="quote-company"
            autoComplete="organization"
            placeholder="Company name"
            className={fieldClass}
            {...register("company")}
          />
        </div>

        <div>
          <Label htmlFor="quote-phone" className={labelClass}>
            Customer number
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <Input
            id="quote-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0772 000 000"
            aria-required={true}
            aria-invalid={errors.phone ? true : false}
            aria-describedby={errors.phone ? "quote-phone-error" : undefined}
            className={fieldClass}
            {...register("phone")}
          />
          <FieldError id="quote-phone-error" message={errors.phone?.message} />
        </div>

        <div>
          <Label htmlFor="quote-urgency" className={labelClass}>
            How urgent?
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <select
            id="quote-urgency"
            aria-required={true}
            aria-invalid={errors.urgency ? true : false}
            aria-describedby={errors.urgency ? "quote-urgency-error" : undefined}
            className={fieldClass}
            {...register("urgency")}
          >
            <option value="">Select urgency</option>
            {urgencyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <FieldError id="quote-urgency-error" message={errors.urgency?.message} />
        </div>

        <div>
          <Label htmlFor="quote-pickup" className={labelClass}>
            Pickup location
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <Input
            id="quote-pickup"
            autoComplete="address-level2"
            placeholder="City or facility"
            aria-required={true}
            aria-invalid={errors.pickup ? true : false}
            aria-describedby={errors.pickup ? "quote-pickup-error" : undefined}
            className={fieldClass}
            {...register("pickup")}
          />
          <FieldError id="quote-pickup-error" message={errors.pickup?.message} />
        </div>

        <div>
          <Label htmlFor="quote-delivery" className={labelClass}>
            Delivery location
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <Input
            id="quote-delivery"
            autoComplete="address-level2"
            placeholder="City or facility"
            aria-required={true}
            aria-invalid={errors.delivery ? true : false}
            aria-describedby={errors.delivery ? "quote-delivery-error" : undefined}
            className={fieldClass}
            {...register("delivery")}
          />
          <FieldError id="quote-delivery-error" message={errors.delivery?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="quote-service" className={labelClass}>
            Service
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <select
            id="quote-service"
            aria-required={true}
            aria-invalid={errors.service ? true : false}
            aria-describedby={errors.service ? "quote-service-error" : undefined}
            className={fieldClass}
            {...register("service")}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
          <FieldError id="quote-service-error" message={errors.service?.message} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="quote-details" className={labelClass}>
            Cargo details
            <span className="text-ink-muted" aria-hidden="true">
              {" "}
              *
            </span>
          </Label>
          <Textarea
            id="quote-details"
            rows={4}
            placeholder="Cargo type, quantity, pickup and timing"
            aria-required={true}
            aria-invalid={errors.details ? true : false}
            aria-describedby={errors.details ? "quote-details-error" : undefined}
            className={textareaClass}
            {...register("details")}
          />
          <FieldError id="quote-details-error" message={errors.details?.message} />
        </div>
      </div>

      <PillButton type="submit" className="mt-10 w-full">
        <CtaLabel cta="reviewRequest" />
        <ArrowRight aria-hidden="true" />
      </PillButton>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Nothing is sent until you press Send in WhatsApp.
      </p>
      <div className="mt-6 border-t border-border pt-5">
        <p className="text-sm font-medium text-ink">Or send your enquiry directly on WhatsApp</p>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
          {whatsappNumbers.map((number) => (
            <a
              key={number.dial}
              href={whatsappUrl(
                number.dial,
                "Hello Adlam Logistics, I have an enquiry and would like to confirm availability.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-accent/50 underline-offset-4 transition-colors hover:text-accent"
            >
              {number.label}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>
    </form>
  );
}
