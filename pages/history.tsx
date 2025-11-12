import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

type SummaryHistory = {
  id: string;
  job_title: string | null;
  candidate_name: string | null;
  created_at: string | null;
};

export default function History() {
  const [items, setItems] = useState<SummaryHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          setError('Log in to see your submission history.');
          setItems([]);
          return;
        }

        const { data, error: historyError } = await supabase
          .from('summaries')
          .select('id, job_title, candidate_name, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (historyError) throw historyError;
        if (!isMounted) return;
        setItems((data as SummaryHistory[]) ?? []);
      } catch (err: any) {
        if (!isMounted) return;
        setItems([]);
        setError(err.message || 'Unable to load history.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">History</p>
          <h1 className="text-2xl font-bold text-primary">Your submitted candidate stories</h1>
          <p className="text-gray-700">
            Every record here belongs to your login. Use it to re-open summaries or duplicate a winning playbook.
          </p>
        </div>

        {loading && <p className="text-gray-700">Loading…</p>}
        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-gray-600">No submissions yet. Start with a new summary.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="font-semibold text-primary">{item.candidate_name || 'Unnamed candidate'}</p>
                  <p className="text-sm text-gray-600">{item.job_title || 'Role TBD'}</p>
                </div>
                <Link href={`/summary/${item.id}`} className="inline-flex items-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                  View summary
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
