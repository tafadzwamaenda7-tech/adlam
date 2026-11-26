import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { WhatsAppMenu } from "@/components/site/whatsapp-menu";
import { deliveryEnquiryMessage, whatsappNumbers } from "@/lib/site-data";
import { whatsappUrl } from "@/lib/whatsapp";

describe("WhatsAppMenu", () => {
  it("uses one trigger that opens both prefilled WhatsApp options", () => {
    render(<WhatsAppMenu />);

    const trigger = screen.getByRole("button", {
      name: "Chat with Adlam Logistics on WhatsApp",
    });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const menu = screen.getByRole("menu", { name: "Choose a WhatsApp number" });
    const links = within(menu).getAllByRole("menuitem");

    expect(links).toHaveLength(2);
    whatsappNumbers.forEach((number, index) => {
      expect(links[index]).toHaveAttribute(
        "href",
        whatsappUrl(number.dial, deliveryEnquiryMessage),
      );
    });
  });
});
