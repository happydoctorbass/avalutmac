import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

type SupabaseGlobals = typeof globalThis & {
  __avalut_supabase?: SupabaseClient;
  __avalut_supabase_admin?: SupabaseClient;
};

const g = globalThis as SupabaseGlobals;

function createAnonClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey);
}

function createAdminClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** Browser / client-safe Supabase client (anon key) — singleton. */
export const supabase: SupabaseClient =
  g.__avalut_supabase ?? (g.__avalut_supabase = createAnonClient());

/**
 * Server admin client (service role) — singleton.
 * On the browser (or when service key equals anon), reuses the anon singleton
 * so we never spawn a second GoTrueClient in the same context.
 */
export const supabaseAdmin: SupabaseClient = (() => {
  const isBrowser = typeof window !== 'undefined';
  const sameKey = supabaseServiceKey === supabaseAnonKey;

  if (isBrowser || sameKey) {
    return supabase;
  }

  return g.__avalut_supabase_admin ?? (g.__avalut_supabase_admin = createAdminClient());
})();
