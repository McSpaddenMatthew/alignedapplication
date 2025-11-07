import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { getSiteUrl } from '../lib/getSiteUrl';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const siteUrl = getSiteUrl();
      const emailForRedirect = email.trim();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('aligned:last-login-email', emailForRedirect);
      }

      let redirectUrl: string;
      try {
        const url = new URL('/auth/callback', siteUrl);
        if (emailForRedirect) {
          url.searchParams.set('login_email', emailForRedirect);
        }
        url.searchParams.set('redirect_origin', siteUrl);
        redirectUrl = url.toString();
      } catch (error) {
        const params = new URLSearchParams();
        if (emailForRedirect) {
          params.set('login_email', emailForRedirect);
        }
        params.set('redirect_origin', siteUrl.replace(/\/$/, ''));
        const query = params.toString();
        redirectUrl = `${siteUrl.replace(/\/$/, '')}/auth/callback${query ? `?${query}` : ''}`;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: emailForRedirect,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      setMessage('Magic link sent. Redirecting…');
      setEmail('');
      setTimeout(() => {
        const params = new URLSearchParams();
        if (emailForRedirect) {
          params.set('email', emailForRedirect);
        }
        const query = params.toString();
        router.push(query ? `/magic-link?${query}` : '/magic-link');
      }, 400);
    } catch (err: any) {
      setMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-xl p-10 mt-14 border border-gray-100">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">Step 1</p>
        <h1 className="text-3xl font-bold text-primary mb-4">Access your operating partner workspace</h1>
        <p className="text-gray-700 mb-6">
          We authenticate with a secure magic link. Enter the email you use with Aligned to receive instant access.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
            placeholder="you@firm.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white rounded-lg px-4 py-3 font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
          >
            {loading ? 'Sending link…' : 'Email me the magic link'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        <div className="mt-8 text-sm text-gray-500">
          <p className="font-semibold text-gray-600">What happens next?</p>
          <ol className="list-decimal pl-5 space-y-1 mt-2">
            <li>Open the email titled <strong>“Your Aligned access link”</strong>.</li>
            <li>Click the button to confirm it’s you.</li>
            <li>We’ll drop you straight into your private dashboard.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
