import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Watch } from "lucide-react";
import { Badge, Card, Container } from "@/components/ui";
import { StatCard } from "@/components/stat-card";
import { DistributionBars } from "@/components/distribution-bars";
import { DatapointTable } from "@/components/datapoint-table";
import { getDatapointsForModel, getModelBySlug, getModels } from "@/lib/queries";
import { computeStats, bucketCounts } from "@/lib/stats";
import { SPEND_BUCKETS, WAIT_BUCKETS } from "@/lib/constants";
import { formatMonthsLong, formatUsd, pluralize } from "@/lib/format";

export async function generateStaticParams() {
  const models = await getModels();
  return models.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const model = await getModelBySlug(slug);
  if (!model) return { title: "Watch not found" };
  const name = `${model.brand} ${model.model} ${model.reference}`;
  return {
    title: name,
    description: `Median wait time and purchase history to get the call for the ${name}.`,
  };
}

export default async function WatchPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const model = await getModelBySlug(slug);
  if (!model) notFound();

  const datapoints = await getDatapointsForModel(slug);
  const stats = computeStats(datapoints);
  const waitDist = bucketCounts(datapoints.map((d) => d.waitMonths), WAIT_BUCKETS);
  const spendDist = bucketCounts(datapoints.map((d) => d.spendBeforeUsd), SPEND_BUCKETS);

  return (
    <Container className="py-10">
      <Link
        href="/data"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All datapoints
      </Link>

      <Card className="mt-4 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Watch className="h-7 w-7" />
          </span>
          <div>
            <p className="text-sm font-medium text-gray-500">{model.brand}</p>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{model.model}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500 nums">{model.reference}</span>
              {model.nickname && <Badge variant="gold">“{model.nickname}”</Badge>}
            </div>
          </div>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Retail</p>
          <p className="text-xl font-semibold text-ink nums">{formatUsd(model.retailPriceUsd)}</p>
        </div>
      </Card>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Median wait"
          value={formatMonthsLong(stats.medianWaitMonths)}
          sub={
            stats.p25WaitMonths != null
              ? `middle 50%: ${formatMonthsLong(stats.p25WaitMonths)} – ${formatMonthsLong(stats.p75WaitMonths)}`
              : undefined
          }
          accent="brand"
        />
        <StatCard
          label="Median spend to qualify"
          value={formatUsd(stats.medianSpendUsd)}
          sub="purchase history before the call"
          accent="gold"
        />
        <StatCard
          label="Datapoints"
          value={stats.count}
          sub={`${pluralize(stats.count, "report")}`}
        />
        <StatCard
          label="Existing clients"
          value={
            stats.existingClientShare != null
              ? `${Math.round(stats.existingClientShare * 100)}%`
              : "—"
          }
          sub="had a prior relationship"
        />
      </div>

      {datapoints.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">Wait time distribution</h2>
            <div className="mt-4">
              <DistributionBars data={waitDist} colorClass="bg-brand-500" />
            </div>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-ink">Spend-to-qualify distribution</h2>
            <div className="mt-4">
              <DistributionBars data={spendDist} colorClass="bg-gold-500" />
            </div>
          </Card>
        </div>
      ) : (
        <Card className="mt-8 p-8 text-center">
          <p className="text-sm font-medium text-ink">No datapoints yet for this reference.</p>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to{" "}
            <Link href="/submit" className="font-medium text-brand-700 hover:underline">
              share your experience
            </Link>
            .
          </p>
        </Card>
      )}

      {datapoints.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-ink">
            All reports for this reference
          </h2>
          <DatapointTable datapoints={datapoints} showWatch={false} />
        </div>
      )}
    </Container>
  );
}
