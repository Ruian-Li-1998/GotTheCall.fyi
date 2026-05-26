/**
 * Seed a configured Supabase project with the sample watch models + datapoints.
 * Usage: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local,
 * run the schema in supabase/schema.sql, then: `npm run seed`
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { SEED_MODELS } from "@/lib/seed/models";
import { SEED_DATAPOINTS } from "@/lib/seed/datapoints";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key] = match;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
        "Add them to .env.local (see .env.local.example) and run the schema first.",
    );
    process.exit(1);
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const modelRows = SEED_MODELS.map((m) => ({
    brand: m.brand,
    model: m.model,
    reference: m.reference,
    nickname: m.nickname ?? null,
    slug: m.slug,
    retail_price_usd: m.retailPriceUsd,
    image_url: m.imageUrl ?? null,
  }));

  const { error: modelError } = await supabase
    .from("watch_models")
    .upsert(modelRows, { onConflict: "slug" });
  if (modelError) {
    console.error("watch_models upsert failed:", modelError.message);
    process.exit(1);
  }
  console.log(`Upserted ${modelRows.length} watch models.`);

  // Re-seeding is idempotent: clear previous sample rows, then re-insert.
  const { error: clearError } = await supabase
    .from("datapoints")
    .delete()
    .eq("is_sample", true);
  if (clearError) {
    console.error("Clearing sample datapoints failed:", clearError.message);
    process.exit(1);
  }

  const datapointRows = SEED_DATAPOINTS.map((d) => ({
    model_slug: d.modelSlug,
    brand: d.brand,
    model: d.model,
    reference: d.reference,
    nickname: d.nickname ?? null,
    wait_months: d.waitMonths,
    spend_before_usd: d.spendBeforeUsd,
    paid_price_usd: d.paidPriceUsd,
    dealer_type: d.dealerType,
    dealer_name: d.dealerName,
    country: d.country,
    city: d.city,
    region: d.region,
    was_existing_client: d.wasExistingClient,
    got_call_date: d.gotCallDate,
    notes: d.notes,
    status: d.status,
    is_sample: true,
    created_at: d.createdAt,
  }));

  const { error: insertError } = await supabase
    .from("datapoints")
    .insert(datapointRows);
  if (insertError) {
    console.error("datapoints insert failed:", insertError.message);
    process.exit(1);
  }
  console.log(`Inserted ${datapointRows.length} sample datapoints.`);
  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
