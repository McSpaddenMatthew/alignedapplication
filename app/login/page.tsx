import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-xl p-8 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Login (MVP Stub)
        </h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          This is a temporary login page so the /login route works. 
          We will replace this with real Supabase magic-link auth soon.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="text-sm font-medium underline underline-offset-4"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
