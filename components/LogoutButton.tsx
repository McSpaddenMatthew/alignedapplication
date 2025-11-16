"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();

    document.cookie = "sb-access-token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "sb-refresh-token=; path=/; max-age=0; SameSite=Lax";

    router.replace("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Log out"}
    </button>
  );
}
