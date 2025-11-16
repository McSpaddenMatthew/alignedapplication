import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aligned',
  description: 'Aligned candidate summaries',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-soft text-ink font-sans min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <div className="container flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-primary text-white px-2 py-1 text-sm">Aligned</div>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Built for recruiters. Trusted by hiring managers.
                </span>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-200 bg-white">
            <div className="container py-6 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>© {new Date().getFullYear()} Aligned</div>
              <div className="flex gap-4">
                <a href="mailto:mason@weldrecruiting.co" className="hover:underline">
                  Contact
                </a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
