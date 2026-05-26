import Link from "next/link";
import { Watch, Plus } from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { Container } from "@/components/ui";

const links = [
  { href: "/brands", label: "Brands" },
  { href: "/data", label: "Browse data" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Watch className="h-4 w-4" />
          </span>
          <span className="text-base font-semibold tracking-tight text-ink">
            Got the Call
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/data" className="text-sm font-medium text-gray-600 hover:text-ink md:hidden">
            Browse
          </Link>
          <Link href="/submit" className={buttonClasses({ size: "sm" })}>
            <Plus className="h-4 w-4" />
            Submit
          </Link>
        </div>
      </Container>
    </header>
  );
}
