import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_layout/privacy")({
  head: () =>
    pageMeta({
      title: "Adlam Logistics | Privacy policy",
      description:
        "How Adlam Logistics handles the details you give us through request, quotation and invoice forms on this website.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

const sections: readonly LegalSection[] = [
  {
    id: "scope",
    title: "What this policy covers",
    paragraphs: [
      "This policy explains how Adlam Logistics handles information when you use this website. It applies to the pages on this site only. When you leave this site for WhatsApp, Google Maps or another service, that service's own privacy policy applies.",
    ],
  },
  {
    id: "information",
    title: "Information you give us",
    paragraphs: [
      "The website asks for details only where they are needed to prepare a delivery request, quotation or invoice. We do not ask for information that is not needed for that work.",
    ],
    bullets: [
      "Request forms: your name, company, phone number, pickup and delivery locations, urgency, service and cargo details.",
      "Quotation and invoice builders: customer name, number and address, order and VAT numbers, service, line items, dates, amounts, notes and the chosen signatory.",
      "Messages you choose to send us through WhatsApp.",
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    paragraphs: [
      "We use the details you provide to answer your enquiry, plan a delivery, prepare a quotation or invoice, and keep a record of the work. We do not sell your details or use them for advertising.",
    ],
  },
  {
    id: "sending",
    title: "Nothing is sent until you choose",
    paragraphs: [
      "Our request, quotation and invoice forms prepare the message in your browser. The website does not submit those forms to a server. You review the message, then open WhatsApp and press Send yourself. Printing and PDF downloads also happen on your device.",
      "After you press Send, the message is handled by WhatsApp and becomes part of the conversation between you and Adlam Logistics. You remain in control of what you send.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services",
    paragraphs: [
      "A few outside services help this site work. They may receive limited technical data when you use them:",
    ],
    bullets: [
      "Google Fonts loads the site fonts from Google. Google may receive your IP address and browser details for that request.",
      "WhatsApp links open wa.me. WhatsApp/Meta handles the message and any cookies on their site.",
      "The address link opens Google Maps. Google's privacy policy applies once you click it.",
      "Our hosting provider processes technical request data, such as IP address and browser type, to serve and secure the site.",
      "Inside the Lovable editor preview, runtime errors may be reported to the editor. This reporting hook is not part of the published public site.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep information",
    paragraphs: [
      "This website does not store your form entries. Once information is sent to us through WhatsApp, it may be kept in the chat and in our business records for as long as needed to handle the enquiry, deliver the service or meet legal and accounting requirements.",
      "If you want us to correct or delete information you sent us, contact us using the details below.",
    ],
  },
  {
    id: "choices",
    title: "Your choices and contact",
    paragraphs: [
      "You can choose not to fill in a form and contact us another way. You can also review or delete messages in WhatsApp, manage cookies in your browser, and block third-party fonts if you prefer.",
      "For questions about your information, WhatsApp us or visit our base at 1119 Rainham Park, Harare, Zimbabwe.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this page when the website or our practices change. The date at the top of the page will show when it was last updated.",
    ],
  },
];

function PrivacyPage() {
  return (
    <LegalPage
      labelSection="privacy"
      title="Privacy policy"
      intro="Your details are used to answer enquiries and prepare quotations and invoices. This page explains what happens to them."
      lastUpdated="27 November 2026"
      sections={sections}
      related={[
        { label: "Cookie policy", href: "/cookies" },
        { label: "Site map", href: "/site-map" },
      ]}
    />
  );
}
