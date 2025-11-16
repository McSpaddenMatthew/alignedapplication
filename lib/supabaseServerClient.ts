import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
}

export const createServerClient = () => {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('sb-access-token')?.value;

  const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return { supabase, accessToken };
};
