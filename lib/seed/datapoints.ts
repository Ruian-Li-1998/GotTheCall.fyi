import type { Datapoint, DealerType } from "@/lib/types";
import { regionForCountry } from "@/lib/constants";
import { SEED_MODELS_RICH, type GenParams } from "@/lib/seed/models";

/** Deterministic PRNG so generated sample data is stable across renders/builds. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normal(rand: () => number, mean: number, sd: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rand();
  while (v === 0) v = rand();
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return mean + z * sd;
}

const PLACES: { country: string; city: string; weight: number }[] = [
  { country: "United States", city: "New York", weight: 10 },
  { country: "United States", city: "Los Angeles", weight: 8 },
  { country: "United States", city: "Miami", weight: 6 },
  { country: "United States", city: "Chicago", weight: 5 },
  { country: "United States", city: "Dallas", weight: 4 },
  { country: "United Kingdom", city: "London", weight: 7 },
  { country: "Switzerland", city: "Geneva", weight: 3 },
  { country: "United Arab Emirates", city: "Dubai", weight: 5 },
  { country: "Singapore", city: "Singapore", weight: 5 },
  { country: "Hong Kong", city: "Hong Kong", weight: 4 },
  { country: "Japan", city: "Tokyo", weight: 4 },
  { country: "Germany", city: "Munich", weight: 3 },
  { country: "France", city: "Paris", weight: 3 },
  { country: "Canada", city: "Toronto", weight: 3 },
  { country: "Australia", city: "Sydney", weight: 3 },
  { country: "Italy", city: "Milan", weight: 2 },
  { country: "Qatar", city: "Doha", weight: 2 },
  { country: "South Korea", city: "Seoul", weight: 2 },
];
const PLACES_TOTAL = PLACES.reduce((s, p) => s + p.weight, 0);

function pickPlace(rand: () => number) {
  let r = rand() * PLACES_TOTAL;
  for (const p of PLACES) {
    if (r < p.weight) return p;
    r -= p.weight;
  }
  return PLACES[0];
}

function pickDealer(rand: () => number, bias: GenParams["dealerBias"]): DealerType {
  const r = rand();
  if (bias === "boutique") {
    if (r < 0.58) return "Boutique";
    if (r < 0.93) return "AD";
    if (r < 0.98) return "Online";
    return "Other";
  }
  if (r < 0.8) return "AD";
  if (r < 0.92) return "Boutique";
  if (r < 0.98) return "Online";
  return "Other";
}

const NOTES = [
  "Built history over a couple of years with watches and a bit of jewelry.",
  "Cold-walked in and was surprised they had it — no prior relationship.",
  "Bought a few entry pieces first, then expressed interest in this one.",
  "SA finally called after I'd nearly given up on the list.",
  "Picked it up alongside a wedding band purchase.",
  "Had to take a couple of pieces I didn't really want to qualify.",
  "Existing client, so the call came relatively quickly.",
  "Got lucky on a cancellation — no spend required.",
  "Relationship with the boutique manager made all the difference.",
  "Asked at several dealers; this one came through first.",
];

const START_MS = Date.parse("2022-01-01");
const END_MS = Date.parse("2025-05-01");

function generate(): Datapoint[] {
  const rand = mulberry32(20240525);
  const out: Datapoint[] = [];

  for (const model of SEED_MODELS_RICH) {
    const { gen } = model;
    for (let i = 0; i < gen.n; i++) {
      const waitMonths = Math.max(0, Math.min(84, Math.round(normal(rand, gen.waitMean, gen.waitSd))));
      const rawSpend = normal(rand, gen.spendMean, gen.spendSd);
      const spendBeforeUsd = Math.max(0, Math.round(rawSpend / 500) * 500);
      const place = pickPlace(rand);
      const dealerType = pickDealer(rand, gen.dealerBias);
      const wasExistingClient = rand() < gen.existingClientP;
      const callMs = START_MS + rand() * (END_MS - START_MS);
      const gotCallDate = new Date(callMs).toISOString().slice(0, 10);
      const createdAt = new Date(callMs + rand() * 25 * 86_400_000).toISOString();
      const hasNote = rand() < 0.55;

      out.push({
        id: `${model.slug}-${i + 1}`,
        modelSlug: model.slug,
        brand: model.brand,
        model: model.model,
        reference: model.reference,
        nickname: model.nickname,
        waitMonths,
        spendBeforeUsd,
        paidPriceUsd: model.retailPriceUsd,
        dealerType,
        dealerName: null,
        country: place.country,
        city: place.city,
        region: regionForCountry(place.country),
        wasExistingClient,
        gotCallDate,
        notes: hasNote ? NOTES[Math.floor(rand() * NOTES.length)] : null,
        status: "approved",
        createdAt,
      });
    }
  }

  return out;
}

export const SEED_DATAPOINTS: Datapoint[] = generate();
