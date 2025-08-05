// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Aligned – Build Trust with Every Candidate",
  description: "The AI sourcing tool that builds hiring manager trust through clarity and transparency.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


