import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { supabase } from '../../lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'exchanging' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const codeParam = router.query.code;
  const errorDescriptionParam = router.query.error_description;

  useEffect(() => {
    if (!router.isReady || status !== 'idle') return;

    const code = typeof codeParam === 'string' ? codeParam : undefined;
    const errorDescription =
      typeof errorDescriptionParam === 'string' ? errorDescriptionParam : undefined;

    if (errorDescription) {
      setStatus('error');
      setErrorMessage(errorDescription);
      return;
    }

    if (!code) {
      setStatus('error');
      setErrorMessage('The login link is missing a code. Please request a new one.');
      return;
    }

    const exchange = async () => {
      setStatus('exchanging');
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        setStatus('error');
        setErrorMessage(error.message || 'We could not finish signing you in.');
        return;
      }

      router.replace('/dashboard').catch((err) => {
        setStatus('error');
        setErrorMessage(err.message || 'We could not redirect you to the dashboard.');
      });
    };

    void exchange();
  }, [codeParam, errorDescriptionParam, router, router.isReady, status]);

  const title = status === 'error' ? 'Login issue' : 'Signing you in…';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mt-10 text-center">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Hold tight…</p>
          <h1 className="text-2xl font-bold mb-4">{status === 'error' ? 'We hit a snag' : 'Signing you in'}</h1>
          {status === 'error' ? (
            <>
              <p className="text-gray-700 mb-6">{errorMessage}</p>
              <Link href="/login" className="text-accent font-semibold">
                Back to login
              </Link>
            </>
          ) : (
            <p className="text-gray-700">We&apos;re finishing the login process and will redirect you to your dashboard.</p>
          )}
        </div>
      </div>
    </>
  );
}
