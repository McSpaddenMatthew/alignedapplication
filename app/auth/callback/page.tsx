'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../../lib/supabaseClient';

// We use a client component page so we can read the hash-based tokens Supabase sends back in magic-link flows.
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Completing sign-in…');

  useEffect(() => {
    const supabase = createClient();
    const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const code = searchParams.get('code');

    async function handleAuth() {
      try {
        let sessionUser;
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          sessionUser = data.session?.user;
        } else if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
          sessionUser = data.session?.user;
        } else {
          setMessage('Missing auth tokens. Redirecting…');
          router.replace('/login');
          return;
        }

        const storedName = typeof window !== 'undefined' ? localStorage.getItem('aligned_full_name') : null;

        if (sessionUser) {
          await supabase.from('profiles').upsert({
            id: sessionUser.id,
            email: sessionUser.email ?? '',
            full_name: storedName || sessionUser.user_metadata?.full_name || null,
          });
        }

        router.replace('/dashboard');
      } catch (error) {
        console.error('Error handling callback', error);
        setMessage('Sign-in failed. Redirecting to login…');
        router.replace('/login');
      }
    }

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="flex items-center justify-center py-10">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-md text-center">
        <p className="text-sm text-gray-700">{message}</p>
      </div>
    </div>
  );
}
