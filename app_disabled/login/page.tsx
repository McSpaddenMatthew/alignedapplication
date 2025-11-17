'use client';

import { FormEvent, useEffect, useState } from 'react';
import { createClient } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('aligned_full_name');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    const supabase = createClient();
    localStorage.setItem('aligned_full_name', fullName);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message);
      return;
    }

    setStatus('sent');
    setMessage('Check your email for a magic link.');
  };

  return (
    <div className="flex items-center justify-center py-10">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-8">
        <h1 className="text-2xl font-semibold text-center mb-2">Sign in to Aligned</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your details and we will send a magic link to your email.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Taylor Recruiter"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-ink"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending magic link…' : 'Send magic link'}
          </button>
        </form>
        {message && <p className="text-center text-sm text-green-600 mt-4">{message}</p>}
        {status === 'error' && !message && (
          <p className="text-center text-sm text-red-600 mt-4">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs text-gray-500 text-center mt-4">
          We store your full name in localStorage temporarily so we can upsert your profile after login.
        </p>
      </div>
    </div>
  );
}
