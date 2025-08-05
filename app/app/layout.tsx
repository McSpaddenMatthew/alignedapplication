import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Aligned – Built for Recruiters. Trusted by Hiring Managers.",
  description: "Aligned gives you shareable, trust-building candidate summaries to speed up every hire.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 font-sans">{children}</body>
    </html>
  );
}
