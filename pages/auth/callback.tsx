import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import {
  completeSupabaseSignIn,
  GENERIC_ERROR,
  LOGIN_EMAIL_REQUIRED
} from '../../lib/completeSupabaseSignIn';

type Status = 'initialising' | 'success' | 'error' | 'needs-email';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState<Status>('initialising');
  const [message, setMessage] = useState('Confirming your access…');
  const [emailInput, setEmailInput] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const prefilledEmail = useMemo(() => {
    if (typeof window === 'undefined') return '';
    try {
      return window.localStorage.getItem('aligned:last-login-email') || '';
    } catch (error) {
      return '';
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const handleSessionExchange = async () => {
      try {
        const result = await completeSupabaseSignIn();
        if (result.redirected) {
          return;
        }

        setStatus('success');
        setMessage('You are signed in. Redirecting to your dashboard…');

        setTimeout(() => {
          router.replace('/dashboard');
        }, 600);
      } catch (err: any) {
        if (err?.code === LOGIN_EMAIL_REQUIRED) {
          setStatus('needs-email');
          setMessage('Enter the email that requested this link to finish signing in.');
          setEmailInput(prefilledEmail);
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
  }, [prefilledEmail, router]);

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await completeSupabaseSignIn({ email: emailInput });
      if (result.redirected) {
        return;
      }
      setStatus('success');
      setMessage('You are signed in. Redirecting to your dashboard…');
      setTimeout(() => {
        router.replace('/dashboard');
      }, 600);
    } catch (err: any) {
      if (err?.code === LOGIN_EMAIL_REQUIRED) {
        setSubmitError('That email did not match this magic link. Try again or request a new link.');
      } else {
        setStatus('error');
        setMessage(err?.message || GENERIC_ERROR);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl p-10 mt-16 border border-gray-100 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-3">Step 3</p>
        <h1 className="text-3xl font-bold text-primary mb-4">
          {status === 'success' ? 'Signed in' : 'Finishing sign-in'}
        </h1>
        <p className="text-gray-700 leading-relaxed">{message}</p>

        {status === 'needs-email' && (
          <form onSubmit={handleEmailSubmit} className="mt-6 text-left space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                Email used to request access
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="you@firm.com"
                value={emailInput}
                onChange={(event) => setEmailInput(event.target.value)}
              />
            </div>
            {submitError && <p className="text-sm text-red-600">{submitError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-white rounded-lg px-4 py-3 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
            >
              {submitting ? 'Confirming…' : 'Finish sign-in'}
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

