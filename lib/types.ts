export const DEALER_TYPES = ["AD", "Boutique", "Online", "Other"] as const;
export type DealerType = (typeof DEALER_TYPES)[number];

export const REGIONS = [
  "North America",
  "Europe",
  "Middle East",
  "Asia Pacific",
  "Latin America",
  "Other",
] as const;
export type Region = (typeof REGIONS)[number];

export type WatchModel = {
  /** stable id (same as slug) */
  id: string;
  brand: string;
  model: string;
  reference: string;
  nickname?: string;
  slug: string;
  retailPriceUsd: number;
  imageUrl?: string;
};

export type Datapoint = {
  id: string;
  /** FK to WatchModel.slug, or null for a free-text "Other" entry */
  modelSlug: string | null;
  brand: string;
  model: string;
  reference: string;
  nickname?: string;
  /** months from joining the list / expressing interest to getting the call */
  waitMonths: number;
  /** purchase history (spend on other pieces) before getting the call, USD */
  spendBeforeUsd: number;
  /** what they actually paid for the target watch, USD (usually retail) */
  paidPriceUsd: number | null;
  dealerType: DealerType;
  dealerName: string | null;
  country: string;
  city: string | null;
  region: Region;
  wasExistingClient: boolean;
  /** ISO date (yyyy-mm-dd) of the call */
  gotCallDate: string;
  notes: string | null;
  status: "approved" | "pending";
  /** ISO datetime */
  createdAt: string;
};

export type ModelStats = {
  count: number;
  medianWaitMonths: number | null;
  medianSpendUsd: number | null;
  p25WaitMonths: number | null;
  p75WaitMonths: number | null;
  /** share of datapoints that were existing clients, 0..1 */
  existingClientShare: number | null;
};

export type Bucket = { label: string; min: number; max: number };
