import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { BrowseCard } from "@/components/browse-card";
import { getBrandDetail, getBrandSummaries } from "@/lib/queries";
import { formatMonthsLong, formatUsd, pluralize } from "@/lib/format";
import { brandLogoUrl } from "@/lib/logos";

export async function generateStaticParams() {
  const brands = await getBrandSummaries();
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ brand: string }>;
}): Promise<Metadata> {
  const { brand } = await props.params;
  const detail = await getBrandDetail(brand);
  if (!detail) return { title: "Brand not found" };
  return {
    title: detail.brand,
    description: `Browse ${detail.brand} collections and their wait times and spend-to-qualify.`,
  };
}

export default async function BrandPage(props: { params: Promise<{ brand: string }> }) {
  const { brand } = await props.params;
  const detail = await getBrandDetail(brand);
  if (!detail) notFound();
  const logoUrl = brandLogoUrl(detail.brand) ?? undefined;

  return (
    <Container className="py-10">
      <nav className="flex items-center gap-1 text-sm text-gray-500">
        <Link href="/brands" className="hover:text-ink">
          Brands
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <span className="font-medium text-ink">{detail.brand}</span>
      </nav>

      <div className="mb-6 mt-4 flex items-center gap-4">
        {logoUrl ? (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5">
            <Image
              src={logoUrl}
              alt={`${detail.brand} logo`}
              width={44}
              height={44}
              className="h-11 w-11 object-contain"
            />
          </span>
        ) : null}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{detail.brand}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {detail.collections.length} {pluralize(detail.collections.length, "collection")} — pick
            one to see its references.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detail.collections.map((c) => (
          <BrowseCard
            key={c.slug}
            href={`/brands/${brand}/${c.slug}`}
            eyebrow={detail.brand}
            title={c.model}
            stats={[
              { label: "Median wait", value: formatMonthsLong(c.medianWaitMonths) },
              { label: "Median spend", value: formatUsd(c.medianSpendUsd) },
            ]}
            footnote={`${c.watchCount} ${pluralize(c.watchCount, "reference")} · ${c.datapointCount} ${pluralize(c.datapointCount, "report")}`}
          />
        ))}
      </div>
    </Container>
  );
}
