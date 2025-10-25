import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/login', label: 'Login' }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isLanding = router.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-soft text-ink">
      <nav className="bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary text-white px-3 py-1 text-sm font-semibold tracking-wide uppercase">
              Aligned
            </div>
            <span className="text-sm text-gray-600 hidden sm:block">
              Decision intelligence for operating partners and the recruiters who support them.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-primary transition ${router.pathname === link.href ? 'text-primary' : 'text-gray-600'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className={`flex-1 ${isLanding ? 'bg-gradient-to-br from-white via-soft to-white' : ''}`}>{children}</main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="container py-6 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>© {new Date().getFullYear()} Aligned</div>
          <div className="flex gap-4">
            <a href="mailto:mason@weldrecruiting.co" className="hover:text-primary transition">
              Contact
            </a>
            <Link href="/login" className="hover:text-primary transition">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
