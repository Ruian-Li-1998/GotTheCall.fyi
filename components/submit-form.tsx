"use client";

import Link from "next/link";
import { useActionState, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { submitDatapoint, type SubmitState } from "@/app/submit/actions";
import { Button } from "@/components/ui";
import { DEALER_TYPES } from "@/lib/types";
import { COUNTRY_TO_REGION, DEALER_TYPE_LABELS } from "@/lib/constants";

type ModelOption = {
  slug: string;
  brand: string;
  model: string;
  reference: string;
};

const initialState: SubmitState = { status: "idle" };
const OTHER = "__other__";

const inputCls =
  "h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-600/20";

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error ? <span className="text-xs text-gray-400">{hint}</span> : null}
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </div>
  );
}

export function SubmitForm({
  models,
  canPersist,
}: {
  models: ModelOption[];
  canPersist: boolean;
}) {
  const [state, formAction, pending] = useActionState(submitDatapoint, initialState);
  const [isOther, setIsOther] = useState(false);

  const errors = state.status === "error" ? (state.errors ?? {}) : {};
  const countries = Object.keys(COUNTRY_TO_REGION);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.status === "success" && (
        <div className="flex items-start gap-2 rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Thanks — your datapoint was added.{" "}
            {state.slug ? (
              <Link href={`/watch/${state.slug}`} className="font-medium underline">
                View the reference
              </Link>
            ) : (
              <Link href="/data" className="font-medium underline">
                Browse data
              </Link>
            )}
          </p>
        </div>
      )}

      {state.status === "unconfigured" && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Your entry looks valid, but submissions aren&apos;t being stored yet.
            Add Supabase credentials (see the README) to enable persistence.
          </p>
        </div>
      )}

      {state.status === "error" && state.message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      {!canPersist && state.status === "idle" && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Demo mode: Supabase isn&apos;t configured, so submissions won&apos;t be
            saved. The form still validates so you can try it out.
          </p>
        </div>
      )}

      <Field label="Which watch?" htmlFor="modelSlug" error={errors.modelSlug}>
        <select
          id="modelSlug"
          name="modelSlug"
          defaultValue=""
          className={inputCls}
          onChange={(e) => setIsOther(e.target.value === OTHER)}
        >
          <option value="" disabled>
            Select a reference…
          </option>
          {models.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.brand} {m.model} — {m.reference}
            </option>
          ))}
          <option value={OTHER}>Other (not listed)</option>
        </select>
      </Field>

      {isOther && (
        <div className="grid gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-3">
          <Field label="Brand" htmlFor="brand" error={errors.brand}>
            <input id="brand" name="brand" className={inputCls} placeholder="e.g. Rolex" />
          </Field>
          <Field label="Model" htmlFor="model" error={errors.model}>
            <input id="model" name="model" className={inputCls} placeholder="e.g. Daytona" />
          </Field>
          <Field label="Reference" htmlFor="reference" error={errors.reference}>
            <input id="reference" name="reference" className={inputCls} placeholder="e.g. 126500LN" />
          </Field>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Wait time (months)"
          htmlFor="waitMonths"
          error={errors.waitMonths}
          hint="From joining the list to the call. 0 if in stock."
        >
          <input
            id="waitMonths"
            name="waitMonths"
            type="number"
            min={0}
            max={120}
            className={inputCls}
            placeholder="e.g. 30"
          />
        </Field>
        <Field
          label="Spend to qualify (USD)"
          htmlFor="spendBeforeUsd"
          error={errors.spendBeforeUsd}
          hint="Purchase history before the call. 0 if none."
        >
          <input
            id="spendBeforeUsd"
            name="spendBeforeUsd"
            type="number"
            min={0}
            className={inputCls}
            placeholder="e.g. 50000"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dealer type" htmlFor="dealerType" error={errors.dealerType}>
          <select id="dealerType" name="dealerType" defaultValue="AD" className={inputCls}>
            {DEALER_TYPES.map((d) => (
              <option key={d} value={d}>
                {DEALER_TYPE_LABELS[d]}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Dealer name (optional)"
          htmlFor="dealerName"
          error={errors.dealerName}
        >
          <input id="dealerName" name="dealerName" className={inputCls} placeholder="Optional" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country" htmlFor="country" error={errors.country}>
          <input
            id="country"
            name="country"
            className={inputCls}
            list="country-list"
            placeholder="e.g. United States"
          />
          <datalist id="country-list">
            {countries.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="City (optional)" htmlFor="city" error={errors.city}>
          <input id="city" name="city" className={inputCls} placeholder="Optional" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="When did you get the call?" htmlFor="gotCallDate" error={errors.gotCallDate}>
          <input id="gotCallDate" name="gotCallDate" type="date" className={inputCls} />
        </Field>
        <div className="flex items-end">
          <label className="inline-flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="wasExistingClient"
              className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-600/30"
            />
            I was already an existing client
          </label>
        </div>
      </div>

      <Field label="Notes (optional)" htmlFor="notes" error={errors.notes}>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-600/20"
          placeholder="What did you have to buy? Any context on the relationship?"
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Submitting…" : "Submit datapoint"}
        </Button>
        <span className="text-xs text-gray-400">
          Community-reported. Please only share real experiences.
        </span>
      </div>
    </form>
  );
}
