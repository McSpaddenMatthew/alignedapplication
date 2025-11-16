'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

export default function LogoutButton({ className = '' }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();

    const secureFlag = window.location.protocol === 'https:' ? 'Secure; ' : '';
    document.cookie = `sb-access-token=; Max-Age=0; Path=/; ${secureFlag}SameSite=Lax`;
    document.cookie = `sb-refresh-token=; Max-Age=0; Path=/; ${secureFlag}SameSite=Lax`;

    router.push('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? 'Signing out…' : 'Logout'}
    </button>
  );
}
