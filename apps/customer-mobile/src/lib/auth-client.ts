import { createClient, type SupabaseClient } from "@supabase/supabase-js";
const url=process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const key=process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

/** Only non-secret publishable keys belong in a mobile bundle. */
export const authClient:SupabaseClient|null =
  url?.startsWith("https://") && key?.startsWith("sb_publishable_") && !key.includes("REPLACE_ME")
  ? createClient(url,key,{auth:{
      persistSession:false,autoRefreshToken:true,detectSessionInUrl:false,
    }})
  : null;
/**
 * Temporary memory-only session strategy. No token is persisted to disk.
 * An authenticated app restart requires reauthentication until an audited
 * encrypted session storage adapter is implemented.
 */
export const isAuthConfigured=Boolean(authClient);
