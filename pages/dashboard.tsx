import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function DashboardPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [nameToShow, setNameToShow] = useState<string>("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) throw authError;

        const user = authData?.user;

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        setNameToShow(profile?.full_name || profile?.email || user.email || "");

        const { data, error: summariesError } = await supabase
          .from("summaries")
          .select("id, candidate_name, candidate_title, role_title, status, created_at")
          .eq("created_by", user.id)
          .order("created_at", { ascending: false });

        if (summariesError) throw summariesError;

        setSummaries((data as any[]) || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unable to load your dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4 space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-slate-600">Loading your dashboard…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4 space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={() => router.reload()}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          Retry
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">Welcome back</p>
          <h1 className="text-2xl font-semibold">{nameToShow || "Dashboard"}</h1>
        </div>
      </header>

      <div className="flex flex-wrap gap-3 mb-2">
        <Link
          href="/summary/new"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
        >
          Create new summary
        </Link>
        <Link
          href="/history"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          View history
        </Link>
      </div>

      <div className="flex justify-between items-center bg-white shadow rounded-xl p-4">
        <div>
          <h2 className="text-lg font-semibold">Your candidate summaries</h2>
          <p className="text-sm text-gray-600">Create and track summaries you have generated.</p>
        </div>
        <Link
          href="/summary/new"
          className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary"
        >
          Create New Summary
        </Link>
      </div>

      {!summaries || summaries.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-center text-gray-600">
          You don’t have any summaries yet. Click “Create New Summary” to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary) => (
            <Link
              key={summary.id}
              href={`/summary/${summary.id}`}
              className="block bg-white shadow rounded-xl p-4 hover:border-accent border border-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{summary.role_title}</p>
                  <h3 className="text-lg font-semibold">
                    {summary.candidate_name || "Unnamed candidate"}
                    {summary.candidate_title ? ` · ${summary.candidate_title}` : ""}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Created {summary.created_at ? new Date(summary.created_at).toLocaleString() : ""}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 border text-gray-800 capitalize">
                  {summary.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
