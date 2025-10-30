import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

function mergeSearchAndHashParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);

  hashParams.forEach((value, key) => {
    if (!searchParams.has(key)) {
      searchParams.set(key, value);
    }
  });

  return searchParams;
}

function resolveRedirectPath(params: URLSearchParams) {
  const redirectTo = params.get('redirect_to') || params.get('next');
  if (redirectTo && redirectTo.startsWith('/')) {
    return redirectTo;
  }

  return '/dashboard';
}

async function establishSessionFromParams(params: URLSearchParams) {
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const code = params.get('code');

  if (code && (!accessToken || !refreshToken)) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) throw error;
    return;
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    if (error) throw error;
  }
}

export default function SupabaseAuthCallbackHandler() {
  const router = useRouter();
  const handledAuthCallback = useRef(false);

  useEffect(() => {
    if (!router.isReady || handledAuthCallback.current) {
      return;
    }

    const params = mergeSearchAndHashParams();
    const hasSessionParams = ['access_token', 'refresh_token', 'code'].some((key) => params.has(key));
    const hasError = params.has('error_description');

    if (!hasSessionParams && !hasError) {
      return;
    }

    handledAuthCallback.current = true;

    const redirectToLoginWithError = (message: string) => {
      router.replace(
        {
          pathname: '/login',
          query: { error: message },
        },
        '/login'
      );
    };

    if (hasError) {
      const errorDescription = params.get('error_description') || 'Login failed. Please try again.';
      redirectToLoginWithError(errorDescription);
      return;
    }

    (async () => {
      try {
        await establishSessionFromParams(params);
        const destination = resolveRedirectPath(params);
        router.replace(destination);
      } catch (error) {
        console.error('Failed to finish Supabase auth callback', error);
        redirectToLoginWithError('Your login link expired or is invalid. Please request a new one.');
      }
    })();
  }, [router]);

  return null;
}

