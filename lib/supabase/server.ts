import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when reads can be served from Supabase (otherwise we use seed data). */
export function hasSupabaseConfig(): boolean {
  return Boolean(url && anonKey);
}

/** True when the server can write (insert) to Supabase. */
export function hasSupabaseWriteConfig(): boolean {
  return Boolean(url && serviceRoleKey);
}

/** Read client (anon key). Server-side only. */
export function getReadClient(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

/** Write client (service-role key). Server-side only — never expose to the browser. */
export function getWriteClient(): SupabaseClient | null {
  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}
