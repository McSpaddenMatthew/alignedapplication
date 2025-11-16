'use client';

import { useRouter } from 'next/navigation';
import { createBrowserClient } from '../lib/supabaseClient';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient();
    await supabase.auth.signOut();
    router.replace('/login');
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-3 py-2 rounded-lg border text-sm font-semibold hover:bg-gray-50"
    >
      Logout
    </button>
  );
}
