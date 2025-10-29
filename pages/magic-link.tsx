import { useRouter } from 'next/router';
import { useMemo, useCallback, useEffect, useState } from 'react';

import { getSiteUrl } from '../lib/getSiteUrl';
import {
  completeSupabaseSignIn,
  getStoredSupabaseAuthPayload,
  LOGIN_EMAIL_REQUIRED
} from '../lib/completeSupabaseSignIn';
import { supabase } from '../lib/supabaseClient';

export default function MagicLinkPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'waiting' | 'finishing' | 'success' | 'error'>('waiting');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const email = useMemo(() => {
    if (!router.query.email) return null;
    const value = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
    return decodeURIComponent(value);
  }, [router.query.email]);
  const destination = useMemo(() => {
    const siteUrl = getSiteUrl();
    try {
      return new URL('/auth/callback', siteUrl).toString();
    } catch (error) {
      return `${siteUrl.replace(/\/$/, '')}/auth/callback`;
    }
  }, []);
  const launchCallback = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (email) {
      params.set('login_email', email);
    }
    const query = params.toString();
    window.location.href = query ? `/auth/callback?${query}` : '/auth/callback';
  }, [email]);

  useEffect(() => {
    let active = true;

    const redirectIfSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('Unable to confirm session while waiting for magic link', error);
        return;
      }

      if (data?.session) {
        router.replace('/dashboard');
      }
    };

    redirectIfSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session) {
        router.replace('/dashboard');
      }
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const searchParams = new URLSearchParams(window.location.search);
    const rawHash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
    const hashParams = new URLSearchParams(rawHash);
    const hasSupabasePayload =
      searchParams.has('code') ||
      searchParams.has('token_hash') ||
      hashParams.has('token_hash') ||
      hashParams.has('access_token') ||
      hashParams.has('refresh_token');

    const storedPayload = getStoredSupabaseAuthPayload();

    if (!hasSupabasePayload && !storedPayload) {
      return;
    }

    let cancelled = false;

    const finishInline = async () => {
      setStatus('finishing');
      setErrorMessage(null);

      try {
        await completeSupabaseSignIn();
        if (cancelled) return;
        setStatus('success');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 400);
      } catch (error: any) {
        if (cancelled) return;
        if (error?.code === LOGIN_EMAIL_REQUIRED) {
          launchCallback();
          return;
        }
        setStatus('error');
        setErrorMessage(error?.message || 'We could not finish signing you in. Use the button below to try again.');
      }
    };

    finishInline();

    return () => {
      cancelled = true;
    };
  }, [launchCallback, router]);

  return (
    <div className="container">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 mt-16 border border-gray-100 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-3">Step 2</p>
        <h1 className="text-3xl font-bold text-primary mb-4">Check your inbox for the magic link</h1>
        <p className="text-gray-700 leading-relaxed">
          We just sent {email ? <strong>{email}</strong> : 'your email'} a secure sign-in link. Open it on this device and you’ll be in your dashboard within seconds.
        </p>
        {status !== 'waiting' && (
          <div className="mt-4 text-sm text-gray-600">
            {status === 'finishing' && <p>Confirming your session…</p>}
            {status === 'success' && <p>Confirmed. Redirecting to your dashboard…</p>}
            {status === 'error' && errorMessage && <p className="text-red-600">{errorMessage}</p>}
          </div>
        )}
        <div className="mt-8 text-left bg-soft rounded-xl p-6 border border-gray-100">
          <p className="text-sm font-semibold text-primary mb-2">Having trouble?</p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
            <li>Search for “Aligned magic link” in your inbox or spam folder.</li>
            <li>
              The link should open <strong>{destination}</strong> and then forward you to the dashboard. If you land somewhere
              else, update your Supabase project’s site URL to this domain.
            </li>
            <li>
              If you landed back on this page,{' '}
              <button onClick={launchCallback} className="text-primary underline">
                finish the sign-in now
              </button>
              .
            </li>
            <li>
              Need the email resent?{' '}
              <button onClick={() => router.push('/login')} className="text-primary underline">
                Go back to login
              </button>
              .
            </li>
            <li>Still stuck? Email <a className="text-primary underline" href="mailto:mason@weldrecruiting.co">mason@weldrecruiting.co</a>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
