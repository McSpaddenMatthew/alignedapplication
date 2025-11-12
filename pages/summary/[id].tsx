import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

type SummaryDetailRecord = {
  id: string;
  job_title: string | null;
  candidate_name: string | null;
  jd_text: string | null;
  recruiter_notes: string | null;
  hm_notes: string | null;
  market_notes: string | null;
  created_at: string | null;
};

export default function SummaryDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [summary, setSummary] = useState<SummaryDetailRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    let isMounted = true;

    const loadSummary = async () => {
      setLoading(true);
      setError(null);

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) {
          setError('Please log in to view this summary.');
          setSummary(null);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('summaries')
          .select('id, job_title, candidate_name, jd_text, recruiter_notes, hm_notes, market_notes, created_at')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;
        if (!isMounted) return;
        setSummary((data as SummaryDetailRecord) ?? null);
      } catch (err: any) {
        if (!isMounted) return;
        setSummary(null);
        setError(err.message || 'Unable to load summary.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadSummary();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const createdAt = useMemo(() => {
    if (!summary?.created_at) return null;
    const parsed = new Date(summary.created_at);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(parsed);
  }, [summary?.created_at]);

  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10 space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Candidate summary</p>
          <h1 className="text-3xl font-bold text-primary">
            {summary?.candidate_name || 'Candidate'} · {summary?.job_title || 'Role TBD'}
          </h1>
          {createdAt && <p className="text-sm text-gray-500">Created {createdAt}</p>}
        </div>

        {loading && <p className="text-gray-700">Loading summary…</p>}
        {!loading && error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && summary && (
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-2">Job description signals</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {summary.jd_text || 'No JD text captured yet.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-2">Recruiter notes</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {summary.recruiter_notes || 'Add your recruiter intel to bring the story to life.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-2">Hiring manager notes</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {summary.hm_notes || 'Capture the hiring manager’s priorities so the summary stays aligned.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-primary mb-2">Market context</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {summary.market_notes || 'Add market insight or risk mitigations to support the decision.'}
              </p>
            </section>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg font-semibold">
            Back to dashboard
          </Link>
          <Link href="/submit" className="px-4 py-2 bg-accent text-white rounded-lg font-semibold">
            Create another summary
          </Link>
        </div>
      </div>
    </div>
  );
}
