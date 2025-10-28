import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { completeSupabaseSignIn } from '../lib/completeSupabaseSignIn';
import { supabase } from '../lib/supabaseClient';

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

    return hashParams.has('token_hash') || hashParams.has('access_token') || hashParams.has('refresh_token');
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

const bootstrapScript = `
(() => {
  try {
    if (typeof window === 'undefined') {
      return;
    }

    const toUrl = (url) => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return new URL(url);
      }
      return new URL(url, window.location.origin);
    };

    const inspect = (url) => {
      try {
        const parsed = toUrl(url);
        if (parsed.pathname === '/auth/callback') {
          return;
        }

        const rawHash = parsed.hash && parsed.hash.startsWith('#') ? parsed.hash.slice(1) : parsed.hash;
        const searchParams = parsed.searchParams;
        const hashParams = new URLSearchParams(rawHash || '');

        if (
          searchParams.has('code') ||
          searchParams.has('token_hash') ||
          hashParams.has('token_hash') ||
          hashParams.has('access_token') ||
          hashParams.has('refresh_token')
        ) {
          const search = parsed.search ? parsed.search : '';
          const hash = parsed.hash ? parsed.hash : '';
          window.location.replace(\`/auth/callback\${search}\${hash}\`);
        }
      } catch (error) {
        console.error('Failed to evaluate Supabase auth params', error);
      }
    };

    inspect(window.location.href);
    window.addEventListener('hashchange', () => {
      inspect(window.location.href);
    });
    window.addEventListener('pageshow', () => {
      inspect(window.location.href);
    });
  } catch (error) {
    console.error('Supabase redirect bootstrap failed', error);
  }
})();
`;

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
  }, [router, router.pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let active = true;

    const shouldRedirectToDashboard = () => {
      const authPages = ['/', '/login', '/magic-link', '/auth/callback'];
      return authPages.includes(router.pathname);
    };

    const redirectIfSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;

      if (error) {
        // eslint-disable-next-line no-console
        console.warn('Unable to check Supabase session while routing', error);
        return;
      }

      if (data?.session && shouldRedirectToDashboard()) {
        router.replace('/dashboard');
      }
    };

    redirectIfSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === 'SIGNED_OUT') return;
      if (session && shouldRedirectToDashboard()) {
        router.replace('/dashboard');
      }
    });

    return () => {
      active = false;
      subscription?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
        <title>Aligned</title>
      </Head>
      <Script id="supabase-auth-bootstrap" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
