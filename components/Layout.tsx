import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Aligned
        </Link>
        <div>
          {session ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      <main className="p-6">{children}</main>
    </div>
  );
}

