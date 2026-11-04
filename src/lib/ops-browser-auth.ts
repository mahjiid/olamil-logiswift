"use client";
import {createClient, type SupabaseClient} from "@supabase/supabase-js";
const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser sees only publishable API credentials, never a service-role key. */
export const opsBrowserAuth:SupabaseClient|null =
  url?.startsWith("https://")&&!url.includes("your-project")&&key&&key.length>=24
    ?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:true,detectSessionInUrl:false}})
    :null;
