import { createFileRoute } from "@tanstack/react-router";

import { LegalPage, type LegalSection } from "@/components/site/legal-page";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/_layout/cookies")({
  head: () =>
    pageMeta({
      title: "Adlam Logistics | Cookie policy",
      description:
        "What cookies and browser storage the Adlam Logistics website uses, and how third-party links may set their own cookies.",
      path: "/cookies",
    }),
  component: CookiesPage,
});

const sections: readonly LegalSection[] = [
  {
    id: "short-answer",
    title: "The short answer",
    paragraphs: [
      "This website does not use analytics, advertising or tracking cookies. It does not set its own cookies when you browse the public pages, fill in a request, or create a quotation or invoice.",
    ],
  },
  {
    id: "what-we-do-not-use",
    title: "What we do not use",
    paragraphs: [
      "We do not use Google Analytics, Meta Pixel, advertising networks, session-recording tools or cross-site trackers on this site.",
    ],
    bullets: [
      "No analytics cookies.",
      "No advertising or retargeting cookies.",
      "No cookie banner is needed because no non-essential cookies are set by this site.",
    ],
  },
  {
    id: "third-parties",
    title: "Third-party services and links",
    paragraphs: [
      "Some outside services are loaded or opened from this site. They may process technical data or set cookies under their own policies once they are used:",
    ],
    bullets: [
      "Google Fonts supplies the typefaces used on the site and may receive your IP address and browser details.",
      "WhatsApp links open wa.me. WhatsApp/Meta may set cookies on their own site after you click.",
      "The address link opens Google Maps. Google may set cookies on their own site after you click.",
      "Our hosting provider uses ordinary server logs to deliver and protect the site. These are not advertising cookies.",
    ],
  },
  {
    id: "browser-storage",
    title: "Browser storage and form data",
    paragraphs: [
      "The request, quotation and invoice forms keep what you type only in the current page. We do not write that information to localStorage or sessionStorage. Refreshing or closing the page clears it.",
      "PDF downloads and printing are created on your device. Nothing is uploaded by those actions.",
    ],
  },
  {
    id: "managing",
    title: "Managing cookies",
    paragraphs: [
      "You can block or delete cookies in your browser settings at any time. Blocking third-party cookies will not stop the main pages, forms or quotation and invoice tools from working.",
      "If you click through to WhatsApp or Google Maps, use those services' own settings to manage cookies there.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "If we add a service that uses cookies, we will update this page and the date at the top before or when it goes live.",
    ],
  },
];

function CookiesPage() {
  return (
    <LegalPage
      labelSection="cookies"
      title="Cookie policy"
      intro="A plain-language note on cookies, browser storage and the outside services linked from this website."
      lastUpdated="27 November 2026"
      sections={sections}
      related={[
        { label: "Privacy policy", href: "/privacy" },
        { label: "Site map", href: "/site-map" },
      ]}
    />
  );
}
