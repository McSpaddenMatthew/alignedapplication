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
    // Grab the stuff after the # in the URL
    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.substring(1)
      : window.location.hash;

    const params = new URLSearchParams(hash);

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({ access_token, refresh_token })
        .then(() => {
          router.replace("/dashboard");
        })
        .catch((error) => {
          console.error("Error setting session:", error);
          router.replace("/login");
        });
    } else {
      // If no tokens, just send them back to login
      router.replace("/login");
    }
  }, [router]);

  return <p>Loading…</p>;
}
