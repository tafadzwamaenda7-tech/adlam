import { brand } from "@/lib/site-data";

type MottoProps = {
  className?: string;
  heading?: boolean;
};

function MottoLines() {
  return (
    <>
      {brand.motto.split("\n").map((line) => (
        <span className="block" key={line}>
          {line}
        </span>
      ))}
    </>
  );
}

export function Motto({ className, heading = false }: MottoProps) {
  if (heading) {
    return (
      <div className={className}>
        <h2 className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-medium leading-[1.14] tracking-[-0.03em]">
          <MottoLines />
        </h2>
      </div>
    );
  }

  return (
    <div className={className}>
      <p className="text-base leading-[1.6] tracking-[0.02em]">
        <MottoLines />
      </p>
    </div>
  );
}
