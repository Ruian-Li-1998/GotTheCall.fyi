import Link from "next/link";
import { Watch } from "lucide-react";
import { Card } from "@/components/ui";
import type { LeaderboardRow } from "@/lib/queries";
import { formatMonthsLong, formatUsd, pluralize } from "@/lib/format";

export function ModelCard({ row }: { row: LeaderboardRow }) {
  const { model } = row;
  return (
    <Link href={`/watch/${model.slug}`} className="group">
      <Card className="flex h-full flex-col p-4 transition group-hover:border-brand-300 group-hover:shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Watch className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500">{model.brand}</p>
            <p className="truncate font-medium text-ink group-hover:text-brand-700">
              {model.model}
            </p>
            <p className="truncate text-xs text-gray-400 nums">
              {model.reference}
              {model.nickname ? ` · “${model.nickname}”` : ""}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Median wait</p>
            <p className="text-sm font-semibold text-ink nums">
              {formatMonthsLong(row.medianWaitMonths)}
            </p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wide text-gray-400">Median spend</p>
            <p className="text-sm font-semibold text-ink nums">{formatUsd(row.medianSpendUsd)}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-400 nums">
          {row.count} {pluralize(row.count, "report")}
        </p>
      </Card>
    </Link>
  );
}
