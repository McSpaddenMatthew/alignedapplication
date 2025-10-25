import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { completeSupabaseSignIn, GENERIC_ERROR } from '../../lib/completeSupabaseSignIn';

type Status = 'initialising' | 'success' | 'error';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('initialising');
  const [message, setMessage] = useState('Confirming your access…');

  useEffect(() => {
    if (!router.isReady) return;

    const handleSessionExchange = async () => {
      try {
        await completeSupabaseSignIn();

        setStatus('success');
        setMessage('You are signed in. Redirecting to your dashboard…');

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
  }, [router]);

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

