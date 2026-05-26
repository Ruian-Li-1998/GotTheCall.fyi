import type { ReactNode } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  sub,
  accent = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: "default" | "brand" | "gold";
}) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold nums",
          accent === "brand" && "text-brand-700",
          accent === "gold" && "text-gold-600",
          accent === "default" && "text-ink",
        )}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-xs text-gray-500">{sub}</p> : null}
    </Card>
  );
}
