import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';
import Layout from '../components/Layout';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { pathname, search, hash } = window.location;

    if (pathname === '/auth/callback') return;

    const searchParams = new URLSearchParams(search);
    const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

    const hasCode = searchParams.has('code');
    const hasTokenHash = searchParams.has('token_hash') || hashParams.has('token_hash');
    const hasAccessToken = hashParams.has('access_token');
    const hasRefreshToken = hashParams.has('refresh_token');
    const isPasswordRecovery = hashParams.get('type') === 'recovery';

    if (hasCode || hasTokenHash || hasAccessToken || hasRefreshToken || isPasswordRecovery) {
      const destination = `/auth/callback${search}${hash}`;
      window.location.replace(destination);
    }
  }, []);

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
