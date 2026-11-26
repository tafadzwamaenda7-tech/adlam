import { cn } from "@/lib/utils";
import { brand } from "@/lib/site-data";

type PoweredByProps = {
  className?: string;
};

export function PoweredBy({ className }: PoweredByProps) {
  return (
    <small
      className={cn(
        "inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] leading-none",
        className,
      )}
    >
      <span className="font-medium uppercase tracking-[0.14em] text-ink-muted">Powered by</span>{" "}
      <span className="font-display text-sm font-semibold tracking-[-0.01em] text-ink-heading">
        {brand.poweredBy}
      </span>
    </small>
  );
}
