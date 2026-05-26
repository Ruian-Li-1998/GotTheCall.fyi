import Link from "next/link";
import type { Metadata } from "next";
import { Container, buttonClasses } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "What 'getting the call' means, and how Got the Call computes wait times and spend-to-qualify.",
};

export default function AboutPage() {
  return (
    <Container className="max-w-2xl py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">
        What it takes to get the call
      </h1>

      <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-gray-700">
        <p>
          For the most sought-after watches, you can&apos;t just walk in and buy
          one. The hyped steel sport models from Rolex, Patek Philippe and
          Audemars Piguet are allocated by authorized dealers (ADs) and brand
          boutiques to clients they choose. Demand massively outstrips supply, so
          getting one at retail usually means building a relationship — and a{" "}
          <strong className="font-semibold text-ink">purchase history</strong> —
          until your name comes up and the dealer finally calls to say it&apos;s in.
        </p>
        <p>
          That dynamic is opaque by design. Nobody publishes how long the wait
          really is, or how much you have to spend on other pieces to qualify.{" "}
          <strong className="font-semibold text-ink">Got the Call</strong> is a
          community attempt to put numbers on it — like levels.fyi, but for the
          watch waitlist game.
        </p>

        <h2 className="pt-4 text-lg font-semibold text-ink">The two numbers that matter</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong className="font-semibold text-ink">Wait time</strong> — months
            from joining the list / expressing interest to getting the call.
          </li>
          <li>
            <strong className="font-semibold text-ink">Spend to qualify</strong> —
            the purchase history (other watches, jewelry, etc.) you built before
            being offered the piece.
          </li>
        </ul>

        <h2 id="methodology" className="scroll-mt-20 pt-4 text-lg font-semibold text-ink">
          Methodology
        </h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Each datapoint is one self-reported acquisition. We show{" "}
            <strong className="font-semibold text-ink">medians</strong> rather than
            averages so a few outliers don&apos;t skew the picture.
          </li>
          <li>
            Leaderboards and per-reference stats only include references with at
            least <strong className="font-semibold text-ink">3 reports</strong>.
          </li>
          <li>
            Reports are community-submitted and unverified. Treat them as
            directional, not gospel.
          </li>
          <li>
            To get the site started, it ships with{" "}
            <strong className="font-semibold text-ink">sample data</strong> across
            popular references. As real submissions come in, they sit alongside
            (and eventually replace) the seed set.
          </li>
        </ul>

        <p className="pt-2 text-sm text-gray-500">
          Got the Call is an independent, fan-made project. It is not affiliated
          with, endorsed by, or sponsored by any watch brand or dealer.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/submit" className={buttonClasses()}>
          Share your experience
        </Link>
        <Link href="/data" className={buttonClasses({ variant: "outline" })}>
          Browse the data
        </Link>
      </div>
    </Container>
  );
}
