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

  it("keeps the popover mounted but hidden until it opens", () => {
    render(<WhatsAppMenu />);

    const closedMenu = document.querySelector("[role='menu']");
    expect(closedMenu).toBeInTheDocument();
    expect(closedMenu).toHaveClass("whatsapp-popover");
    expect(closedMenu).toHaveAttribute("aria-hidden", "true");
    expect(closedMenu).toHaveAttribute("data-open", "false");
    expect(within(closedMenu as HTMLElement).queryAllByRole("menuitem")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: "Chat with Adlam Logistics on WhatsApp" }));

    expect(within(screen.getByRole("menu")).getAllByRole("menuitem")).toHaveLength(2);
  });
});
