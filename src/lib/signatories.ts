export interface Signatory {
  readonly id: string;
  readonly name: string;
  readonly signatureSrc: string;
  readonly width: number;
  readonly height: number;
}

export const signatories = [
  {
    id: "elolaam-chitsa",
    name: "Elolaam Chitsa",
    signatureSrc: "/WhatsApp%20Image%202026-11-27%20at%2019.13.28.jpeg",
    width: 1280,
    height: 484,
  },
  {
    id: "samantha-chitsa",
    name: "Samantha Chitsa",
    signatureSrc: "/WhatsApp%20Image%202026-11-27%20at%2019.18.53.jpeg",
    width: 1080,
    height: 700,
  },
  {
    id: "harris-chitsa",
    name: "Harris Chitsa",
    signatureSrc: "/WhatsApp%20Image%202026-11-27%20at%2019.19.07.jpeg",
    width: 1080,
    height: 852,
  },
] as const satisfies readonly Signatory[];

export type SignatoryId = (typeof signatories)[number]["id"];

export const signatoryIds = signatories.map((signatory) => signatory.id) as [
  SignatoryId,
  ...SignatoryId[],
];

export const DEFAULT_SIGNATORY_ID: SignatoryId = signatories[0].id;

export function getSignatory(id: string | undefined | null): Signatory {
  return signatories.find((signatory) => signatory.id === id) ?? signatories[0];
}
