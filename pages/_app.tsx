import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { completeSupabaseSignIn } from '../lib/completeSupabaseSignIn';

function parseUrl(url: string) {
  if (typeof window === 'undefined') {
    return new URL(url, 'http://localhost');
  }

  try {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return new URL(url);
    }
    return new URL(url, window.location.origin);
  } catch (error) {
    return new URL(window.location.href);
  }
}

function hasSupabaseAuthParams(url: string) {
  try {
    const parsed = parseUrl(url);

    if (parsed.pathname === '/auth/callback') {
      return false;
    }

    const searchParams = parsed.searchParams;
    const hashParams = new URLSearchParams(parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash);

    if (searchParams.has('code') || searchParams.has('token_hash')) {
      return true;
    }

    return (
      hashParams.has('token_hash') ||
      hashParams.has('access_token') ||
      hashParams.has('refresh_token') ||
      hashParams.get('type') === 'recovery'
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Unable to inspect Supabase auth params', error);
    return false;
  }
}

function forwardToAuthCallback(url: string) {
  const parsed = parseUrl(url);
  const hash = parsed.hash ? parsed.hash : '';
  const search = parsed.search ? parsed.search : '';
  window.location.replace(`/auth/callback${search}${hash}`);
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const inspect = async (url: string) => {
      if (!hasSupabaseAuthParams(url)) {
        return;
      }

      if (window.location.pathname !== '/auth/callback') {
        try {
          await completeSupabaseSignIn();
          router.replace('/dashboard');
          return;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('Direct Supabase sign-in completion failed; falling back to callback.', error);
        }
      }

      forwardToAuthCallback(url);
    };

    inspect(window.location.href);

    const handleRouteChange = (nextUrl: string) => {
      inspect(nextUrl);
    };

    const handleHashChange = () => {
      inspect(window.location.href);
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <title>Aligned</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
