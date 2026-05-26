import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { FilterBar } from "@/components/filters";
import { DatapointTable } from "@/components/datapoint-table";
import { getDatapoints, type DatapointFilters } from "@/lib/queries";
import { pluralize } from "@/lib/format";
import type { DealerType, Region } from "@/lib/types";
import type { SortValue } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Browse data",
  description:
    "Filter and sort crowdsourced wait times and purchase history across luxury watch references.",
};

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toNumber(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

export default async function DataPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const client = first(sp.client);
  const filters: DatapointFilters = {
    q: first(sp.q),
    brand: first(sp.brand),
    dealer: first(sp.dealer) as DealerType | undefined,
    region: first(sp.region) as Region | undefined,
    client: client === "yes" || client === "no" ? client : undefined,
    maxWait: toNumber(first(sp.maxWait)),
    maxSpend: toNumber(first(sp.maxSpend)),
    sort: first(sp.sort) as SortValue | undefined,
  };

  const datapoints = await getDatapoints(filters);

  return (
    <Container className="py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Browse datapoints</h1>
        <p className="mt-1 text-sm text-gray-500">
          Every row is one reported acquisition: how long they waited and what they
          spent to get the call.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        <Suspense fallback={<div className="h-40 rounded-xl border border-gray-200 bg-gray-50" />}>
          <FilterBar />
        </Suspense>

        <p className="text-sm text-gray-500">
          <span className="font-medium text-ink nums">{datapoints.length}</span>{" "}
          {pluralize(datapoints.length, "datapoint")}
        </p>

        <DatapointTable datapoints={datapoints} />
      </div>
    </Container>
  );
}
