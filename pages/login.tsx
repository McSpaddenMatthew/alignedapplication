import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import {
  buildDashboardRedirectUrl,
  buildMagicLinkRedirectUrl,
  performDashboardRedirect,
} from '../lib/dashboardRedirect';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingMagicLink, setProcessingMagicLink] = useState(false);
  const router = useRouter();

  const redirectToDashboard = useCallback(async () => {
    const dashboardUrl = buildDashboardRedirectUrl();
    await performDashboardRedirect(router, dashboardUrl);
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    const flagPendingMagicLink = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;

      if (!hash) return;

      const params = new URLSearchParams(hash.replace('#', ''));
      const errorDescription = params.get('error_description');

      if (errorDescription) {
        if (isMounted) setMessage(errorDescription);
        return;
      }

      if (params.get('access_token') && params.get('refresh_token')) {
        if (isMounted) {
          setProcessingMagicLink(true);
          setMessage('Logging you in…');
        }
      }
    };

    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        if (isMounted) {
          setProcessingMagicLink(true);
          setMessage('Redirecting to your dashboard…');
        }
        await redirectToDashboard();
      }
    };

    flagPendingMagicLink();
    void checkExistingSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session) {
        setProcessingMagicLink(true);
        setMessage('Redirecting to your dashboard…');
        void redirectToDashboard();
      }

      if (event === 'SIGNED_OUT') {
        setProcessingMagicLink(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [redirectToDashboard, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const redirectTarget = buildMagicLinkRedirectUrl();
      const fallbackTarget =
        redirectTarget || (typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: fallbackTarget ? { emailRedirectTo: fallbackTarget } : undefined,
      });
      if (error) throw error;
      setMessage('Check your email for the login link.');
    } catch (err: any) {
      setMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mt-10 space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Enter the story room</p>
          <h1 className="text-3xl font-bold text-primary">Log in with your email</h1>
          <p className="text-gray-700">
            We use a passwordless magic link so every recruiter lands in their own dashboard. No passwords to forget—just the
            story you are building.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Work email</label>
            <input
              type="email"
              required
              className="w-full border rounded-lg px-3 py-2"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || processingMagicLink}
            />
          </div>
          <button
            type="submit"
            disabled={loading || processingMagicLink}
            className="w-full bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            {loading ? 'Sending link…' : processingMagicLink ? 'Completing login…' : 'Send magic link'}
          </button>
        </form>

        <div className="text-sm text-gray-600 space-y-1">
          <p>No email yet? Give it a minute—links arrive fast but not instant.</p>
          <p>
            After you click the link, we bring you back here just long enough to confirm the session, then move you straight into
            your dashboard.
          </p>
        </div>

        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
