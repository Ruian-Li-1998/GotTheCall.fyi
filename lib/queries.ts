import { cache } from "react";
import type {
  Datapoint,
  DealerType,
  ModelStats,
  Region,
  WatchModel,
} from "@/lib/types";
import { BRANDS, type SortValue } from "@/lib/constants";
import { computeStats, median } from "@/lib/stats";
import { slugify } from "@/lib/format";
import { SEED_MODELS } from "@/lib/seed/models";
import { SEED_DATAPOINTS } from "@/lib/seed/datapoints";
import { getReadClient, hasSupabaseConfig } from "@/lib/supabase/server";

export type DatapointFilters = {
  q?: string;
  brand?: string;
  dealer?: DealerType;
  region?: Region;
  client?: "yes" | "no";
  maxWait?: number;
  maxSpend?: number;
  sort?: SortValue;
};

export type LeaderboardRow = {
  model: WatchModel;
  count: number;
  medianWaitMonths: number | null;
  medianSpendUsd: number | null;
};

export type Leaderboards = {
  hardest: LeaderboardRow[];
  biggestSpend: LeaderboardRow[];
  mostData: LeaderboardRow[];
  byRegion: { region: Region; count: number; medianWaitMonths: number | null }[];
};

export type Overview = {
  totalDatapoints: number;
  modelsCovered: number;
  medianWaitMonths: number | null;
  hardest: LeaderboardRow | null;
};

/** One brand tile in the browse drill-down. */
export type BrandSummary = {
  brand: string;
  slug: string;
  /** distinct model lines (collections) under the brand */
  collectionCount: number;
  /** distinct references (watches) under the brand */
  watchCount: number;
  datapointCount: number;
  medianWaitMonths: number | null;
};

/** One collection (model line) tile within a brand. */
export type CollectionSummary = {
  brand: string;
  /** the model-line name, e.g. "Cosmograph Daytona" */
  model: string;
  /** slugify(model) */
  slug: string;
  watchCount: number;
  datapointCount: number;
  medianWaitMonths: number | null;
  medianSpendUsd: number | null;
};

/* ------------------------------------------------------------------ */
/* Loaders — Supabase when configured, otherwise the local seed data. */
/* ------------------------------------------------------------------ */

type Row = Record<string, unknown>;

function mapDatapoint(row: Row): Datapoint {
  return {
    id: String(row.id),
    modelSlug: (row.model_slug as string | null) ?? null,
    brand: String(row.brand ?? ""),
    model: String(row.model ?? ""),
    reference: String(row.reference ?? ""),
    nickname: (row.nickname as string | undefined) ?? undefined,
    waitMonths: Number(row.wait_months ?? 0),
    spendBeforeUsd: Number(row.spend_before_usd ?? 0),
    paidPriceUsd: row.paid_price_usd == null ? null : Number(row.paid_price_usd),
    dealerType: (row.dealer_type as DealerType) ?? "Other",
    dealerName: (row.dealer_name as string | null) ?? null,
    country: String(row.country ?? ""),
    city: (row.city as string | null) ?? null,
    region: (row.region as Region) ?? "Other",
    wasExistingClient: Boolean(row.was_existing_client),
    gotCallDate: String(row.got_call_date ?? ""),
    notes: (row.notes as string | null) ?? null,
    status: (row.status as Datapoint["status"]) ?? "approved",
    createdAt: String(row.created_at ?? ""),
  };
}

function mapModel(row: Row): WatchModel {
  return {
    id: String(row.id ?? row.slug),
    brand: String(row.brand ?? ""),
    model: String(row.model ?? ""),
    reference: String(row.reference ?? ""),
    nickname: (row.nickname as string | undefined) ?? undefined,
    slug: String(row.slug),
    retailPriceUsd: Number(row.retail_price_usd ?? 0),
    imageUrl: (row.image_url as string | undefined) ?? undefined,
  };
}

const loadAllDatapoints = cache(async (): Promise<Datapoint[]> => {
  const supabase = getReadClient();
  if (!supabase) return SEED_DATAPOINTS;
  const { data, error } = await supabase
    .from("datapoints")
    .select("*")
    .eq("status", "approved");
  if (error) {
    console.error("Supabase datapoints query failed, using seed data:", error.message);
    return SEED_DATAPOINTS;
  }
  return (data ?? []).map(mapDatapoint);
});

const loadAllModels = cache(async (): Promise<WatchModel[]> => {
  const supabase = getReadClient();
  if (!supabase) return SEED_MODELS;
  const { data, error } = await supabase.from("watch_models").select("*");
  if (error || !data || data.length === 0) {
    if (error) console.error("Supabase models query failed, using seed data:", error.message);
    return SEED_MODELS;
  }
  return data.map(mapModel);
});

/* ------------------------------------------------------------------ */
/* Filtering + sorting (single implementation for both data sources). */
/* ------------------------------------------------------------------ */

