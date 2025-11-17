import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const storageKey = 'aligned-auth-token';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local'
  );
}

function createBrowserCookieStorage() {
  return {
    getItem: (key: string) => {
      if (typeof document === 'undefined') return null;
      const cookiesArr = document.cookie.split(';').map((cookie) => cookie.trim());
      const match = cookiesArr.find((cookie) => cookie.startsWith(`${key}=`));
      return match ? decodeURIComponent(match.split('=')[1]) : null;
    },
    setItem: (key: string, value: string) => {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
    },
    removeItem: (key: string) => {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    },
  };
}

export function createClient() {
  return createSupabaseClient(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
      storage: createBrowserCookieStorage() as any,
      storageKey,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

// Legacy singleton for Pages Router usage
export const supabase = createSupabaseClient(supabaseUrl || '', supabaseAnonKey || '');

export const createBrowserClient = createClient;
