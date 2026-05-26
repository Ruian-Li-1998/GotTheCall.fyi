import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui";
import { ModelCard } from "@/components/model-card";
import { getCollectionDetail, getModels } from "@/lib/queries";
import { pluralize, slugify } from "@/lib/format";

export async function generateStaticParams() {
  const models = await getModels();
  const seen = new Set<string>();
  const params: { brand: string; collection: string }[] = [];
  for (const m of models) {
    const brand = slugify(m.brand);
    const collection = slugify(m.model);
    const key = `${brand}/${collection}`;
    if (seen.has(key)) continue;
    seen.add(key);
    params.push({ brand, collection });
  }
  return params;
}

export async function generateMetadata(props: {
  params: Promise<{ brand: string; collection: string }>;
}): Promise<Metadata> {
  const { brand, collection } = await props.params;
  const detail = await getCollectionDetail(brand, collection);
  if (!detail) return { title: "Collection not found" };
  const name = `${detail.brand} ${detail.collection}`;
  return {
    title: name,
    description: `References in the ${name} collection with wait times and spend-to-qualify.`,
  };
}

export default async function CollectionPage(props: {
  params: Promise<{ brand: string; collection: string }>;
}) {
  const { brand, collection } = await props.params;
  const detail = await getCollectionDetail(brand, collection);
  if (!detail) notFound();

  return (
    <Container className="py-10">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href="/brands" className="hover:text-ink">
          Brands
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <Link href={`/brands/${brand}`} className="hover:text-ink">
          {detail.brand}
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-300" />
        <span className="font-medium text-ink">{detail.collection}</span>
      </nav>

      <div className="mb-6 mt-4">
        <p className="text-sm font-medium text-gray-500">{detail.brand}</p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">{detail.collection}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {detail.watches.length} {pluralize(detail.watches.length, "reference")} — pick one for
          its full acquisition data.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {detail.watches.map((row) => (
          <ModelCard key={row.model.slug} row={row} />
        ))}
      </div>
    </Container>
  );
}
