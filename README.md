# Got the Call

A levels.fyi-style site for **luxury watch acquisition data** — crowdsourced
wait times and purchase history for the hard-to-get references everyone is
chasing. How long did you wait, and how much did you spend, before an authorized
dealer finally called?

Built with Next.js (App Router), TypeScript, Tailwind, and Supabase.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

The site works immediately on **local sample data** (~40 references, a couple
hundred generated datapoints) — no database required. Submissions are validated
but not stored until you connect Supabase.

## Features

- **Browse** (`/data`) — filter/sort every datapoint by brand, dealer type,
  region, wait, spend, and more.
- **Per-reference stats** (`/watch/[slug]`) — median wait, median spend-to-qualify,
  and distribution charts.
- **Leaderboards** (`/leaderboards`) — hardest to get, biggest spend, by region.
- **Submit** (`/submit`) — contribute your own wait + purchase history.

## Enable real submissions (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.local.example` to `.env.local` and fill in the three keys
   (Project Settings → API).
4. Load the sample data into your database:
   ```bash
   npm run seed
   ```
5. Restart `npm run dev`. Reads now come from Postgres and submissions persist.

Reads use the public anon key; inserts run server-side with the service-role key
(kept out of the browser). Row-level security exposes only approved rows.

## Project structure

```
app/                Routes: / · /data · /watch/[slug] · /leaderboards · /submit · /about
  submit/actions.ts Server action that validates + inserts a datapoint
components/          UI primitives, table, filters, charts, forms
lib/
  queries.ts        Data access — Supabase when configured, else seed data
  stats.ts          Median / percentile / histogram helpers
  seed/             Sample watch models + deterministic datapoint generator
  supabase/         Server-side Supabase clients
supabase/schema.sql Tables, enums, indexes, RLS policies
scripts/seed.ts     `npm run seed` — load sample data into Supabase
```

## Notes

Got the Call is an independent, fan-made project. Reports are community-submitted
and unverified — treat them as directional. Not affiliated with any brand or dealer.
