import { proofFacts } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type ProofRowProps = {
  className?: string;
};

export function ProofRow({ className }: ProofRowProps) {
  const [lead, ...rest] = proofFacts;

  return (
    <div className={cn("grid gap-4 lg:grid-cols-12", className)}>
      <div className="rounded-[32px] border border-border bg-dark-surface p-7 text-paper shadow-card sm:p-9 lg:col-span-5">
        <p className="text-xs font-medium tracking-[0.08em] text-paper/70">{lead.label}</p>
        <span className="mt-5 block h-1 w-14 rounded-pill bg-accent" aria-hidden="true" />
        <p className="mt-6 block text-[clamp(3rem,6vw,4.5rem)] font-semibold leading-none tracking-[-0.05em] text-paper font-display">
          {lead.value}
        </p>
        <p className="mt-4 block max-w-sm text-sm leading-relaxed text-paper/80">
          A 3-wheel skuta, a twin cab and 5, 7 and 10-tonne trucks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
        {rest.map((fact) => (
          <div
            key={fact.label}
            className="rounded-[24px] border border-border bg-card p-6 shadow-card"
          >
            <p className="block text-[clamp(2rem,3vw,2.5rem)] font-semibold leading-none tracking-[-0.05em] text-ink-heading font-display tabular-nums">
              {fact.value}
            </p>
            <p className="mt-3 block text-sm leading-relaxed text-ink-muted">{fact.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
