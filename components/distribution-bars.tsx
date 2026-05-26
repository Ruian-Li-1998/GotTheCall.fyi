import { cn } from "@/lib/utils";

export function DistributionBars({
  data,
  colorClass = "bg-brand-500",
}: {
  data: { label: string; count: number }[];
  colorClass?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3 text-sm">
          <span className="w-16 shrink-0 text-right text-xs text-gray-500">{d.label}</span>
          <div className="h-5 flex-1 overflow-hidden rounded bg-gray-100">
            <div
              className={cn("h-full rounded", colorClass)}
              style={{ width: `${(d.count / max) * 100}%` }}
            />
          </div>
          <span className="w-8 text-right text-xs text-gray-500 nums">
            {total ? `${Math.round((d.count / total) * 100)}%` : "0%"}
          </span>
        </div>
      ))}
    </div>
  );
}
