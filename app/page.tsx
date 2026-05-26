import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Container, SectionHeading, buttonClasses } from "@/components/ui";
import { ModelCard } from "@/components/model-card";
import { DatapointTable } from "@/components/datapoint-table";
import { getLeaderboards, getOverview, getRecentDatapoints } from "@/lib/queries";
import { formatMonthsLong } from "@/lib/format";

export default async function HomePage() {
  const [overview, { hardest }, recent] = await Promise.all([
    getOverview(),
    getLeaderboards(),
    getRecentDatapoints(6),
  ]);

  const stats = [
    { label: "Datapoints", value: overview.totalDatapoints.toLocaleString() },
    { label: "References", value: overview.modelsCovered.toLocaleString() },
    { label: "Median wait", value: formatMonthsLong(overview.medianWaitMonths) },
    {
      label: "Hardest right now",
      value: overview.hardest ? overview.hardest.model.model : "—",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-brand-50/50 to-white">
        <Container className="py-16 sm:py-24">
          <p className="text-sm font-medium text-brand-700">
            Crowdsourced watch acquisition data
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
            Find out what it really takes to get the call.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            Real wait times and purchase history for the watches everyone is
            chasing — so you know how long you&apos;ll wait and what you&apos;ll
            spend before an authorized dealer finally calls.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/data" className={buttonClasses({ size: "lg" })}>
              Browse the data <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/submit" className={buttonClasses({ variant: "outline", size: "lg" })}>
              Submit a datapoint
            </Link>
          </div>

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-200 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="bg-white px-5 py-4">
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {s.label}
                </dt>
                <dd className="mt-1 truncate text-xl font-semibold text-ink nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Hardest to get */}
      <Container className="py-14">
        <SectionHeading
          title="Hardest to get right now"
          description="References with the longest median wait from list to call."
          action={
            <Link
              href="/leaderboards"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
            >
              All leaderboards <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hardest.slice(0, 6).map((row) => (
            <ModelCard key={row.model.slug} row={row} />
          ))}
        </div>
      </Container>

      {/* Recent reports */}
      <Container className="pb-16">
        <SectionHeading
          title="Recent reports"
          description="The latest acquisitions shared by the community."
          action={
            <Link
              href="/data"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:underline"
            >
              Browse all <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="mt-6">
          <DatapointTable datapoints={recent} />
        </div>
      </Container>

      {/* CTA */}
      <section className="bg-ink">
        <Container className="flex flex-col items-start gap-4 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Got the call?</h2>
            <p className="mt-1 text-sm text-gray-300">
              Pay it forward — share your wait time and spend so the next person
              knows what to expect.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-ink hover:bg-gray-100"
          >
            Submit a datapoint <ArrowRight className="h-4 w-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
