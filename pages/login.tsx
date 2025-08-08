import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? window.location.origin + '/dashboard' : undefined,
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
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            {loading ? 'Sending link…' : 'Send magic link'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
