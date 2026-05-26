export function formatUsd(n: number | null | undefined): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Compact money for big stat numbers: $120k, $1.2M */
export function formatUsdCompact(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    return `$${Math.round(n / 1_000)}k`;
  }
  return `$${n}`;
}

/** "30 mo" */
export function formatMonths(n: number | null | undefined): string {
  if (n == null) return "—";
  if (n < 1) return "<1 mo";
  return `${Math.round(n)} mo`;
}

/** "2y 6m" / "8 mo" — friendlier long form */
export function formatMonthsLong(n: number | null | undefined): string {
  if (n == null) return "—";
  const months = Math.round(n);
  if (months < 12) return `${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  return rem === 0 ? `${years}y` : `${years}y ${rem}m`;
}

/** "May 2024" */
export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/** "May 12, 2024" */
export function formatDateFull(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}
