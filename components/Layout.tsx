import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLanding = router.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {/* Simple text logo for now */}
            <div className="rounded-md bg-navy text-white px-2 py-1 text-sm">Aligned</div>
            <span className="text-sm text-gray-600 hidden sm:block">Built for recruiters. Trusted by hiring managers.</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:underline">Home</Link>
            <Link href="/login" className="text-sm hover:underline">Login</Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container py-6 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>© {new Date().getFullYear()} Aligned</div>
          <div className="flex gap-4">
            <a href="mailto:mason@weldrecruiting.co" className="hover:underline">Contact</a>
            <Link href="/login" className="hover:underline">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
