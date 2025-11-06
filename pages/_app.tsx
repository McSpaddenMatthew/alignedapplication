import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { supabase } from '../lib/supabaseClient';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const clearUrlHash = () => {
      if (typeof window === 'undefined') return;
      const { pathname, search } = window.location;
      window.history.replaceState({}, document.title, `${pathname}${search}`);
    };

    const clearUrlSearch = () => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      url.searchParams.delete('type');
      url.searchParams.delete('redirect_to');
      url.searchParams.delete('error');
      url.searchParams.delete('error_description');
      const newSearch = url.search ? url.search : '';
      window.history.replaceState({}, document.title, `${url.pathname}${newSearch}${url.hash}`);
    };

    const redirectToDashboard = async () => {
      if (!isMounted || router.pathname === '/dashboard') return;
      await router.replace('/dashboard');
    };

    const handleSessionFromUrl = async () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.replace('#', ''));
        const errorDescription = params.get('error_description');

        if (errorDescription) {
          // eslint-disable-next-line no-console
          console.error('Supabase magic link error:', errorDescription);
          clearUrlHash();
          return;
        }

        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          try {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) throw error;

            clearUrlHash();
            await redirectToDashboard();
            return;
          } catch (err) {
            // eslint-disable-next-line no-console
            console.error('Failed to complete Supabase session from hash', err);
          }
        }
      }

      const searchParams = new URLSearchParams(window.location.search);
      const authCode = searchParams.get('code');

      if (authCode) {
        try {
          const { error } = await supabase.auth.exchangeCodeForSession(authCode);
          if (error) throw error;

          clearUrlSearch();
          await redirectToDashboard();
          return;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to exchange Supabase auth code for session', err);
        }
      }
    };

    const checkExistingSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await redirectToDashboard();
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch Supabase session', err);
      }
    };

    void (async () => {
      await handleSessionFromUrl();
      await checkExistingSession();
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session) {
        void redirectToDashboard();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
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
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
