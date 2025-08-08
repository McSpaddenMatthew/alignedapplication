import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Submit() {
  const router = useRouter();

  const [jobTitle, setJobTitle] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [jdText, setJdText] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [hmNotes, setHmNotes] = useState('');
  const [marketNotes, setMarketNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) throw new Error('Please log in before submitting.');

      const { data, error } = await supabase
        .from('summaries')
        .insert({
          job_title: jobTitle || null,
          candidate_name: candidateName || null,
          jd_text: jdText || null,
          recruiter_notes: recruiterNotes || null,
          hm_notes: hmNotes || null,
          market_notes: marketNotes || null,
        })
        .select('id')
        .single();

      if (error) throw error;
      router.push(`/summary/${data.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Failed to save.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10">
        <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
          On this page you will…
        </p>
        <h1 className="text-2xl font-bold mb-4">Provide job + candidate inputs</h1>
        <p className="text-gray-700 mb-6">
          Start simple. Paste the JD and notes. You can add files later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Job Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Senior Data Strategy Director"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Candidate Name</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Job Description (paste)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-28"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the JD here…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Recruiter Notes</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-24"
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              placeholder="Key takeaways from your call…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hiring Manager Notes</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-24"
              value={hmNotes}
              onChange={(e) => setHmNotes(e.target.value)}
              placeholder="Top priorities, must-haves, concerns…"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Market Notes (optional)</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-20"
              value={marketNotes}
              onChange={(e) => setMarketNotes(e.target.value)}
              placeholder="Market sizing, comp ranges, talent pools…"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            {loading ? 'Saving…' : 'Save & Continue'}
          </button>

          {message && <p className="text-sm text-red-700 mt-2">{message}</p>}
        </form>
      </div>
    </div>
  );
}

