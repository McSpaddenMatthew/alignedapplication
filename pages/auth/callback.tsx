import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Callback() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');

    if (access_token) {
      supabase.auth.setSession({
        access_token,
        refresh_token: refresh_token || '',
      });
    }

    router.replace('/dashboard');
  }, [router]);

  return <p>Redirecting…</p>;
}
