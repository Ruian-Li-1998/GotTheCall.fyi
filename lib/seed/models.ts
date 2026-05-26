import type { WatchModel } from "@/lib/types";

/** Parameters that drive realistic sample-datapoint generation per model. */
export type GenParams = {
  /** approx number of datapoints to generate */
  n: number;
  /** wait time distribution (months) */
  waitMean: number;
  waitSd: number;
  /** spend-to-qualify distribution (USD) */
  spendMean: number;
  spendSd: number;
  /** probability the buyer was already an existing client */
  existingClientP: number;
  /** dealer mix bias */
  dealerBias?: "ad" | "boutique";
};

type RichModel = WatchModel & { gen: GenParams };

const RICH: RichModel[] = [
  // ---------- Rolex ----------
  {
    id: "rolex-daytona-126500ln",
    slug: "rolex-daytona-126500ln",
    brand: "Rolex",
    model: "Cosmograph Daytona",
    reference: "126500LN",
    nickname: "Panda",
    retailPriceUsd: 15100,
    gen: { n: 9, waitMean: 44, waitSd: 14, spendMean: 110000, spendSd: 55000, existingClientP: 0.55, dealerBias: "ad" },
  },
  {
    id: "rolex-daytona-116500ln",
    slug: "rolex-daytona-116500ln",
    brand: "Rolex",
    model: "Cosmograph Daytona",
    reference: "116500LN",
    retailPriceUsd: 14550,
    gen: { n: 7, waitMean: 40, waitSd: 16, spendMean: 95000, spendSd: 50000, existingClientP: 0.5, dealerBias: "ad" },
  },
  {
    id: "rolex-gmt-master-ii-126710blro",
    slug: "rolex-gmt-master-ii-126710blro",
    brand: "Rolex",
    model: "GMT-Master II",
    reference: "126710BLRO",
    nickname: "Pepsi",
    retailPriceUsd: 11400,
    gen: { n: 9, waitMean: 30, waitSd: 12, spendMean: 55000, spendSd: 30000, existingClientP: 0.42, dealerBias: "ad" },
  },
  {
    id: "rolex-gmt-master-ii-126710blnr",
    slug: "rolex-gmt-master-ii-126710blnr",
    brand: "Rolex",
    model: "GMT-Master II",
    reference: "126710BLNR",
    nickname: "Batman",
    retailPriceUsd: 10900,
    gen: { n: 8, waitMean: 26, waitSd: 11, spendMean: 48000, spendSd: 26000, existingClientP: 0.4, dealerBias: "ad" },
  },
  {
    id: "rolex-gmt-master-ii-126720vtnr",
    slug: "rolex-gmt-master-ii-126720vtnr",
    brand: "Rolex",
    model: "GMT-Master II",
    reference: "126720VTNR",
    nickname: "Sprite",
    retailPriceUsd: 11700,
    gen: { n: 7, waitMean: 34, waitSd: 13, spendMean: 62000, spendSd: 32000, existingClientP: 0.45, dealerBias: "ad" },
  },
  {
    id: "rolex-submariner-126610ln",
    slug: "rolex-submariner-126610ln",
    brand: "Rolex",
    model: "Submariner Date",
    reference: "126610LN",
    retailPriceUsd: 10250,
    gen: { n: 9, waitMean: 18, waitSd: 10, spendMean: 28000, spendSd: 18000, existingClientP: 0.32, dealerBias: "ad" },
  },
  {
    id: "rolex-submariner-126610lv",
    slug: "rolex-submariner-126610lv",
    brand: "Rolex",
    model: "Submariner Date",
    reference: "126610LV",
    nickname: "Starbucks",
    retailPriceUsd: 11350,
    gen: { n: 8, waitMean: 30, waitSd: 12, spendMean: 52000, spendSd: 28000, existingClientP: 0.44, dealerBias: "ad" },
  },
  {
    id: "rolex-submariner-124060",
    slug: "rolex-submariner-124060",
    brand: "Rolex",
    model: "Submariner (No Date)",
    reference: "124060",
    retailPriceUsd: 9150,
    gen: { n: 7, waitMean: 14, waitSd: 9, spendMean: 18000, spendSd: 14000, existingClientP: 0.28, dealerBias: "ad" },
  },
  {
    id: "rolex-sky-dweller-336934",
    slug: "rolex-sky-dweller-336934",
    brand: "Rolex",
    model: "Sky-Dweller",
    reference: "336934",
    retailPriceUsd: 15500,
    gen: { n: 6, waitMean: 22, waitSd: 11, spendMean: 42000, spendSd: 26000, existingClientP: 0.4, dealerBias: "ad" },
  },
  {
    id: "rolex-sea-dweller-126600",
    slug: "rolex-sea-dweller-126600",
    brand: "Rolex",
    model: "Sea-Dweller",
    reference: "126600",
    retailPriceUsd: 13650,
    gen: { n: 5, waitMean: 16, waitSd: 9, spendMean: 24000, spendSd: 16000, existingClientP: 0.3, dealerBias: "ad" },
  },
  {
    id: "rolex-explorer-ii-226570",
    slug: "rolex-explorer-ii-226570",
    brand: "Rolex",
    model: "Explorer II",
    reference: "226570",
    retailPriceUsd: 9650,
    gen: { n: 5, waitMean: 12, waitSd: 8, spendMean: 14000, spendSd: 12000, existingClientP: 0.24, dealerBias: "ad" },
  },
  {
    id: "rolex-oyster-perpetual-124300-turquoise",
    slug: "rolex-oyster-perpetual-124300-turquoise",
    brand: "Rolex",
    model: "Oyster Perpetual 41",
    reference: "124300",
    nickname: "Tiffany",
    retailPriceUsd: 6400,
    gen: { n: 7, waitMean: 28, waitSd: 13, spendMean: 36000, spendSd: 22000, existingClientP: 0.4, dealerBias: "ad" },
  },
  {
    id: "rolex-datejust-41-126334",
    slug: "rolex-datejust-41-126334",
    brand: "Rolex",
    model: "Datejust 41",
    reference: "126334",
    retailPriceUsd: 10700,
    gen: { n: 5, waitMean: 6, waitSd: 5, spendMean: 7000, spendSd: 8000, existingClientP: 0.18, dealerBias: "ad" },
  },
  {
    id: "rolex-explorer-124270",
    slug: "rolex-explorer-124270",
    brand: "Rolex",
    model: "Explorer 36",
    reference: "124270",
    retailPriceUsd: 7250,
    gen: { n: 5, waitMean: 8, waitSd: 6, spendMean: 9000, spendSd: 9000, existingClientP: 0.2, dealerBias: "ad" },
  },

  // ---------- Patek Philippe ----------
  {
    id: "patek-philippe-nautilus-5711-1a-014",
    slug: "patek-philippe-nautilus-5711-1a-014",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5711/1A-014",
    nickname: "Green dial",
    retailPriceUsd: 35000,
    gen: { n: 6, waitMean: 54, waitSd: 16, spendMean: 240000, spendSd: 90000, existingClientP: 0.7, dealerBias: "boutique" },
  },
  {
    id: "patek-philippe-nautilus-5811-1g",
    slug: "patek-philippe-nautilus-5811-1g",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5811/1G",
    retailPriceUsd: 71200,
    gen: { n: 5, waitMean: 46, waitSd: 16, spendMean: 200000, spendSd: 90000, existingClientP: 0.66, dealerBias: "boutique" },
  },
  {
    id: "patek-philippe-nautilus-5712-1a",
    slug: "patek-philippe-nautilus-5712-1a",
    brand: "Patek Philippe",
    model: "Nautilus",
    reference: "5712/1A",
    retailPriceUsd: 39000,
    gen: { n: 5, waitMean: 44, waitSd: 15, spendMean: 175000, spendSd: 80000, existingClientP: 0.64, dealerBias: "boutique" },
  },
  {
    id: "patek-philippe-aquanaut-5167a",
    slug: "patek-philippe-aquanaut-5167a",
    brand: "Patek Philippe",
    model: "Aquanaut",
    reference: "5167A",
    retailPriceUsd: 23000,
    gen: { n: 6, waitMean: 38, waitSd: 15, spendMean: 130000, spendSd: 70000, existingClientP: 0.6, dealerBias: "boutique" },
  },
  {
    id: "patek-philippe-aquanaut-5168g",
    slug: "patek-philippe-aquanaut-5168g",
    brand: "Patek Philippe",
    model: "Aquanaut Jumbo",
    reference: "5168G",
    retailPriceUsd: 45000,
    gen: { n: 4, waitMean: 40, waitSd: 16, spendMean: 150000, spendSd: 80000, existingClientP: 0.62, dealerBias: "boutique" },
  },
  {
    id: "patek-philippe-calatrava-6119r",
    slug: "patek-philippe-calatrava-6119r",
    brand: "Patek Philippe",
    model: "Calatrava",
    reference: "6119R",
    retailPriceUsd: 37000,
    gen: { n: 4, waitMean: 14, waitSd: 10, spendMean: 45000, spendSd: 40000, existingClientP: 0.45, dealerBias: "boutique" },
  },

  // ---------- Audemars Piguet ----------
  {
    id: "audemars-piguet-royal-oak-15500st",
    slug: "audemars-piguet-royal-oak-15500st",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    reference: "15500ST",
    retailPriceUsd: 36000,
    gen: { n: 8, waitMean: 34, waitSd: 14, spendMean: 120000, spendSd: 70000, existingClientP: 0.58, dealerBias: "boutique" },
  },
  {
    id: "audemars-piguet-royal-oak-15510st",
    slug: "audemars-piguet-royal-oak-15510st",
    brand: "Audemars Piguet",
    model: "Royal Oak",
    reference: "15510ST",
    retailPriceUsd: 36400,
    gen: { n: 7, waitMean: 32, waitSd: 14, spendMean: 115000, spendSd: 65000, existingClientP: 0.57, dealerBias: "boutique" },
  },
  {
    id: "audemars-piguet-royal-oak-16202st",
    slug: "audemars-piguet-royal-oak-16202st",
    brand: "Audemars Piguet",
    model: "Royal Oak Jumbo 50th",
    reference: "16202ST",
    nickname: "Jumbo",
    retailPriceUsd: 67000,
    gen: { n: 5, waitMean: 50, waitSd: 16, spendMean: 220000, spendSd: 90000, existingClientP: 0.72, dealerBias: "boutique" },
  },
  {
    id: "audemars-piguet-royal-oak-chrono-26240st",
    slug: "audemars-piguet-royal-oak-chrono-26240st",
    brand: "Audemars Piguet",
    model: "Royal Oak Chronograph",
    reference: "26240ST",
    retailPriceUsd: 55000,
    gen: { n: 6, waitMean: 40, waitSd: 15, spendMean: 160000, spendSd: 80000, existingClientP: 0.64, dealerBias: "boutique" },
  },
  {
    id: "audemars-piguet-royal-oak-offshore-15720st",
    slug: "audemars-piguet-royal-oak-offshore-15720st",
    brand: "Audemars Piguet",
    model: "Royal Oak Offshore",
    reference: "15720ST",
    retailPriceUsd: 45000,
    gen: { n: 5, waitMean: 30, waitSd: 14, spendMean: 95000, spendSd: 60000, existingClientP: 0.55, dealerBias: "boutique" },
  },

  // ---------- Omega ----------
  {
    id: "omega-speedmaster-moonwatch-31030",
    slug: "omega-speedmaster-moonwatch-31030",
    brand: "Omega",
    model: "Speedmaster Moonwatch Professional",
    reference: "310.30.42",
    retailPriceUsd: 7000,
    gen: { n: 6, waitMean: 1, waitSd: 2, spendMean: 0, spendSd: 1500, existingClientP: 0.08, dealerBias: "ad" },
  },
  {
    id: "omega-seamaster-diver-300m-21030",
    slug: "omega-seamaster-diver-300m-21030",
    brand: "Omega",
    model: "Seamaster Diver 300M",
    reference: "210.30.42",
    retailPriceUsd: 6000,
    gen: { n: 5, waitMean: 1, waitSd: 2, spendMean: 0, spendSd: 1200, existingClientP: 0.06, dealerBias: "ad" },
  },
  {
    id: "omega-speedmaster-snoopy-50th",
    slug: "omega-speedmaster-snoopy-50th",
    brand: "Omega",
    model: "Speedmaster Silver Snoopy Award 50th",
    reference: "310.32.42",
    nickname: "Snoopy",
    retailPriceUsd: 10500,
    gen: { n: 6, waitMean: 18, waitSd: 12, spendMean: 12000, spendSd: 12000, existingClientP: 0.3, dealerBias: "boutique" },
  },

  // ---------- Tudor ----------
  {
    id: "tudor-black-bay-58-79030n",
    slug: "tudor-black-bay-58-79030n",
    brand: "Tudor",
    model: "Black Bay 58",
    reference: "79030N",
    retailPriceUsd: 3950,
    gen: { n: 5, waitMean: 1, waitSd: 2, spendMean: 0, spendSd: 800, existingClientP: 0.05, dealerBias: "ad" },
  },
  {
    id: "tudor-black-bay-gmt-79830rb",
    slug: "tudor-black-bay-gmt-79830rb",
    brand: "Tudor",
    model: "Black Bay GMT",
    reference: "79830RB",
    nickname: "Pepsi",
    retailPriceUsd: 4375,
    gen: { n: 5, waitMean: 4, waitSd: 4, spendMean: 1500, spendSd: 3000, existingClientP: 0.12, dealerBias: "ad" },
  },
  {
    id: "tudor-pelagos-39-m25407n",
    slug: "tudor-pelagos-39-m25407n",
    brand: "Tudor",
    model: "Pelagos 39",
    reference: "M25407N",
    retailPriceUsd: 4400,
    gen: { n: 4, waitMean: 3, waitSd: 4, spendMean: 1000, spendSd: 2500, existingClientP: 0.1, dealerBias: "ad" },
  },

  // ---------- Cartier ----------
  {
    id: "cartier-santos-medium-wssa0029",
    slug: "cartier-santos-medium-wssa0029",
    brand: "Cartier",
    model: "Santos de Cartier (Medium)",
    reference: "WSSA0029",
    retailPriceUsd: 7650,
    gen: { n: 5, waitMean: 5, waitSd: 5, spendMean: 3000, spendSd: 6000, existingClientP: 0.2, dealerBias: "boutique" },
  },
  {
    id: "cartier-tank-must-large",
    slug: "cartier-tank-must-large",
    brand: "Cartier",
    model: "Tank Must (Large)",
    reference: "WSTA0053",
    retailPriceUsd: 3400,
    gen: { n: 4, waitMean: 1, waitSd: 2, spendMean: 0, spendSd: 1500, existingClientP: 0.1, dealerBias: "boutique" },
  },

  // ---------- Vacheron Constantin ----------
  {
    id: "vacheron-constantin-overseas-4500v",
    slug: "vacheron-constantin-overseas-4500v",
    brand: "Vacheron Constantin",
    model: "Overseas",
    reference: "4500V",
    retailPriceUsd: 24500,
    gen: { n: 5, waitMean: 30, waitSd: 14, spendMean: 80000, spendSd: 55000, existingClientP: 0.55, dealerBias: "boutique" },
  },

  // ---------- A. Lange & Söhne ----------
  {
    id: "a-lange-sohne-odysseus-363179",
    slug: "a-lange-sohne-odysseus-363179",
    brand: "A. Lange & Söhne",
    model: "Odysseus",
    reference: "363.179",
    retailPriceUsd: 36000,
    gen: { n: 4, waitMean: 48, waitSd: 16, spendMean: 170000, spendSd: 90000, existingClientP: 0.68, dealerBias: "boutique" },
  },
  {
    id: "a-lange-sohne-lange-1-191032",
    slug: "a-lange-sohne-lange-1-191032",
    brand: "A. Lange & Söhne",
    model: "Lange 1",
    reference: "191.032",
    retailPriceUsd: 44000,
    gen: { n: 4, waitMean: 16, waitSd: 12, spendMean: 50000, spendSd: 45000, existingClientP: 0.5, dealerBias: "boutique" },
  },

  // ---------- Richard Mille ----------
  {
    id: "richard-mille-rm-72-01",
    slug: "richard-mille-rm-72-01",
    brand: "Richard Mille",
    model: "RM 72-01",
    reference: "RM 72-01",
    retailPriceUsd: 200000,
    gen: { n: 5, waitMean: 30, waitSd: 16, spendMean: 600000, spendSd: 300000, existingClientP: 0.78, dealerBias: "boutique" },
  },
  {
    id: "richard-mille-rm-35-03",
    slug: "richard-mille-rm-35-03",
    brand: "Richard Mille",
    model: "RM 35-03",
    reference: "RM 35-03",
    retailPriceUsd: 230000,
    gen: { n: 4, waitMean: 28, waitSd: 16, spendMean: 650000, spendSd: 320000, existingClientP: 0.8, dealerBias: "boutique" },
  },
];

export const SEED_MODELS_RICH = RICH;

export const SEED_MODELS: WatchModel[] = RICH.map((m): WatchModel => ({
  id: m.id,
  brand: m.brand,
  model: m.model,
  reference: m.reference,
  nickname: m.nickname,
  slug: m.slug,
  retailPriceUsd: m.retailPriceUsd,
  imageUrl: m.imageUrl,
}));
