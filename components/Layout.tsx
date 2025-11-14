import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="rounded-md bg-primary text-white px-2 py-1 text-sm font-semibold">Aligned</span>
              <span className="text-sm text-gray-600 hidden sm:block">Story-led recruiting OS</span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link href="/#plan" className="text-gray-600 hover:text-primary transition">
              Plan
            </Link>
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container py-6 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>© {new Date().getFullYear()} Aligned. Built for evidence-first recruiting.</div>
          <div className="flex gap-4">
            <a href="mailto:mason@weldrecruiting.co" className="hover:underline">
              Contact
            </a>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
