import Link from "next/link";
import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="text-sm font-semibold text-ink">Got the Call</p>
          <p className="mt-2 text-sm text-gray-500">
            Crowdsourced wait times and purchase history for the watches everyone
            is chasing. Community-reported and unofficial — not affiliated with any
            brand or dealer.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-ink">Explore</span>
            <Link href="/data" className="text-gray-500 hover:text-ink">Browse data</Link>
            <Link href="/leaderboards" className="text-gray-500 hover:text-ink">Leaderboards</Link>
            <Link href="/submit" className="text-gray-500 hover:text-ink">Submit a datapoint</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium text-ink">About</span>
            <Link href="/about" className="text-gray-500 hover:text-ink">How it works</Link>
            <Link href="/about#methodology" className="text-gray-500 hover:text-ink">Methodology</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
