"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkExistingSession = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      }
    };

    void checkExistingSession();
  }, [router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();

    try {
      const redirectTo = `${window.location.origin}/auth/callback?full_name=${encodeURIComponent(fullName)}`;
      localStorage.setItem("aligned_full_name", fullName);

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        setMessage("Check your email for a magic link to continue.");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to send magic link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-sm border border-slate-200 rounded-lg p-8">
        <h1 className="text-2xl font-semibold mb-2">Welcome back to Aligned</h1>
        <p className="text-slate-600 mb-6">
          Enter your email to receive a magic link. We&apos;ll create your profile when you sign in.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700"
              placeholder="Alex Doe"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-700"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-slate-900 text-white py-2 px-4 font-semibold hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Sending magic link..." : "Send magic link"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-700">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    </main>
  );
}
