import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

const computeDashboardRedirect = () => {
  const envRedirect = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL;

  if (envRedirect) {
    try {
      const url = new URL(envRedirect);
      if (!url.pathname || url.pathname === '/') {
        url.pathname = '/dashboard';
      }
      return url.toString();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Invalid NEXT_PUBLIC_SUPABASE_REDIRECT_URL, using window origin fallback', error);
      // Fallback to window origin below if available.
    }
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}/dashboard`;
  }

  return undefined;
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingMagicLink, setProcessingMagicLink] = useState(false);
  const router = useRouter();

  const redirectToDashboard = useCallback(async () => {
    try {
      await router.replace('/dashboard');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Next router failed to redirect to dashboard from login', error);
    }

    if (typeof window !== 'undefined' && window.location.pathname !== '/dashboard') {
      const dashboardUrl = new URL('/dashboard', window.location.origin).toString();
      window.location.assign(dashboardUrl);
    }
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
      const redirectTarget = computeDashboardRedirect();

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTarget || undefined,
        },
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8 mt-10">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">On this page you will…</p>
        <h1 className="text-2xl font-bold mb-4">Log in with your email</h1>
        <p className="text-gray-700 mb-6">We use a magic link for passwordless login. Enter your email and check your inbox.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            className="w-full border rounded-lg px-3 py-2"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || processingMagicLink}
          />
          <button
            type="submit"
            disabled={loading || processingMagicLink}
            className="w-full bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            {loading ? 'Sending link…' : processingMagicLink ? 'Completing login…' : 'Send magic link'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
