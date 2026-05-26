import Link from "next/link";
import { Check } from "lucide-react";
import type { Datapoint } from "@/lib/types";
import { Badge } from "@/components/ui";
import { DEALER_TYPE_SHORT } from "@/lib/constants";
import { formatMonthsLong, formatMonthYear, formatUsd } from "@/lib/format";

function WatchName({ d }: { d: Datapoint }) {
  const label = `${d.brand} ${d.model}`;
  const inner = (
    <div className="flex flex-col">
      <span className="font-medium text-ink">{label}</span>
      <span className="text-xs text-gray-500">
        {d.reference}
        {d.nickname ? ` · “${d.nickname}”` : ""}
      </span>
    </div>
  );
  if (d.modelSlug) {
    return (
      <Link href={`/watch/${d.modelSlug}`} className="hover:text-brand-700">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function DatapointTable({
  datapoints,
  showWatch = true,
}: {
  datapoints: Datapoint[];
  showWatch?: boolean;
}) {
  if (datapoints.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center">
        <p className="text-sm font-medium text-ink">No datapoints match these filters.</p>
        <p className="mt-1 text-sm text-gray-500">Try clearing a filter or broadening your search.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            {showWatch && <th className="px-4 py-3">Watch</th>}
            <th className="px-4 py-3">Wait</th>
            <th className="px-4 py-3">Spend to qualify</th>
            <th className="px-4 py-3">Dealer</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3">Got the call</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {datapoints.map((d) => (
            <tr key={d.id} className="align-top hover:bg-gray-50/70">
              {showWatch && (
                <td className="px-4 py-3">
                  <WatchName d={d} />
                </td>
              )}
              <td className="px-4 py-3 nums font-medium text-ink">
                {formatMonthsLong(d.waitMonths)}
              </td>
              <td className="px-4 py-3 nums text-ink">{formatUsd(d.spendBeforeUsd)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="outline">{DEALER_TYPE_SHORT[d.dealerType]}</Badge>
                  {d.wasExistingClient && (
                    <span className="inline-flex items-center gap-0.5 text-xs text-brand-700">
                      <Check className="h-3 w-3" /> client
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {d.city ? `${d.city}, ` : ""}
                {d.country}
              </td>
              <td className="px-4 py-3 nums whitespace-nowrap text-gray-600">
                {formatMonthYear(d.gotCallDate)}
              </td>
              <td className="max-w-[260px] px-4 py-3 text-gray-500">
                {d.notes ? (
                  <span className="line-clamp-2" title={d.notes}>
                    {d.notes}
                  </span>
                ) : (
                  <span className="text-gray-300">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
