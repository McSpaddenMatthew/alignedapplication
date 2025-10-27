import { useRouter } from 'next/router';
import { useMemo, useCallback } from 'react';

import { getSiteUrl } from '../lib/getSiteUrl';

export default function MagicLinkPage() {
  const router = useRouter();
  const email = useMemo(() => {
    if (!router.query.email) return null;
    const value = Array.isArray(router.query.email) ? router.query.email[0] : router.query.email;
    return decodeURIComponent(value);
  }, [router.query.email]);
  const destination = useMemo(() => `${getSiteUrl()}/auth/callback`, []);
  const launchCallback = useCallback(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams();
    if (email) {
      params.set('login_email', email);
    }
    const query = params.toString();
    window.location.href = query ? `/auth/callback?${query}` : '/auth/callback';
  }, [email]);

  return (
    <div className="container">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 mt-16 border border-gray-100 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-primary/70 mb-3">Step 2</p>
        <h1 className="text-3xl font-bold text-primary mb-4">Check your inbox for the magic link</h1>
        <p className="text-gray-700 leading-relaxed">
          We just sent {email ? <strong>{email}</strong> : 'your email'} a secure sign-in link. Open it on this device and you’ll be in your dashboard within seconds.
        </p>
        <div className="mt-8 text-left bg-soft rounded-xl p-6 border border-gray-100">
          <p className="text-sm font-semibold text-primary mb-2">Having trouble?</p>
          <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
            <li>Search for “Aligned magic link” in your inbox or spam folder.</li>
            <li>
              The link should open <strong>{destination}</strong> and then forward you to the dashboard. If you land somewhere
              else, update your Supabase project’s site URL to this domain.
            </li>
            <li>
              If you landed back on this page,{' '}
              <button onClick={launchCallback} className="text-primary underline">
                finish the sign-in now
              </button>
              .
            </li>
            <li>
              Need the email resent?{' '}
              <button onClick={() => router.push('/login')} className="text-primary underline">
                Go back to login
              </button>
              .
            </li>
            <li>Still stuck? Email <a className="text-primary underline" href="mailto:mason@weldrecruiting.co">mason@weldrecruiting.co</a>.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
