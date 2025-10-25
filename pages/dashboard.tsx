import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

type SummaryRow = {
  id: string;
  job_title: string | null;
  candidate_name: string | null;
  created_at: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<SummaryRow[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadUser = async () => {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError) {
        setError('Unable to authenticate.');
        setLoading(false);
        return;
      }
      const user = data?.user;
      if (!user) {
        router.replace('/login');
        return;
      }
      if (!isMounted) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);
    };
    loadUser();
    return () => {
      isMounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    const fetchSummaries = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('summaries')
        .select('id, job_title, candidate_name, created_at')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

      if (!active) return;

      if (fetchError) {
        setError('We had trouble loading your candidates. Please ensure the summaries table has an owner_id column.');
        setSummaries([]);
      } else {
        setSummaries(data ?? []);
      }
      setLoading(false);
    };

    fetchSummaries();

    const channel = supabase
      .channel(`summaries-owner-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'summaries', filter: `owner_id=eq.${userId}` },
        () => {
          fetchSummaries();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const formatter = useMemo(() => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }), []);

  return (
    <div className="container">
      <div className="bg-white rounded-2xl shadow-xl p-10 mt-12 border border-gray-100">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">Dashboard</p>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome back{userEmail ? `, ${userEmail}` : ''}</h1>
            <p className="text-gray-700">
              Every candidate you and your recruiters submit appears here. Each record stays private to your login.
            </p>
          </div>
          <Link href="/submit" className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition">
            Create new summary
          </Link>
        </div>

        {loading && <p className="text-gray-600">Loading your candidates…</p>}
        {error && <p className="text-red-600 font-medium mt-4">{error}</p>}

        {!loading && !error && summaries.length === 0 && (
          <div className="bg-soft border border-dashed border-primary/40 rounded-xl p-8 text-center text-gray-600">
            <p className="text-lg font-semibold text-primary mb-2">No candidates yet</p>
            <p className="mb-4">Once you or your recruiters submit a candidate, they’ll appear here with their latest update.</p>
            <Link href="/submit" className="text-primary font-semibold underline">
              Create your first summary
            </Link>
          </div>
        )}

        {!loading && !error && summaries.length > 0 && (
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-soft text-sm uppercase tracking-wide text-left text-gray-600">
                <tr>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {summaries.map((summary) => (
                  <tr key={summary.id} className="hover:bg-soft/70 transition">
                    <td className="px-6 py-4 font-semibold text-primary">
                      {summary.candidate_name || 'Unnamed candidate'}
                    </td>
                    <td className="px-6 py-4">{summary.job_title || 'Not provided'}</td>
                    <td className="px-6 py-4">
                      {formatter.format(new Date(summary.created_at))}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/summary/${summary.id}`} className="text-primary font-semibold hover:underline">
                        View summary
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