function applyFilters(rows: Datapoint[], f: DatapointFilters): Datapoint[] {
  let out = rows;
  if (f.brand) out = out.filter((d) => d.brand === f.brand);
  if (f.dealer) out = out.filter((d) => d.dealerType === f.dealer);
  if (f.region) out = out.filter((d) => d.region === f.region);
  if (f.client === "yes") out = out.filter((d) => d.wasExistingClient);
  if (f.client === "no") out = out.filter((d) => !d.wasExistingClient);
  if (f.maxWait != null) out = out.filter((d) => d.waitMonths <= f.maxWait!);
  if (f.maxSpend != null) out = out.filter((d) => d.spendBeforeUsd <= f.maxSpend!);
  if (f.q) {
    const q = f.q.toLowerCase();
    out = out.filter((d) =>
      [d.brand, d.model, d.reference, d.nickname, d.city, d.country, d.dealerName, d.notes]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }
  return out;
}

function sortDatapoints(rows: Datapoint[], sort: SortValue = "recent"): Datapoint[] {
  const out = [...rows];
  switch (sort) {
    case "wait-desc":
      return out.sort((a, b) => b.waitMonths - a.waitMonths);
    case "wait-asc":
      return out.sort((a, b) => a.waitMonths - b.waitMonths);
    case "spend-desc":
      return out.sort((a, b) => b.spendBeforeUsd - a.spendBeforeUsd);
    case "spend-asc":
      return out.sort((a, b) => a.spendBeforeUsd - b.spendBeforeUsd);
    case "recent":
    default:
      return out.sort((a, b) => (a.gotCallDate < b.gotCallDate ? 1 : -1));
  }
}

/* ------------------------------------------------------------------ */
/* Public query API                                                    */
/* ------------------------------------------------------------------ */

export async function getDatapoints(filters: DatapointFilters = {}): Promise<Datapoint[]> {
  const all = await loadAllDatapoints();
  return sortDatapoints(applyFilters(all, filters), filters.sort);
}

export async function getRecentDatapoints(limit = 8): Promise<Datapoint[]> {
  const all = await loadAllDatapoints();
  return sortDatapoints(all, "recent").slice(0, limit);
}

export async function getModels(): Promise<WatchModel[]> {
  const models = await loadAllModels();
  return [...models].sort((a, b) =>
    `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`),
  );
}

export async function getModelBySlug(slug: string): Promise<WatchModel | null> {
  const models = await loadAllModels();
  return models.find((m) => m.slug === slug) ?? null;
}

export async function getDatapointsForModel(slug: string): Promise<Datapoint[]> {
  const all = await loadAllDatapoints();
  return sortDatapoints(
    all.filter((d) => d.modelSlug === slug),
    "recent",
  );
}

export async function getModelStats(slug: string): Promise<ModelStats> {
  const rows = await getDatapointsForModel(slug);
  return computeStats(rows);
}

/* ---- Browse drill-down: brand → collection → watch ----------------- */

/** All brands with aggregate counts, ordered by the canonical BRANDS list. */
export async function getBrandSummaries(): Promise<BrandSummary[]> {
  const [models, datapoints] = await Promise.all([loadAllModels(), loadAllDatapoints()]);
  const bySlug = groupBySlug(datapoints);

  const byBrand = new Map<string, WatchModel[]>();
  for (const m of models) {
    const arr = byBrand.get(m.brand) ?? [];
    arr.push(m);
    byBrand.set(m.brand, arr);
  }

  const summaries: BrandSummary[] = [];
  for (const [brand, brandModels] of byBrand) {
    const collections = new Set(brandModels.map((m) => m.model));
    const waits: number[] = [];
    let datapointCount = 0;
    for (const m of brandModels) {
      const dps = bySlug.get(m.slug) ?? [];
      datapointCount += dps.length;
      for (const d of dps) waits.push(d.waitMonths);
    }
    summaries.push({
      brand,
      slug: slugify(brand),
      collectionCount: collections.size,
      watchCount: brandModels.length,
      datapointCount,
      medianWaitMonths: median(waits),
    });
  }

  const order = new Map<string, number>(BRANDS.map((b, i) => [b, i]));
  return summaries.sort(
    (a, b) =>
      (order.get(a.brand) ?? Infinity) - (order.get(b.brand) ?? Infinity) ||
      a.brand.localeCompare(b.brand),
  );
}

