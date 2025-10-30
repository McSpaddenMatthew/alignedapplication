import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [processingMagicLink, setProcessingMagicLink] = useState(false);
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
      if (!hash) return;

      const params = new URLSearchParams(hash.replace('#', ''));
      const errorDescription = params.get('error_description');
      if (errorDescription) {
        if (isMounted) setMessage(errorDescription);
        clearUrlHash();
        return;
      }

      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (!accessToken || !refreshToken) return;

      try {
        if (isMounted) {
          setProcessingMagicLink(true);
          setMessage('Logging you in…');
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        clearUrlHash();
        router.replace('/dashboard');
      } catch (err: any) {
        if (isMounted) setMessage(err.message || 'Login failed.');
      } finally {
        if (isMounted) setProcessingMagicLink(false);
      }
    };

    const checkExistingSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace('/dashboard');
      }
    };

    handleHashSession().then(checkExistingSession);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined,
        }
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
