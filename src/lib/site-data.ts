export const brand = {
  name: "Adlam Logistics",
  address: "1119 Rainham Park, Harare, Zimbabwe",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=1119%20Rainham%20Park%2C%20Harare%2C%20Zimbabwe",
  motto: "Titumeyi || Tinoenda\nTinosvika || Tinodzoka",
  poweredBy: "Swutchtabs",
} as const;

export const navigation = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Fleet", to: "/fleet" },
  { label: "Network", to: "/network" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export type NavigationHref = (typeof navigation)[number]["to"];

export const whatsappNumbers = [
  { label: "0772 246 166", dial: "263772246166" },
  { label: "0772 268 185", dial: "263772268185" },
] as const;

export const deliveryEnquiryMessage =
  "Hello Adlam Logistics, I would like to ask about a delivery.";

export const ctaLabels = {
  addLine: { shona: "Wedzera Mutsetse", english: "Add line" },
  askAboutService: { shona: "Bvunzai Basa", english: "Ask about a service" },
  askAboutVehicle: { shona: "Bvunzai Motokari", english: "Ask about a vehicle" },
  downloadQuotation: { shona: "Tora Chirevo", english: "Download quotation" },
  downloadReceipt: { shona: "Tora Risiti", english: "Download receipt" },
  editRequest: { shona: "Gadzirisa Chikumbiro", english: "Edit request" },
  exploreFreight: { shona: "Tarirai Kutakura", english: "Explore freight" },
  exploreGrain: { shona: "Tarirai Zviyo", english: "Explore grain" },
  exploreProcurement: { shona: "Tarirai Zvinobva China", english: "Explore procurement" },
  getInTouch: { shona: "Tumirai Zvamunoda", english: "Get in touch" },
  newQuotation: { shona: "Chirevo Chitsva", english: "New quotation" },
  newReceipt: { shona: "Risiti Idzva", english: "New receipt" },
  planMove: { shona: "Rongai Rwendo", english: "Plan the move" },
  printQuotation: { shona: "Dhinda Chirevo", english: "Print quotation" },
  printReceipt: { shona: "Dhinda Risiti", english: "Print receipt" },
  removeLine: { shona: "Bvisa Mutsetse", english: "Remove line" },
  reviewRequest: { shona: "Ona Chikumbiro", english: "Review request" },
  seeFleet: { shona: "Tarirai Motokari", english: "View the fleet" },
  seeServices: { shona: "Tarirai Zvatinoita", english: "See what we do" },
  sendDetails: { shona: "Tumirai Zvamunoda", english: "Send the details" },
  sendToWhatsapp: { shona: "Tumirai paWhatsApp", english: "Send on WhatsApp" },
  serviceDetails: { shona: "Tarirai Zvatinoita", english: "Service details" },
  startRequest: { shona: "Tangai Chikumbiro", english: "Start a request" },
  whatsappUs: { shona: "Taurai nesu", english: "WhatsApp us" },
} as const;

export type CtaKey = keyof typeof ctaLabels;

export const sectionLabels = {
  chinaToZimbabwe: { shona: "Kubva China kuZimbabwe", english: "China to Zimbabwe" },
  cookies: { shona: "Makeki", english: "Cookies" },
  corridor: { shona: "Nzira yekufamba", english: "The corridor" },
  documents: { shona: "Marisiti nezvirevo", english: "Receipts and quotations" },
  legal: { shona: "Mutemo", english: "Legal" },
  lineItems: { shona: "Mitsetse yerisiti", english: "Receipt lines" },
  ourBase: { shona: "Nzvimbo yedu", english: "Our base" },
  privacy: { shona: "Zvakavanzika", english: "Privacy" },
  ourFleet: { shona: "Motokari dzedu", english: "The fleet" },
  ourMotto: { shona: "Motto yedu", english: "Our motto" },
  ourServices: { shona: "Zvatinoita", english: "Our services" },
  quoteRequest: { shona: "Chikumbiro chemutengo", english: "Quote request" },
  quotationActions: { shona: "Zvekuita nechirevo", english: "Quotation actions" },
  quotationLines: { shona: "Mitsetse yechirevo", english: "Quotation lines" },
  quotationDetails: { shona: "Ruzivo rwechirevo", english: "Quotation details" },
  quotations: { shona: "Zvirevo zvemutengo", english: "Quotations" },
  receiptActions: { shona: "Zvekuita nerisiti", english: "Receipt actions" },
  receiptDetails: { shona: "Ruzivo rwerisiti", english: "Receipt details" },
  receipts: { shona: "Marisiti", english: "Receipts" },
  requestPreview: { shona: "Ona chikumbiro", english: "Request preview" },
  siteMap: { shona: "Mepu yesaiti", english: "Site map" },
} as const;

export type SectionLabelKey = keyof typeof sectionLabels;

export const proofFacts = [
  { value: "Five", label: "Real vehicle types" },
  { value: "Three", label: "Services from one base" },
  { value: "Harare", label: "Rainham Park base" },
  { value: "Door", label: "Company or home" },
] as const;

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly detail: string;
  readonly points: readonly string[];
}

