import { useState } from "react";

import { SectionLabel } from "@/components/site/bilingual-label";
import { InvoiceBuilder, QuotationBuilder } from "@/components/site/receipt-builder";
import { cn } from "@/lib/utils";

type DocumentType = "quotation" | "invoice";

const tabs: ReadonlyArray<{
  id: DocumentType;
  section: "quotations" | "invoices";
}> = [
  { id: "invoice", section: "invoices" },
  { id: "quotation", section: "quotations" },
];

export function DocumentWorkspace() {
  const [active, setActive] = useState<DocumentType>("invoice");

  return (
    <div>
      <div
        role="group"
        aria-label="Choose a document type"
        className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-card p-1"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            aria-pressed={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-quiet",
              active === tab.id
                ? "bg-ink-heading font-semibold text-paper"
                : "text-ink-muted hover:bg-secondary hover:text-ink-heading",
            )}
          >
            <SectionLabel section={tab.section} className="items-center sm:flex-row sm:gap-2" />
          </button>
        ))}
      </div>

      <div className="mt-6">{active === "invoice" ? <InvoiceBuilder /> : <QuotationBuilder />}</div>
    </div>
  );
}
