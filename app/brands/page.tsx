import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { BrowseCard } from "@/components/browse-card";
import { getBrandSummaries } from "@/lib/queries";
import { formatMonthsLong, pluralize } from "@/lib/format";
import { brandLogoUrl } from "@/lib/logos";

export const metadata: Metadata = {
  title: "Browse by brand",
  description:
    "Browse crowdsourced watch acquisition data by brand, then collection, then reference.",
};

export default async function BrandsPage() {
  const brands = await getBrandSummaries();

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Browse by brand</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pick a brand, then a collection, then a reference to see its wait time and
          spend-to-qualify.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <BrowseCard
            key={b.slug}
            href={`/brands/${b.slug}`}
            title={b.brand}
            logoUrl={brandLogoUrl(b.brand) ?? undefined}
            stats={[
              { label: "Median wait", value: formatMonthsLong(b.medianWaitMonths) },
              { label: "Collections", value: String(b.collectionCount) },
            ]}
            footnote={`${b.watchCount} ${pluralize(b.watchCount, "reference")} · ${b.datapointCount} ${pluralize(b.datapointCount, "report")}`}
          />
        ))}
      </div>
    </Container>
  );
}
