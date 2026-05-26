import Link from "next/link";
import type { Metadata } from "next";
import { Clock, DollarSign, MapPin, TrendingUp } from "lucide-react";
import { Card, Container } from "@/components/ui";
import { getLeaderboards, type LeaderboardRow } from "@/lib/queries";
import { formatMonthsLong, formatUsd, pluralize } from "@/lib/format";

export const metadata: Metadata = {
  title: "Leaderboards",
  description:
    "The hardest watches to get: longest waits, biggest spend-to-qualify, and the most-reported references.",
};

function RankedList({
  rows,
  metric,
}: {
  rows: LeaderboardRow[];
  metric: (r: LeaderboardRow) => string;
}) {
  if (rows.length === 0) {
    return <p className="px-5 py-6 text-sm text-gray-500">Not enough data yet.</p>;
  }
  return (
    <ol className="divide-y divide-gray-100">
      {rows.map((r, i) => (
        <li key={r.model.slug}>
          <Link
            href={`/watch/${r.model.slug}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
          >
            <span className="w-5 shrink-0 text-sm font-semibold text-gray-400 nums">{i + 1}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">
                {r.model.brand} {r.model.model}
              </p>
              <p className="truncate text-xs text-gray-500 nums">
                {r.model.reference}
                {r.model.nickname ? ` · “${r.model.nickname}”` : ""}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-sm font-semibold text-ink nums">{metric(r)}</p>
              <p className="text-xs text-gray-400 nums">
                {r.count} {pluralize(r.count, "report")}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}

function Board({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-brand-600">{icon}</span>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
        </div>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      {children}
    </Card>
  );
}

export default async function LeaderboardsPage() {
  const { hardest, biggestSpend, mostData, byRegion } = await getLeaderboards();

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Leaderboards</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ranked across references with at least 3 reports.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Board
          title="Hardest to get"
          description="Longest median wait from list to call"
          icon={<Clock className="h-4 w-4" />}
        >
          <RankedList rows={hardest} metric={(r) => formatMonthsLong(r.medianWaitMonths)} />
        </Board>
        <Board
          title="Biggest spend to qualify"
          description="Highest median purchase history before the call"
          icon={<DollarSign className="h-4 w-4" />}
        >
          <RankedList rows={biggestSpend} metric={(r) => formatUsd(r.medianSpendUsd)} />
        </Board>
        <Board
          title="Most reported"
          description="References with the most datapoints"
          icon={<TrendingUp className="h-4 w-4" />}
        >
          <RankedList rows={mostData} metric={(r) => `${r.count}`} />
        </Board>
      </div>

      <div className="mt-4">
        <Board
          title="By region"
          description="Where the reports are coming from"
          icon={<MapPin className="h-4 w-4" />}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  <th className="px-5 py-3">Region</th>
                  <th className="px-5 py-3">Reports</th>
                  <th className="px-5 py-3">Median wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byRegion.map((r) => (
                  <tr key={r.region} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-ink">{r.region}</td>
                    <td className="px-5 py-3 text-gray-600 nums">{r.count}</td>
                    <td className="px-5 py-3 text-gray-600 nums">
                      {formatMonthsLong(r.medianWaitMonths)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Board>
      </div>
    </Container>
  );
}
