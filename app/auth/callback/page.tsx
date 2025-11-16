"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../lib/supabaseClient";

function persistSessionToCookies(session: {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
}) {
  const isSecure = window.location.protocol === "https:";
  const maxAge = session.expires_in ?? 60 * 60;

  document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; ${isSecure ? "Secure;" : ""} SameSite=Lax`;
  document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${60 * 60 * 24 * 7}; ${isSecure ? "Secure;" : ""} SameSite=Lax`;
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [status, setStatus] = useState("Completing sign-in...");
  const [error, setError] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const handleAuth = async () => {
      setStatus("Finalizing your session...");

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const code = searchParams.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (code) {
        const { error: exchangeError, data } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }
        if (data.session) {
          persistSessionToCookies({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          });
        }
      } else if (accessToken && refreshToken) {
        const { data, error: setErrorResult } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (setErrorResult) {
          setError(setErrorResult.message);
          return;
        }

        if (data.session) {
          persistSessionToCookies({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in,
          });
        }
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          setError("No session was returned from Supabase. Please try signing in again.");
          return;
        }
      }

      setStatus("Preparing your profile...");

      const fullNameFromParams = searchParams.get("full_name") || hashParams.get("full_name");
      const storedName = typeof window !== "undefined" ? localStorage.getItem("aligned_full_name") : null;
      const preferredName = fullNameFromParams || storedName || null;

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setError(userError?.message || "No user returned after authentication.");
        return;
      }

      const user = userData.user;
      const { error: profileError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          full_name: preferredName || (user.user_metadata as Record<string, string | undefined>)?.full_name || "",
          email: user.email || "",
        },
        { onConflict: "id" }
      );

      if (profileError) {
        setError(profileError.message);
        return;
      }

      if (storedName) {
        localStorage.removeItem("aligned_full_name");
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        persistSessionToCookies({
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_in: sessionData.session.expires_in,
        });
      }

      setStatus("Redirecting to your dashboard...");
      router.replace("/dashboard");
    };

    void handleAuth();
  }, [router, searchParamsString, supabase]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 w-full max-w-md text-center">
        <p className="text-lg font-semibold mb-2">{status}</p>
        {error ? (
          <p className="text-sm text-red-700">{error}</p>
        ) : (
          <p className="text-sm text-slate-600">
            This page will close once your session is confirmed. If nothing happens, return to the login page and
            request a new magic link.
          </p>
        )}
      </div>
    </main>
  );
}
