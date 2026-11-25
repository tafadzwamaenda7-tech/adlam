import type { ComponentPropsWithoutRef } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PillButtonProps = ComponentPropsWithoutRef<typeof Button>;

export function PillButton({ className, size = "lg", ...props }: PillButtonProps) {
  return (
    <Button
      size={size}
      className={cn("h-12 rounded-full px-7 text-sm font-medium shadow-float", className)}
      {...props}
    />
  );
}
