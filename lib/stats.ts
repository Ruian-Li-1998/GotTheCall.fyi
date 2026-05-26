import type { Bucket, Datapoint, ModelStats } from "@/lib/types";

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/** Linear-interpolated percentile, p in [0,1]. */
export function percentile(values: number[], p: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  if (sorted.length === 1) return sorted[0];
  const idx = p * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

export function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function bucketCounts(
  values: number[],
  buckets: Bucket[],
): { label: string; count: number }[] {
  const counts = buckets.map((b) => ({ label: b.label, count: 0 }));
  for (const v of values) {
    const i = buckets.findIndex((b) => v >= b.min && v < b.max);
    if (i >= 0) counts[i].count += 1;
  }
  return counts;
}

export function computeStats(datapoints: Datapoint[]): ModelStats {
  const waits = datapoints.map((d) => d.waitMonths);
  const spends = datapoints.map((d) => d.spendBeforeUsd);
  const existing = datapoints.filter((d) => d.wasExistingClient).length;
  return {
    count: datapoints.length,
    medianWaitMonths: median(waits),
    medianSpendUsd: median(spends),
    p25WaitMonths: percentile(waits, 0.25),
    p75WaitMonths: percentile(waits, 0.75),
    existingClientShare: datapoints.length ? existing / datapoints.length : null,
  };
}
