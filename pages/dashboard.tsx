import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

interface SummaryRecord {
  id: string;
  job_title: string | null;
  candidate_name: string | null;
  created_at: string | null;
}

export default function Dashboard() {
  const [summaries, setSummaries] = useState<SummaryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) throw authError;
      if (!user) {
        setSummaries([]);
        setUserEmail(null);
        setError('Log in to view your personalized dashboard.');
        return;
      }

      setUserEmail(user.email ?? null);

      const { data, error: summariesError } = await supabase
        .from('summaries')
        .select('id, job_title, candidate_name, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (summariesError) throw summariesError;

      setSummaries((data as SummaryRecord[]) ?? []);
    } catch (err: any) {
      setSummaries([]);
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const safeLoad = async () => {
      if (!isMounted) return;
      await loadDashboard();
    };

    void safeLoad();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session) {
        void loadDashboard();
      } else {
        setSummaries([]);
        setUserEmail(null);
        setError('Log in to view your personalized dashboard.');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadDashboard]);

  const hasSummaries = summaries.length > 0;

  const greeting = useMemo(() => {
    if (userEmail) {
      const namePart = userEmail.split('@')[0];
      return `Welcome back, ${namePart}`;
    }
    return 'Welcome back';
  }, [userEmail]);

  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Your dashboard</p>
          <h1 className="text-3xl font-bold text-primary">{greeting}</h1>
          <p className="text-gray-700">
            This space belongs to you. Each summary, candidate, and workflow is tied to your account, so you always know what
            story is live with a hiring manager.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Link href="/submit" className="bg-accent text-white rounded-lg px-4 py-6 text-center font-semibold shadow">
            Create new summary
          </Link>
          <Link
            href="/history"
            className="bg-white border border-accent text-accent rounded-lg px-4 py-6 text-center font-semibold"
          >
            Review history
          </Link>
          <Link
            href="/settings"
            className="bg-white border border-gray-200 text-primary rounded-lg px-4 py-6 text-center font-semibold"
          >
            Configure settings
          </Link>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Active candidate stories</h2>
            <p className="text-gray-600 text-sm">
              Only you see the records linked to your login. Start a new summary and it appears here automatically.
            </p>
          </div>

          {loading && <p className="text-gray-700">Loading your candidates…</p>}
          {!loading && error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && !hasSummaries && (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-600">
              <p className="font-semibold text-primary mb-2">No stories yet</p>
              <p className="mb-4">When you submit a candidate, the dashboard keeps it here with job context and share links.</p>
              <Link href="/submit" className="inline-flex items-center justify-center px-4 py-2 bg-accent text-white rounded-lg">
                Start your first summary
              </Link>
            </div>
          )}

          {!loading && !error && hasSummaries && (
            <ul className="space-y-3">
              {summaries.map((summary) => {
                const createdAt = summary.created_at
                  ? new Date(summary.created_at)
                  : null;
                const formattedDate = createdAt
                  ? new Intl.DateTimeFormat('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(createdAt)
                  : 'Recently created';

                return (
                  <li key={summary.id} className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-primary">
                        {summary.candidate_name || 'Unnamed candidate'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {summary.job_title ? `${summary.job_title}` : 'Role TBD'} • {formattedDate}
                      </p>
                    </div>
                    <Link
                      href={`/summary/${summary.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                    >
                      View summary
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
