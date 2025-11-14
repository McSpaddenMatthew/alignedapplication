// pages/login.tsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // 🔥 YOUR CALLBACK ROUTE
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 border rounded-lg shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign in to Aligned</h1>

        {status === "sent" ? (
          <p className="text-center text-green-600">
            A magic link has been sent to <strong>{email}</strong>.  
            Check your inbox to continue.
          </p>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full border rounded px-3 py-2"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {status === "loading" ? "Sending magic link…" : "Send magic link"}
            </button>

            {status === "error" && (
              <p className="text-red-600 text-center mt-2">
                Error: {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
    </main>
  );
}

