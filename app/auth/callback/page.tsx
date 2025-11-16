"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function handleMagicLink() {
      try {
        // 1) Newer Supabase flow: ?code= in the query string
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          router.replace("/dashboard");
          return;
        }

        // 2) Older flow: #access_token=... in the hash fragment
        const hash = window.location.hash;
        if (hash && hash.startsWith("#")) {
          const params = new URLSearchParams(hash.slice(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) throw error;
            router.replace("/dashboard");
            return;
          }
        }

        setStatus("error");
        setMessage("No auth token found in callback URL.");
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        setMessage(err.message ?? "There was a problem completing sign-in.");
      }
    }

    handleMagicLink();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">
          Finishing sign-in… please wait.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-2">
        <p className="text-sm text-red-600">
          {message ?? "Sign-in could not be completed."}
        </p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-2 inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          Back to login
        </button>
      </div>
    </main>
  );
}
