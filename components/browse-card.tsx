import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Watch } from "lucide-react";
import { Card } from "@/components/ui";

export type BrowseStat = { label: string; value: string };

/**
 * Generic drill-down tile used for brand and collection cards in the browse
 * flow. Watch (reference) tiles reuse the richer ModelCard instead.
 */
export function BrowseCard({
  href,
  eyebrow,
  title,
  logoUrl,
  stats = [],
  footnote,
}: {
  href: string;
  eyebrow?: string;
  title: string;
  logoUrl?: string;
  stats?: BrowseStat[];
  footnote?: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="flex h-full flex-col p-4 transition group-hover:border-brand-300 group-hover:shadow-sm">
        <div className="flex items-start gap-3">
          {logoUrl ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1">
              <Image
                src={logoUrl}
                alt={`${title} logo`}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </span>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Watch className="h-5 w-5" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            {eyebrow ? <p className="text-xs font-medium text-gray-500">{eyebrow}</p> : null}
            <p className="truncate font-medium text-ink group-hover:text-brand-700">{title}</p>
          </div>
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-brand-500" />
        </div>

        {stats.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-[11px] uppercase tracking-wide text-gray-400">{s.label}</p>
                <p className="text-sm font-semibold text-ink nums">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {footnote ? <p className="mt-2 text-xs text-gray-400 nums">{footnote}</p> : null}
      </Card>
    </Link>
  );
}
