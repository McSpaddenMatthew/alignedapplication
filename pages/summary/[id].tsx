import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

type SummaryRecord = {
  id: string;
  job_title: string | null;
  candidate_name: string | null;
  hm_notes: string | null;
  jd_text: string | null;
  market_notes: string | null;
  recruiter_notes: string | null;
  created_at: string;
};

export default function SummaryDetail() {
  const router = useRouter();
  const rawId = router.query.id;
  const summaryId = useMemo(() => {
    if (Array.isArray(rawId)) return rawId[0];
    return rawId ?? null;
  }, [rawId]);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!summaryId) return;

    let active = true;
    const fetchSummary = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) {
        router.replace('/login');
        return;
      }

      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('summaries')
        .select('id, job_title, candidate_name, hm_notes, jd_text, market_notes, recruiter_notes, created_at, owner_id')
        .eq('id', summaryId)
        .eq('owner_id', user.id)
        .single();

      if (!active) return;

      if (fetchError) {
        setError('We could not find that summary for your account.');
        setSummary(null);
      } else {
        setSummary(data as SummaryRecord);
      }
      setLoading(false);
    };

    fetchSummary();

    return () => {
      active = false;
    };
  }, [summaryId, router]);

  const createdAt = useMemo(() => {
    if (!summary?.created_at) return null;
    try {
      return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(summary.created_at));
    } catch (error) {
      return summary.created_at;
    }
  }, [summary?.created_at]);

  return (
    <div className="container">
      <div className="bg-white rounded-2xl shadow-xl p-10 mt-12 border border-gray-100">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">Summary</p>
        {loading && <p className="text-gray-600">Loading summary…</p>}
        {error && <p className="text-red-600 font-medium">{error}</p>}

        {!loading && !error && summary && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-6">
              <h1 className="text-3xl font-bold text-primary mb-2">
                {summary.candidate_name || 'Unnamed candidate'}
                {summary.job_title ? ` — ${summary.job_title}` : ''}
              </h1>
              {createdAt && <p className="text-sm text-gray-500">Created {createdAt}</p>}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-2">Hiring manager transcript notes</h2>
                  <div className="bg-soft border border-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">
                    {summary.hm_notes || 'No transcript provided.'}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-2">Job description</h2>
                  <div className="bg-soft border border-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">
                    {summary.jd_text || 'No job description provided.'}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-2">Candidate resume</h2>
                  <div className="bg-soft border border-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">
                    {summary.market_notes || 'No resume details provided.'}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-primary mb-2">Candidate call transcript</h2>
                  <div className="bg-soft border border-gray-100 rounded-lg p-4 text-gray-700 whitespace-pre-line">
                    {summary.recruiter_notes || 'No call transcript provided.'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-gray-700">
              <h2 className="text-lg font-semibold text-primary mb-2">Next steps</h2>
              <p>
                Export this page as a PDF or share the link with your deal team. We’ll soon layer in AI-generated risk, readiness, and outcome highlights tailored to operating partners.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
