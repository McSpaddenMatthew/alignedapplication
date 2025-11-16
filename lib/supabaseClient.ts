// lib/supabaseClient.ts

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single shared Supabase client that can be used in pages, app router,
// client components, and API routes. No next/headers, so it's safe everywhere.
export const supabaseClient: SupabaseClient = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export type { SupabaseClient };

// Support both default and named imports.
export default supabaseClient;
