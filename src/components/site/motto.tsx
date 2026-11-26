import { cn } from "@/lib/utils";
import { brand } from "@/lib/site-data";

type MottoProps = {
  className?: string;
  heading?: boolean;
  gloss?: boolean;
};

export function Motto({ className, heading = false, gloss = false }: MottoProps) {
  if (heading) {
    return (
      <div className={className}>
        <h2 className="max-w-[18ch] text-[clamp(2rem,5vw,4.25rem)] font-medium uppercase leading-[1.08] tracking-[-0.03em]">
          {brand.motto}
        </h2>
        {gloss ? (
          <p className="mt-6 text-base uppercase leading-[1.6] tracking-[0.04em] text-current">
            {brand.mottoGloss}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-base uppercase leading-[1.6] tracking-[0.04em]">{brand.motto}</p>
      {gloss ? (
        <p className="mt-1 text-sm uppercase tracking-[0.04em] text-current">{brand.mottoGloss}</p>
      ) : null}
    </div>
  );
}
