import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatsAppLink } from "@/components/site/whatsapp-link";
import { whatsappUrl } from "@/lib/whatsapp";

describe("WhatsAppLink", () => {
  it("opens a prefilled WhatsApp chat for the selected number", () => {
    const dial = "263772246166";
    const label = "0772 246 166";
    const message = "Hello Adlam Logistics, I would like to ask about a delivery.";

    render(<WhatsAppLink dial={dial} label={label} message={message} />);

    const link = screen.getByRole("link", {
      name: `Chat with Adlam Logistics on WhatsApp: ${label}`,
    });

    expect(link).toHaveAttribute("href", whatsappUrl(dial, message));
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
