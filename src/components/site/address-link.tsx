import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { brand } from "@/lib/site-data";

type AddressLinkProps = {
  className?: string;
};

export function AddressLink({ className }: AddressLinkProps) {
  return (
    <a
      href={brand.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "touch-surface inline-flex items-start gap-1.5 underline decoration-current/40 underline-offset-4 transition-opacity hover:opacity-75",
        className,
      )}
    >
      <span>{brand.address}</span>
      <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
  );
}
