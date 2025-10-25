import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import { supabase } from '../../lib/supabaseClient';

type VerifyOtpType = Parameters<typeof supabase.auth.verifyOtp>[0]['type'];
type EmailOtpType = Extract<VerifyOtpType, 'magiclink' | 'signup' | 'recovery' | 'invite' | 'email_change'>;

type Status = 'initialising' | 'success' | 'error';

const GENERIC_ERROR =
  'We could not confirm your magic link. Open the link on the same device you requested it from or ask for a fresh one.';

function parseHashParams(hash: string) {
  if (!hash) return new URLSearchParams();
  const trimmed = hash.startsWith('#') ? hash.slice(1) : hash;
  return new URLSearchParams(trimmed);
}

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('initialising');
  const [message, setMessage] = useState('Confirming your access…');

  const siteError = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const queryParams = new URLSearchParams(window.location.search);
    const hashParams = parseHashParams(window.location.hash);
    return (
      queryParams.get('error_description') ||
      hashParams.get('error_description') ||
      queryParams.get('error') ||
      hashParams.get('error')
    );
  }, [router.asPath]);

  useEffect(() => {
    if (!router.isReady) return;

    const handleSessionExchange = async () => {
      try {
        if (siteError) {
          throw new Error(siteError);
        }

        if (typeof window === 'undefined') {
          throw new Error(GENERIC_ERROR);
        }

        const queryParams = new URLSearchParams(window.location.search);
        const hashParams = parseHashParams(window.location.hash);

        const code = queryParams.get('code');
        const tokenHash = queryParams.get('token_hash');
        const typeParam = queryParams.get('type') || hashParams.get('type');
        let email = queryParams.get('email') || hashParams.get('email');
        if (!email && typeof window !== 'undefined') {
          email = window.localStorage.getItem('aligned:last-login-email');
        }
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else if (tokenHash && email) {
          const rawType = (typeParam || 'magiclink').toLowerCase();
          const supportedTypes: EmailOtpType[] = ['signup', 'magiclink', 'recovery', 'invite', 'email_change'];
          const type = supportedTypes.includes(rawType as EmailOtpType) ? (rawType as EmailOtpType) : 'magiclink';
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type, email });
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        } else {
          throw new Error(GENERIC_ERROR);
        }

        setStatus('success');
        setMessage('You are signed in. Redirecting to your dashboard…');

        // Clean up the URL so tokens are not stored in browser history.
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('aligned:last-login-email');
          const url = new URL(window.location.href);
          url.hash = '';
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        }

        setTimeout(() => {
          router.replace('/dashboard');
        }, 600);
      } catch (err: any) {
        setStatus('error');
        setMessage(
          err?.message?.includes('Passwordless sign-ins')
            ? 'The magic link must open on the same domain it was requested from. Update the Supabase site URL or request a new link on this device.'
            : err?.message || GENERIC_ERROR
        );
      }
    };

    handleSessionExchange();
  }, [router, siteError]);

  return (
    <div className="container">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 mt-16 border border-gray-100 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-3">Step 3</p>
        <h1 className="text-3xl font-bold text-primary mb-4">{status === 'success' ? 'Signed in' : 'Finishing sign-in'}</h1>
        <p className="text-gray-700 leading-relaxed">{message}</p>
        {status === 'error' && (
          <div className="mt-6 text-sm text-gray-600 space-y-2 text-left">
            <p className="font-semibold text-primary">Still seeing issues?</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Open the email on the same browser where you requested access.</li>
              <li>Confirm your Supabase project’s Site URL matches this domain exactly.</li>
              <li>
                If the link expired, <button onClick={() => router.push('/login')} className="text-primary underline">request a new one</button>.
              </li>
              <li>
                Need help? Email{' '}
                <a className="text-primary underline" href="mailto:mason@weldrecruiting.co">
                  mason@weldrecruiting.co
                </a>
                .
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

