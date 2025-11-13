import { useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export default function AuthCallback() {
  const router = useRouter();
  const { replace } = router;

  useEffect(() => {
    async function handleSession() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        const errorDescription = url.searchParams.get("error_description");

        if (errorDescription) {
          throw new Error(errorDescription);
        }

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) {
            throw error;
          }

          replace("/dashboard");
          return;
        }

        const hashParams = new URLSearchParams(url.hash.slice(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashError = hashParams.get("error_description");

        if (hashError) {
          throw new Error(hashError);
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          replace("/dashboard");
          return;
        }

        throw new Error("No auth session found in callback URL.");
      } catch (error) {
        console.error("Error handling auth callback:", error);
        replace("/login");
      }
    }

    void handleSession();
  }, [replace]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </main>
  );
}
