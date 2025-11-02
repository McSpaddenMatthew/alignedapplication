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

    const handleHashSession = async () => {
      if (typeof window === 'undefined') return;

      const hash = window.location.hash;
      if (!hash || !hash.includes('access_token')) return;

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

      if (!accessToken || !refreshToken) return;

      try {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        if (isMounted) {
          clearUrlHash();
          router.replace('/dashboard');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to complete Supabase session from hash', err);
      }
    };

    handleHashSession();

    return () => {
      isMounted = false;
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
