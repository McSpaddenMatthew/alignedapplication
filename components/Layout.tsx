// components/Layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 hidden md:flex flex-col justify-between">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">Aligned</h2>
          <nav className="flex flex-col gap-4">
            <Link href="/" className="text-sm hover:text-blue-600">Dashboard</Link>
            <Link href="/candidates" className="text-sm hover:text-blue-600">Candidates</Link>
            <Link href="/settings" className="text-sm hover:text-blue-600">Settings</Link>
          </nav>
        </div>
        <div className="p-6">
          <p className="text-xs text-gray-400">&copy; 2025 Aligned</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex flex-col flex-1">
        {/* Top Navigation */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h1 className="text-xl font-semibold">Welcome Back</h1>
          <button
            className="text-sm text-red-500 hover:underline"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.clear();
                window.location.href = '/login';
              }
            }}
          >
            Logout
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
