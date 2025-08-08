import { useState } from 'react';
import { supabase } from '../supabase/client';
import { useRouter } from 'next/router';

export default function SubmitPage() {
  const [candidateName, setCandidateName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('summaries')
        .insert([
          {
            candidateName: candidateName, // ✅ This matches Supabase column name
            role,
            company,
            summary,
          },
        ]);

      if (error) {
        console.error('Supabase error:', JSON.stringify(error, null, 2));
        alert('Error submitting summary');
      } else {
        alert('Summary submitted!');
        // router.push('/dashboard'); // Optional redirect
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Submit Candidate Summary</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border rounded p-2"
        />
        <textarea
          placeholder="Paste candidate summary here"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Submitting…' : 'Submit Summary'}
        </button>
      </form>
    </div>
  );
}
