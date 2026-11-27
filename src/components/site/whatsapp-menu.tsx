import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

import { WhatsAppIcon, WhatsAppLink } from "@/components/site/whatsapp-link";
import { deliveryEnquiryMessage, whatsappNumbers } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type WhatsAppMenuProps = {
  className?: string;
  rootClassName?: string;
  menuClassName?: string;
  placement?: "bottom" | "top";
  showTriggerLabel?: boolean;
};

const STAGGER_STEP = 60;

export function WhatsAppMenu({
  className,
  rootClassName,
  menuClassName,
  placement = "bottom",
  showTriggerLabel = false,
}: WhatsAppMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) {
      if (menuRef.current?.contains(document.activeElement)) {
        triggerRef.current?.focus();
      }
      return undefined;
    }

    const firstItem = menuRef.current?.querySelector<HTMLAnchorElement>("[role='menuitem']");
    firstItem?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>("[role='menuitem']") ?? [],
    );

    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement as HTMLAnchorElement);

    if (event.key === "ArrowDown") {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    }

    if (event.key === "Home") {
      event.preventDefault();
      items[0]?.focus();
    }

    if (event.key === "End") {
      event.preventDefault();
      items[items.length - 1]?.focus();
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", rootClassName)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Chat with Adlam Logistics on WhatsApp"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "touch-surface inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#20BD5A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]",
          className,
        )}
      >
        <WhatsAppIcon className="h-5 w-5" />
        {showTriggerLabel ? (
          <span className="ml-2 text-sm font-medium">Chat on WhatsApp</span>
        ) : null}
      </button>

      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-label="Choose a WhatsApp number"
        aria-hidden={!open}
        inert={!open}
        data-open={open ? "true" : "false"}
        onKeyDown={handleMenuKeyDown}
        className={cn(
          "whatsapp-popover absolute right-0 z-[60] min-w-[17rem] rounded-2xl border border-border bg-card p-2 text-ink shadow-float",
          placement === "top" ? "bottom-[calc(100%+0.625rem)]" : "top-[calc(100%+0.625rem)]",
          menuClassName,
        )}
      >
        <p className="px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] text-ink-muted">
          Choose a WhatsApp number
        </p>
        <div className="my-1 h-px bg-border" aria-hidden="true" />
        {whatsappNumbers.map((number, index) => (
          <WhatsAppLink
            key={number.dial}
            dial={number.dial}
            label={number.label}
            message={deliveryEnquiryMessage}
            showLabel
            role="menuitem"
            onClick={() => setOpen(false)}
            style={{ transitionDelay: `${index * STAGGER_STEP}ms` }}
            className="h-auto w-full justify-start gap-3 rounded-xl bg-transparent px-3 py-2.5 text-sm font-normal text-ink hover:bg-secondary hover:text-ink-heading focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#25D366]"
          />
        ))}
      </div>
    </div>
  );
}
