import { cookies } from 'next/headers';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const storageKey = 'aligned-auth-token';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

export function createServerClient(): SupabaseClient {
  const cookieStore = cookies();

  return createSupabaseClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      storage: {
        getItem: (key) => cookieStore.get(key)?.value ?? null,
        setItem: (key, value) => {
          try {
            cookieStore.set({ name: key, value, path: '/', sameSite: 'lax' });
          } catch (error) {
            console.error('Error setting cookie', error);
          }
        },
        removeItem: (key) => {
          try {
            cookieStore.set({ name: key, value: '', path: '/', expires: new Date(0) });
          } catch (error) {
            console.error('Error removing cookie', error);
          }
        },
      },
      storageKey,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: true,
    },
  });
}
