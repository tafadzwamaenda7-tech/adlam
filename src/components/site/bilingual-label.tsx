import { sectionLabels, type SectionLabelKey } from "@/lib/site-data";
import { cn } from "@/lib/utils";

export type BilingualLabelValue = {
  readonly shona: string;
  readonly english: string;
};

type BilingualLabelProps = {
  label: BilingualLabelValue;
  className?: string | undefined;
  englishClassName?: string | undefined;
};

export function BilingualLabel({ label, className, englishClassName }: BilingualLabelProps) {
  return (
    <span className={cn("inline-flex flex-col items-start text-left leading-tight", className)}>
      <span>{label.shona}</span>
      <span className={cn("text-[0.72em] font-normal opacity-90", englishClassName)}>
        {label.english}
      </span>
    </span>
  );
}

type SectionLabelProps = {
  section: SectionLabelKey;
  className?: string | undefined;
};

export function SectionLabel({ section, className }: SectionLabelProps) {
  return (
    <BilingualLabel
      label={sectionLabels[section]}
      className={className}
      englishClassName="text-[0.82em] opacity-90"
    />
  );
}
