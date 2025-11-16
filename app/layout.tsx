import "../styles/globals.css";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-[Inter,system-ui,sans-serif] bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
