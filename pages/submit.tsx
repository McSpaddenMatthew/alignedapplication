import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Submit() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [hmTranscript, setHmTranscript] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [candidateResume, setCandidateResume] = useState('');
  const [callTranscript, setCallTranscript] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      if (!user) {
        router.replace('/login');
        return;
      }
      if (!active) return;
      setUserId(user.id);
      setUserEmail(user.email ?? null);
    };
    fetchUser();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) {
      setMessage('Please log in before submitting.');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const { data, error } = await supabase
        .from('summaries')
        .insert({
          job_title: jobTitle || null,
          candidate_name: candidateName || null,
          hm_notes: hmTranscript || null,
          jd_text: jobDescription || null,
          market_notes: candidateResume || null,
          recruiter_notes: callTranscript || null,
          owner_id: userId,
          owner_email: userEmail || null
        })
        .select('id')
        .single();

      if (error) throw error;

      router.push(`/summary/${data.id}`);
    } catch (err: any) {
      setMessage(err.message || 'Failed to save. Please confirm the summaries table includes the owner_id and owner_email columns.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="bg-white rounded-2xl shadow-xl p-10 mt-12 border border-gray-100">
        <p className="text-xs uppercase tracking-[0.3em] text-primary/70 mb-3">Step 3</p>
        <h1 className="text-3xl font-bold text-primary mb-4">Provide the signals we’ll turn into a summary</h1>
        <p className="text-gray-700 mb-8">
          Paste in the four core pieces of evidence. We keep the recruiter’s voice intact while organizing the narrative for your operating team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Candidate name</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Role or mandate</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Portfolio Operations Director"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Hiring manager transcript notes</label>
            <textarea
              className="min-h-[140px] border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={hmTranscript}
              onChange={(e) => setHmTranscript(e.target.value)}
              placeholder="Paste the transcript or top takeaways from the hiring manager conversation."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job description</label>
            <textarea
              className="min-h-[140px] border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the JD so we can highlight the must-haves that matter."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Candidate resume</label>
            <textarea
              className="min-h-[140px] border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={candidateResume}
              onChange={(e) => setCandidateResume(e.target.value)}
              placeholder="Paste the resume or key bullet points that show impact."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Candidate call transcript</label>
            <textarea
              className="min-h-[160px] border border-gray-200 rounded-lg px-3 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/30"
              value={callTranscript}
              onChange={(e) => setCallTranscript(e.target.value)}
              placeholder="Paste your recruiter call transcript or detailed notes."
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            <div className="text-sm text-gray-500">
              Logged in as {userEmail ? <strong>{userEmail}</strong> : 'verifying…'}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60"
            >
              {loading ? 'Saving…' : 'Generate summary preview'}
            </button>
          </div>

          {message && <p className="text-sm text-red-700">{message}</p>}
        </form>
      </div>
    </div>
  );
}
