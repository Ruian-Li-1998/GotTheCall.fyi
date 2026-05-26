"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DEALER_TYPES } from "@/lib/types";
import { regionForCountry } from "@/lib/constants";
import { getModelBySlug } from "@/lib/queries";
import { getWriteClient, hasSupabaseWriteConfig } from "@/lib/supabase/server";

export type SubmitState =
  | { status: "idle" }
  | { status: "success"; slug: string | null }
  | { status: "unconfigured" }
  | { status: "error"; errors?: Record<string, string>; message?: string };

const OTHER = "__other__";

const schema = z
  .object({
    modelSlug: z.string().min(1, "Pick a watch"),
    brand: z.string().max(60).optional(),
    model: z.string().max(80).optional(),
    reference: z.string().max(60).optional(),
    waitMonths: z.coerce.number().int().min(0, "Must be 0 or more").max(120, "That seems too long"),
    spendBeforeUsd: z.coerce.number().min(0, "Must be 0 or more").max(10_000_000),
    paidPriceUsd: z.coerce.number().min(0).max(10_000_000).optional(),
    dealerType: z.enum(DEALER_TYPES),
    dealerName: z.string().max(120).optional(),
    country: z.string().min(1, "Required").max(60),
    city: z.string().max(80).optional(),
    wasExistingClient: z.boolean().optional(),
    gotCallDate: z
      .string()
      .min(1, "Required")
      .refine((v) => {
        const t = Date.parse(v);
        if (Number.isNaN(t)) return false;
        const year = new Date(t).getFullYear();
        return year >= 2000 && t <= Date.now() + 86_400_000;
      }, "Enter a valid past date"),
    notes: z.string().max(1000).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.modelSlug === OTHER) {
      if (!val.brand) ctx.addIssue({ code: "custom", path: ["brand"], message: "Required" });
      if (!val.model) ctx.addIssue({ code: "custom", path: ["model"], message: "Required" });
      if (!val.reference) ctx.addIssue({ code: "custom", path: ["reference"], message: "Required" });
    }
  });

function str(formData: FormData, name: string): string | undefined {
  const v = formData.get(name);
  if (typeof v !== "string") return undefined;
  const trimmed = v.trim();
  return trimmed === "" ? undefined : trimmed;
}

export async function submitDatapoint(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const raw = {
    modelSlug: str(formData, "modelSlug"),
    brand: str(formData, "brand"),
    model: str(formData, "model"),
    reference: str(formData, "reference"),
    waitMonths: str(formData, "waitMonths"),
    spendBeforeUsd: str(formData, "spendBeforeUsd"),
    paidPriceUsd: str(formData, "paidPriceUsd"),
    dealerType: str(formData, "dealerType"),
    dealerName: str(formData, "dealerName"),
    country: str(formData, "country"),
    city: str(formData, "city"),
    wasExistingClient: formData.get("wasExistingClient") === "on",
    gotCallDate: str(formData, "gotCallDate"),
    notes: str(formData, "notes"),
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { status: "error", errors };
  }

  const v = parsed.data;
  const isOther = v.modelSlug === OTHER;

  let brand = v.brand ?? "";
  let model = v.model ?? "";
  let reference = v.reference ?? "";
  let nickname: string | null = null;
  let modelSlug: string | null = null;

  if (!isOther) {
    const found = await getModelBySlug(v.modelSlug);
    if (!found) {
      return { status: "error", errors: { modelSlug: "Unknown watch" } };
    }
    brand = found.brand;
    model = found.model;
    reference = found.reference;
    nickname = found.nickname ?? null;
    modelSlug = found.slug;
  }

  if (!hasSupabaseWriteConfig()) {
    return { status: "unconfigured" };
  }

  const supabase = getWriteClient();
  if (!supabase) return { status: "unconfigured" };

  const { error } = await supabase.from("datapoints").insert({
    model_slug: modelSlug,
    brand,
    model,
    reference,
    nickname,
    wait_months: v.waitMonths,
    spend_before_usd: Math.round(v.spendBeforeUsd),
    paid_price_usd: v.paidPriceUsd != null ? Math.round(v.paidPriceUsd) : null,
    dealer_type: v.dealerType,
    dealer_name: v.dealerName ?? null,
    country: v.country,
    city: v.city ?? null,
    region: regionForCountry(v.country),
    was_existing_client: v.wasExistingClient ?? false,
    got_call_date: v.gotCallDate,
    notes: v.notes ?? null,
    status: "approved",
  });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/data");
  revalidatePath("/leaderboards");
  if (modelSlug) revalidatePath(`/watch/${modelSlug}`);

  return { status: "success", slug: modelSlug };
}
