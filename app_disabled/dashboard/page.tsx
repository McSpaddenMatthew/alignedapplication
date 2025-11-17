"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import LogoutButton from "../../../components/LogoutButton";

interface SummaryRow {
  id: string;
  title: string | null;
  status: string | null;
  created_at: string | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardPage() {
  const router = useRouter();
  const [summaries, setSummaries] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        // Ensure user is logged in
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;

        if (!user) {
          router.replace("/login");
          return;
        }

        // Load this user's summaries
        const { data, error: summariesError } = await supabase
          .from("summaries")
          .select("id, title, status, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (summariesError) throw summariesError;

        setSummaries((data as SummaryRow[]) || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message ?? "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-600">Loading your summaries…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm"
          >
            Go to login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your summaries</h1>
          <p className="text-sm text-slate-500">
            Create and manage decision-ready reports for your hiring managers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/summary/new"
            className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium"
          >
            + New summary
          </Link>
          <LogoutButton />
        </div>
      </header>

      {summaries.length === 0 ? (
        <p className="text-sm text-slate-500">
          No summaries yet. Click <strong>New summary</strong> to get started.
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
