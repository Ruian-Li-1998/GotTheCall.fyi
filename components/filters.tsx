"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Search, X } from "lucide-react";
import {
  BRANDS,
  DEALER_TYPE_LABELS,
  MAX_SPEND_OPTIONS,
  MAX_WAIT_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/constants";
import { DEALER_TYPES, REGIONS } from "@/lib/types";

const selectCls =
  "h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

function Field({
  label,
  param,
  current,
  options,
  onChange,
}: {
  label: string;
  param: string;
  current: string;
  options: { value: string; label: string }[];
  onChange: (param: string, value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <select
        className={selectCls}
        value={current}
        onChange={(e) => onChange(param, e.target.value)}
      >
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const [q, setQ] = useState(params.get("q") ?? "");

  function push(next: URLSearchParams) {
    const qs = next.toString();
    startTransition(() => router.push(qs ? `${pathname}?${qs}` : pathname));
  }

  function setParam(param: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(param, value);
    else next.delete(param);
    push(next);
  }

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params.toString());
    const trimmed = q.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    push(next);
  }

  function clearAll() {
    setQ("");
    startTransition(() => router.push(pathname));
  }

  const hasFilters = ["q", "brand", "dealer", "region", "client", "maxWait", "maxSpend", "sort"].some(
    (k) => params.get(k),
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex flex-col gap-4">
        <form onSubmit={onSearch} className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search watch, reference, dealer, city…"
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          />
        </form>

        <div className="flex flex-wrap gap-3">
          <Field
            label="Brand"
            param="brand"
            current={params.get("brand") ?? ""}
            options={BRANDS.map((b) => ({ value: b, label: b }))}
            onChange={setParam}
          />
          <Field
            label="Dealer"
            param="dealer"
            current={params.get("dealer") ?? ""}
            options={DEALER_TYPES.map((d) => ({ value: d, label: DEALER_TYPE_LABELS[d] }))}
            onChange={setParam}
          />
          <Field
            label="Region"
            param="region"
            current={params.get("region") ?? ""}
            options={REGIONS.map((r) => ({ value: r, label: r }))}
            onChange={setParam}
          />
          <Field
            label="Client status"
            param="client"
            current={params.get("client") ?? ""}
            options={[
              { value: "yes", label: "Existing client" },
              { value: "no", label: "New client" },
            ]}
            onChange={setParam}
          />
          <Field
            label="Max wait"
            param="maxWait"
            current={params.get("maxWait") ?? ""}
            options={MAX_WAIT_OPTIONS}
            onChange={setParam}
          />
          <Field
            label="Max spend"
            param="maxSpend"
            current={params.get("maxSpend") ?? ""}
            options={MAX_SPEND_OPTIONS}
            onChange={setParam}
          />
          <Field
            label="Sort by"
            param="sort"
            current={params.get("sort") ?? ""}
            options={SORT_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
            onChange={setParam}
          />
          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="mt-auto inline-flex h-9 items-center gap-1 rounded-lg px-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-ink"
            >
              <X className="h-4 w-4" /> Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
