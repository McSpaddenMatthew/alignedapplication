// pages/auth/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // Grab everything after the # from the Supabase redirect
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => {
          const secureFlag = window.location.protocol === "https:" ? "Secure; " : "";
          const maxAge = 60 * 60 * 24 * 7; // one week

          document.cookie = `sb-access-token=${access_token}; Max-Age=${maxAge}; Path=/; ${secureFlag}SameSite=Lax`;
          document.cookie = `sb-refresh-token=${refresh_token}; Max-Age=${maxAge}; Path=/; ${secureFlag}SameSite=Lax`;

          router.replace("/dashboard");
        })
        .catch((error) => {
          console.error("Error setting session:", error);
          router.replace("/login");
        });
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </main>
  );
}
