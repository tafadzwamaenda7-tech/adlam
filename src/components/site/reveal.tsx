import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type RevealVariant = "rise" | "scale" | "drop";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: RevealVariant;
  index?: number;
};

const STAGGER_STEP = 80;

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  index = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const transitionDelay = delay + index * STAGGER_STEP;

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      data-visible={visible ? "true" : "false"}
      data-variant={variant}
      data-index={index}
      style={transitionDelay ? { transitionDelay: `${transitionDelay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
