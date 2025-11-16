import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Aligned',
  description: 'Create and manage candidate summaries.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-soft text-ink antialiased">{children}</body>
    </html>
  );
}
