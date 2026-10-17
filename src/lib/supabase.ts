import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the SERVICE_ROLE key.
 * Every database read/write in this project happens on the server
 * (server components, route handlers, server actions), so the secret
 * never reaches the browser bundle. RLS stays enabled — the service
 * role bypasses it, the anon key cannot touch anything.
 */
export function getSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
