import { useId } from "react";

import { cn } from "@/lib/utils";

type NetworkDiagramProps = {
  className?: string;
};

const nodes = [
  { x: 90, y: 218, label: "China", anchor: "middle" },
  { x: 350, y: 138, label: "Zimbabwe", anchor: "middle" },
  { x: 620, y: 206, label: "Harare", anchor: "middle" },
  { x: 900, y: 142, label: "Company or home", anchor: "end" },
] as const;

const steps = ["China", "Zimbabwe", "Harare", "Company or home"] as const;

export function NetworkDiagram({ className }: NetworkDiagramProps) {
  const id = useId().replace(/:/g, "");

  return (
    <div className={cn("text-ink", className)}>
      <svg
        viewBox="0 0 1000 300"
        role="img"
        aria-labelledby={`${id}-title ${id}-desc`}
        className="hidden h-auto w-full font-sans sm:block"
      >
        <title id={`${id}-title`}>China-to-door schematic</title>
        <desc id={`${id}-desc`}>
          Goods are procured in China, the move is arranged to Zimbabwe, and delivery ends at the
          customer&apos;s company or home.
        </desc>

        <g stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" fill="none">
          <path d="M106 224H330L366 146H604L636 212H884L900 150" />
          <path d="M106 224H330L366 146" strokeOpacity="0.16" />
          <path d="M636 212H884L900 150" strokeOpacity="0.16" />
        </g>

        {nodes.map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="7" fill="currentColor" fillOpacity="0.08" />
            <circle
              cx={node.x}
              cy={node.y}
              r="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <text
              x={node.x}
              y={node.y + 30}
              textAnchor={node.anchor}
              className="fill-current text-[16px] font-medium tracking-[-0.01em]"
              fillOpacity="0.75"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      <ol className="border-t border-hairline text-base leading-[1.6] text-ink-muted sm:hidden">
        {steps.map((step) => (
          <li key={step} className="border-b border-hairline py-4">
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
