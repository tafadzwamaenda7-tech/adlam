import type { CSSProperties, ReactNode } from "react";

import type { MediaImage } from "@/lib/media";
import { cn } from "@/lib/utils";

type ImagePanelProps = {
  image: MediaImage;
  children?: ReactNode;
  className?: string;
  imageClassName?: string;
  objectPosition?: string;
  overlay?: boolean;
  eager?: boolean;
};

export function ImagePanel({
  image,
  children,
  className,
  imageClassName,
  objectPosition,
  overlay = true,
  eager = false,
}: ImagePanelProps) {
  const style: CSSProperties | undefined = objectPosition ? { objectPosition } : undefined;

  return (
    <div
      className={cn(
        "group relative isolate overflow-hidden rounded-[24px] bg-dark-surface text-paper shadow-card",
        className,
      )}
    >
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={eager ? "eager" : "lazy"}
        style={style}
        className={cn(
          "absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]",
          imageClassName,
        )}
      />
      {overlay ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-dark-surface/70" />
      ) : null}
      {children ? <div className="relative flex h-full flex-col">{children}</div> : null}
    </div>
  );
}
