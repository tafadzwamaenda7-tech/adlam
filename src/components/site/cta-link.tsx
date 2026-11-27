import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { BilingualLabel } from "@/components/site/bilingual-label";
import { PillButton } from "@/components/site/pill-button";
import type { ButtonProps } from "@/components/ui/button";
import { ctaLabels, type CtaKey, type NavigationHref } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type CtaLabelProps = {
  cta: CtaKey;
  className?: string;
};

export function CtaLabel({ cta, className }: CtaLabelProps) {
  return <BilingualLabel label={ctaLabels[cta]} className={className} />;
}

type CtaLinkProps = {
  cta: CtaKey;
  to: NavigationHref;
  hash?: string;
  variant?: NonNullable<ButtonProps["variant"]>;
  className?: string;
};

export function CtaLink({ cta, to, hash, variant, className }: CtaLinkProps) {
  const hashProps = hash ? { hash } : {};

  return (
    <PillButton variant={variant} asChild className={className}>
      <Link to={to} {...hashProps}>
        <CtaLabel cta={cta} />
        <ArrowRight aria-hidden="true" />
      </Link>
    </PillButton>
  );
}

type CtaInlineLinkProps = {
  cta: CtaKey;
  to: NavigationHref;
  hash?: string;
  className?: string;
};

export function CtaInlineLink({ cta, to, hash, className }: CtaInlineLinkProps) {
  const hashProps = hash ? { hash } : {};

  return (
    <Link
      to={to}
      {...hashProps}
      className={cn(
        "touch-surface inline-flex items-center gap-2 rounded-pill text-sm font-medium transition-opacity hover:opacity-75",
        className,
      )}
    >
      <CtaLabel cta={cta} />
      <ArrowUpRight aria-hidden="true" />
    </Link>
  );
}
