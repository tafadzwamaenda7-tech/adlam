import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PillButton } from "@/components/site/pill-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { services } from "@/lib/site-data";

const quoteSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name."),
  company: z.string().trim().max(120, "Company name is too long."),
  pickup: z.string().trim().min(2, "Pickup location is required."),
  delivery: z.string().trim().min(2, "Delivery location is required."),
  service: z.string().min(1, "Choose a service."),
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

export function QuoteForm() {
  const [prepared, setPrepared] = useState<QuoteValues | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      company: "",
      pickup: "",
      delivery: "",
      service: "",
      details: "",
    },
  });

  const onSubmit = (values: QuoteValues) => {
    setPrepared(values);
    reset();
  };

  if (prepared) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[28px] border border-border bg-secondary/60 p-7 sm:p-9"
      >
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Request ready</p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.045em]">
          Review your request
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted">
          Thanks, {prepared.name}. This demo has checked your {prepared.service.toLowerCase()}{" "}
          request from {prepared.pickup} to {prepared.delivery}. Nothing has been sent.
        </p>
        <dl className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
          <div className="rounded-[20px] bg-card p-5 shadow-sm">
            <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">Service</dt>
            <dd className="mt-2 text-base text-ink">{prepared.service}</dd>
          </div>
          <div className="rounded-[20px] bg-card p-5 shadow-sm">
            <dt className="text-xs font-medium tracking-[0.08em] text-ink-muted">Lane</dt>
            <dd className="mt-2 text-base text-ink">
              {prepared.pickup} to {prepared.delivery}
            </dd>
          </div>
        </dl>
        <p className="mt-8 max-w-2xl text-base leading-[1.6] text-ink-muted">
          Connect this form to a dispatch endpoint before requests can reach the desk.
        </p>
        <PillButton
          type="button"
          variant="outline"
          className="mt-8"
          onClick={() => {
            setPrepared(null);
            reset();
          }}
        >
          Review another request
        </PillButton>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className="border-b border-border pb-8">
        <p className="text-xs font-medium tracking-[0.08em] text-ink-muted">Quote request</p>
        <h2 className="mt-4 text-[clamp(1.75rem,3vw,2.25rem)] font-semibold tracking-[-0.045em]">
          Tell us the load.
        </h2>
        <p className="mt-3 text-base leading-[1.6] text-ink-muted">Demo form. Nothing is sent.</p>
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
        Review request
        <ArrowRight aria-hidden="true" />
      </PillButton>
      <p className="mt-4 text-sm leading-relaxed text-ink-muted">
        Demo only. Details stay in this browser until an endpoint is connected.
      </p>
    </form>
  );
}
