import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div">;

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10", className)}
      {...props}
    >
      {children}
    </div>
  );
}
