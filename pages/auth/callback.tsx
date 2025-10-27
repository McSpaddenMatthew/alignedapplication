import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { completeSupabaseSignIn, GENERIC_ERROR, MISSING_EMAIL_ERROR_NAME } from '../../lib/completeSupabaseSignIn';

type Status = 'initialising' | 'success' | 'error' | 'needs-email';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('initialising');
  const [message, setMessage] = useState('Confirming your access…');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

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
        if (err?.name === MISSING_EMAIL_ERROR_NAME) {
          setStatus('needs-email');
          setMessage('Enter the email you used to request access so we can finish signing you in.');
          if (typeof window !== 'undefined') {
            const stored = window.localStorage.getItem('aligned:last-login-email');
            if (stored) {
              setEmail(stored);
            }
          }
        } else {
          setStatus('error');
          setMessage(
            err?.message?.includes('Passwordless sign-ins')
              ? 'The magic link must open on the same domain it was requested from. Update the Supabase site URL or request a new link on this device.'
              : err?.message || GENERIC_ERROR
          );
        }
      }
    };

    handleSessionExchange();
  }, [router]);

  const handleManualSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setManualError(null);
    setSubmitting(true);

    try {
      await completeSupabaseSignIn(email.trim());
      setStatus('success');
      setMessage('You are signed in. Redirecting to your dashboard…');
      setTimeout(() => {
        router.replace('/dashboard');
      }, 600);
    } catch (err: any) {
      if (err?.name === MISSING_EMAIL_ERROR_NAME) {
        setManualError('We could not match that email to the login request. Double-check the address and try again.');
      } else {
        setStatus('error');
        setMessage(
          err?.message?.includes('Passwordless sign-ins')
            ? 'The magic link must open on the same domain it was requested from. Update the Supabase site URL or request a new link on this device.'
            : err?.message || GENERIC_ERROR
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 mt-16 border border-gray-100 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-3">Step 3</p>
        <h1 className="text-3xl font-bold text-primary mb-4">{status === 'success' ? 'Signed in' : 'Finishing sign-in'}</h1>
        <p className="text-gray-700 leading-relaxed">{message}</p>

        {status === 'needs-email' && (
          <form onSubmit={handleManualSubmit} className="mt-6 text-left space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="you@firm.com"
              />
            </div>
            {manualError && <p className="text-sm text-red-600">{manualError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-lg px-4 py-3 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
            >
              {submitting ? 'Verifying…' : 'Finish sign-in'}
            </button>
          </form>
        )}

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