export const localFreightService: Service = {
  id: "local-freight",
  title: "Local freight and distribution",
  summary: "Local freight and distribution with our fleet, across Harare and beyond.",
  detail:
    "We use the skuta 3-wheel, twin cab and side-curtain trucks for local freight and distribution. Tell us the pickup, delivery and cargo, and we will match the vehicle to the job.",
  points: [
    "Harare and beyond",
    "Skuta 3-wheel, twin cab and side-curtain trucks",
    "Pickup and delivery arranged around your load",
  ],
};

export const grainSupplyService: Service = {
  id: "grain-supply",
  title: "Grain supply",
  summary: "Grain supply, delivered with our fleet.",
  detail:
    "We supply grain and deliver it with our fleet. Send the quantity and delivery point, and we will return the supply and delivery plan.",
  points: ["Grain supply", "Delivery with our fleet", "Send quantity and delivery point"],
};

export const chinaProcurementService: Service = {
  id: "china-procurement",
  title: "Procurement from China",
  summary: "Procurement from China, then door-to-door delivery to your company or home.",
  detail:
    "We procure goods in China and handle the move to Zimbabwe. Delivery ends at your company or home.",
  points: ["Procurement in China", "Door-to-door delivery", "Your company or home"],
};

export const services: readonly Service[] = [
  localFreightService,
  grainSupplyService,
  chinaProcurementService,
];

export interface ServiceSpec {
  readonly id: string;
  readonly service: string;
  readonly covers: string;
  readonly ends: string;
}

export const serviceSpecs: readonly ServiceSpec[] = [
  {
    id: "local-freight",
    service: "Local freight and distribution",
    covers: "Pickup and distribution with our fleet",
    ends: "Harare and beyond",
  },
  {
    id: "grain-supply",
    service: "Grain supply",
    covers: "Grain supply and delivery",
    ends: "Your delivery point",
  },
  {
    id: "china-procurement",
    service: "Procurement from China",
    covers: "Sourcing and the move to Zimbabwe",
    ends: "Your company or home",
  },
];

export interface FleetVehicle {
  readonly id: string;
  readonly name: string;
  readonly measure: string;
  readonly label: string;
}

export const sideCurtainTrucks: readonly FleetVehicle[] = [
  { id: "5t-side-curtain", name: "5-tonne side-curtain", measure: "5t", label: "Payload" },
  { id: "7t-side-curtain", name: "7-tonne side-curtain", measure: "7t", label: "Payload" },
  { id: "10t-side-curtain", name: "10-tonne side-curtain", measure: "10t", label: "Payload" },
];

export const supportVehicles: readonly FleetVehicle[] = [
  { id: "skuta-3-wheel", name: "skuta 3-wheel", measure: "3-wheel", label: "Configuration" },
  { id: "twin-cab", name: "twin cab", measure: "twin cab", label: "Configuration" },
];

export const fleetVehicles: readonly FleetVehicle[] = [...sideCurtainTrucks, ...supportVehicles];

export const chinaProcurementSpecs = [
  { label: "Starts", value: "Procurement in China" },
  { label: "Handled", value: "The move to Zimbabwe" },
  { label: "Ends", value: "Your company or home" },
] as const;

export const chinaSteps = [
  { title: "Source", description: "We procure the goods in China." },
  { title: "Move", description: "We arrange the move to Zimbabwe." },
  { title: "Harare", description: "Our base is at 1119 Rainham Park, Harare." },
  { title: "Door", description: "Delivery ends at your company or home." },
] as const;

export interface Faq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export const faqs: readonly Faq[] = [
  {
    id: "deliver-to-home",
    question: "Can you deliver to my home?",
    answer:
      "Yes. Procurement from China is door-to-door to your company or home. For local freight, send the pickup and delivery points.",
  },
  {
    id: "grain",
    question: "Can you supply grain?",
    answer:
      "Yes. Send the quantity and delivery point and we will return a supply and delivery plan.",
  },
  {
    id: "china",
    question: "How does China procurement work?",
    answer:
      "We source the goods in China, arrange the move to Zimbabwe and deliver to your company or home. The quotation will set out what we need from you.",
  },
];