/** A brand and its collections (model lines), or null if the slug matches nothing. */
export async function getBrandDetail(
  brandSlug: string,
): Promise<{ brand: string; collections: CollectionSummary[] } | null> {
  const [models, datapoints] = await Promise.all([loadAllModels(), loadAllDatapoints()]);
  const brandModels = models.filter((m) => slugify(m.brand) === brandSlug);
  if (brandModels.length === 0) return null;
  const brand = brandModels[0].brand;
  const bySlug = groupBySlug(datapoints);

  const byModel = new Map<string, WatchModel[]>();
  for (const m of brandModels) {
    const arr = byModel.get(m.model) ?? [];
    arr.push(m);
    byModel.set(m.model, arr);
  }

  const collections: CollectionSummary[] = [];
  for (const [model, refs] of byModel) {
    const waits: number[] = [];
    const spends: number[] = [];
    let datapointCount = 0;
    for (const ref of refs) {
      const dps = bySlug.get(ref.slug) ?? [];
      datapointCount += dps.length;
      for (const d of dps) {
        waits.push(d.waitMonths);
        spends.push(d.spendBeforeUsd);
      }
    }
    collections.push({
      brand,
      model,
      slug: slugify(model),
      watchCount: refs.length,
      datapointCount,
      medianWaitMonths: median(waits),
      medianSpendUsd: median(spends),
    });
  }

  collections.sort((a, b) => b.watchCount - a.watchCount || a.model.localeCompare(b.model));
  return { brand, collections };
}

/** The watches (references) in one collection as LeaderboardRows, or null. */
export async function getCollectionDetail(
  brandSlug: string,
  collectionSlug: string,
): Promise<{ brand: string; collection: string; watches: LeaderboardRow[] } | null> {
  const [models, datapoints] = await Promise.all([loadAllModels(), loadAllDatapoints()]);
  const matches = models.filter(
    (m) => slugify(m.brand) === brandSlug && slugify(m.model) === collectionSlug,
  );
  if (matches.length === 0) return null;
  const bySlug = groupBySlug(datapoints);
  const watches = matches
    .map((m) => rowFor(m, bySlug.get(m.slug) ?? []))
    .sort(
      (a, b) =>
        b.count - a.count || a.model.reference.localeCompare(b.model.reference),
    );
  return { brand: matches[0].brand, collection: matches[0].model, watches };
}

/** Index datapoints by their model slug (skipping free-text "Other" entries). */
function groupBySlug(datapoints: Datapoint[]): Map<string, Datapoint[]> {
  const bySlug = new Map<string, Datapoint[]>();
  for (const d of datapoints) {
    if (!d.modelSlug) continue;
    const arr = bySlug.get(d.modelSlug) ?? [];
    arr.push(d);
    bySlug.set(d.modelSlug, arr);
  }
  return bySlug;
}

/** Aggregate one model's datapoints into a LeaderboardRow (no minimum count). */
function rowFor(model: WatchModel, dps: Datapoint[]): LeaderboardRow {
  return {
    model,
    count: dps.length,
    medianWaitMonths: median(dps.map((d) => d.waitMonths)),
    medianSpendUsd: median(dps.map((d) => d.spendBeforeUsd)),
  };
}

async function buildLeaderboardRows(minCount: number): Promise<LeaderboardRow[]> {
  const [models, datapoints] = await Promise.all([loadAllModels(), loadAllDatapoints()]);
  const bySlug = groupBySlug(datapoints);
  const rows: LeaderboardRow[] = [];
  for (const model of models) {
    const dps = bySlug.get(model.slug) ?? [];
    if (dps.length < minCount) continue;
    rows.push(rowFor(model, dps));
  }
  return rows;
}

export async function getLeaderboards(): Promise<Leaderboards> {
  const rows = await buildLeaderboardRows(3);
  const datapoints = await loadAllDatapoints();

  const hardest = [...rows]
    .sort((a, b) => (b.medianWaitMonths ?? 0) - (a.medianWaitMonths ?? 0))
    .slice(0, 12);
  const biggestSpend = [...rows]
    .sort((a, b) => (b.medianSpendUsd ?? 0) - (a.medianSpendUsd ?? 0))
    .slice(0, 12);
  const mostData = [...rows].sort((a, b) => b.count - a.count).slice(0, 12);

  const regionMap = new Map<Region, number[]>();
  const regionCount = new Map<Region, number>();
  for (const d of datapoints) {
    regionCount.set(d.region, (regionCount.get(d.region) ?? 0) + 1);
    const arr = regionMap.get(d.region) ?? [];
    arr.push(d.waitMonths);
    regionMap.set(d.region, arr);
  }
  const byRegion = [...regionCount.entries()]
    .map(([region, count]) => ({
      region,
      count,
      medianWaitMonths: median(regionMap.get(region) ?? []),
    }))
    .sort((a, b) => b.count - a.count);

  return { hardest, biggestSpend, mostData, byRegion };
}

export async function getOverview(): Promise<Overview> {
  const [datapoints, rows] = await Promise.all([
    loadAllDatapoints(),
    buildLeaderboardRows(3),
  ]);
  const modelsCovered = new Set(datapoints.map((d) => d.modelSlug).filter(Boolean)).size;
  const hardest = [...rows].sort(
    (a, b) => (b.medianWaitMonths ?? 0) - (a.medianWaitMonths ?? 0),
  )[0] ?? null;
  return {
    totalDatapoints: datapoints.length,
    modelsCovered,
    medianWaitMonths: median(datapoints.map((d) => d.waitMonths)),
    hardest,
  };
}

export { hasSupabaseConfig };
