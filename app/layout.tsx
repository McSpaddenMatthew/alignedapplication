// app/layout.tsx
export const metadata = {
  title: "Aligned | Built for Recruiters",
  description: "Build trust with hiring managers using clean, shareable candidate reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
