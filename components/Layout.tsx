import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-white shadow-sm">Aligned</div>
            <span className="hidden text-sm text-gray-500 sm:inline">Evidence-first recruiter reports</span>
          </Link>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
            <a href="#investor-sample" className="hidden hover:text-primary sm:inline">
              Product
            </a>
            <a href="mailto:mason@weldrecruiting.co" className="hidden hover:text-primary sm:inline">
              Talk to us
            </a>
            <Link href="/login" className="hover:text-primary">
              Login
            </Link>
            <Link
              href="/login"
              className="rounded-full bg-accent px-4 py-2 text-white shadow transition hover:bg-accent/90"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-100 bg-white">
        <div className="container flex flex-col gap-2 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} Aligned. Built for recruiters and operating partners.</div>
          <div className="flex gap-4">
            <a href="mailto:mason@weldrecruiting.co" className="hover:text-primary">Contact</a>
            <Link href="/login" className="hover:text-primary">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
