import type { Bucket, DealerType, Region } from "@/lib/types";

export const DEALER_TYPE_LABELS: Record<DealerType, string> = {
  AD: "Authorized Dealer",
  Boutique: "Boutique",
  Online: "Online",
  Other: "Other",
};

export const DEALER_TYPE_SHORT: Record<DealerType, string> = {
  AD: "AD",
  Boutique: "Boutique",
  Online: "Online",
  Other: "Other",
};

/** Brands we seed and surface in filters. */
export const BRANDS = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Omega",
  "Tudor",
  "Cartier",
  "Vacheron Constantin",
  "A. Lange & Söhne",
  "Richard Mille",
] as const;

/** Brand → primary domain, used to fetch brand logos from logo.dev (keys off domain). */
export const BRAND_DOMAINS: Record<string, string> = {
  Rolex: "rolex.com",
  "Patek Philippe": "patek.com",
  "Audemars Piguet": "audemarspiguet.com",
  Omega: "omegawatches.com",
  Tudor: "tudorwatch.com",
  Cartier: "cartier.com",
  "Vacheron Constantin": "vacheron-constantin.com",
  "A. Lange & Söhne": "alange-soehne.com",
  "Richard Mille": "richardmille.com",
};

/** Map of country -> region bucket, used to derive a region for filtering. */
export const COUNTRY_TO_REGION: Record<string, Region> = {
  "United States": "North America",
  Canada: "North America",
  Mexico: "Latin America",
  Brazil: "Latin America",
  "United Kingdom": "Europe",
  France: "Europe",
  Germany: "Europe",
  Switzerland: "Europe",
  Italy: "Europe",
  Spain: "Europe",
  Netherlands: "Europe",
  "United Arab Emirates": "Middle East",
  "Saudi Arabia": "Middle East",
  Qatar: "Middle East",
  Singapore: "Asia Pacific",
  "Hong Kong": "Asia Pacific",
  Japan: "Asia Pacific",
  China: "Asia Pacific",
  Australia: "Asia Pacific",
  "South Korea": "Asia Pacific",
  India: "Asia Pacific",
};

export function regionForCountry(country: string): Region {
  return COUNTRY_TO_REGION[country] ?? "Other";
}

export const WAIT_BUCKETS: Bucket[] = [
  { label: "0–6mo", min: 0, max: 6 },
  { label: "6–12mo", min: 6, max: 12 },
  { label: "1–2yr", min: 12, max: 24 },
  { label: "2–3yr", min: 24, max: 36 },
  { label: "3–4yr", min: 36, max: 48 },
  { label: "4yr+", min: 48, max: Infinity },
];

export const SPEND_BUCKETS: Bucket[] = [
  { label: "<$10k", min: 0, max: 10_000 },
  { label: "$10–25k", min: 10_000, max: 25_000 },
  { label: "$25–50k", min: 25_000, max: 50_000 },
  { label: "$50–100k", min: 50_000, max: 100_000 },
  { label: "$100–250k", min: 100_000, max: 250_000 },
  { label: "$250k+", min: 250_000, max: Infinity },
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Most recent" },
  { value: "wait-desc", label: "Longest wait" },
  { value: "wait-asc", label: "Shortest wait" },
  { value: "spend-desc", label: "Highest spend" },
  { value: "spend-asc", label: "Lowest spend" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export const MAX_WAIT_OPTIONS = [
  { value: "12", label: "Under 1 year" },
  { value: "24", label: "Under 2 years" },
  { value: "36", label: "Under 3 years" },
  { value: "48", label: "Under 4 years" },
];

export const MAX_SPEND_OPTIONS = [
  { value: "10000", label: "Under $10k" },
  { value: "25000", label: "Under $25k" },
  { value: "50000", label: "Under $50k" },
  { value: "100000", label: "Under $100k" },
];
