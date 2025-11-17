import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabaseClient } from "../lib/supabaseClient";

interface SummaryRow {
  id: string;
  title: string | null;
  status: string | null;
  created_at: string | null;
}

export default function HistoryPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
          error: userError,
        } = await supabaseClient.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          router.replace("/login");
          return;
        }

        const { data, error: summariesError } = await supabaseClient
          .from("summaries")
          .select("id, title, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (summariesError) throw summariesError;

        setSummaries((data as SummaryRow[]) || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Unable to load history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [router]);

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-4">History</h1>
        <p className="text-sm text-slate-600">Loading your summaries…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-4">History</h1>
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          Back to dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">History</h1>
          <p className="text-sm text-slate-500">
            All summaries you’ve created, newest first.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
        >
          Back to dashboard
        </Link>
      </header>

      {summaries.length === 0 ? (
        <p className="text-sm text-slate-500">
          You haven’t created any summaries yet. Head to the dashboard and
          make your first one.
        </p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Title</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
                <th className="text-left px-4 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((summary) => (
                <tr key={summary.id} className="border-t">
                  <td className="px-4 py-2">
                    <Link
                      href={`/summary/${summary.id}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {summary.title || "Untitled summary"}
                    </Link>
                  </td>
                  <td className="px-4 py-2">
                    {summary.status ?? "unknown"}
                  </td>
                  <td className="px-4 py-2">
                    {summary.created_at
                      ? new Date(summary.created_at).toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
