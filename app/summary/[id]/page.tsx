import { redirect } from 'next/navigation';
import { createServerClient } from '../../../lib/supabaseClient';

interface SummaryOutput {
  header: any;
  what_you_shared_table: any;
  evidence_summary: string | null;
  considerations: string | null;
  outcomes: any;
  leadership_framing: string | null;
  resume_note: string | null;
}

export default async function SummaryDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: summary } = await supabase
    .from('summaries')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!summary) {
    redirect('/dashboard');
  }

  const { data: output } = await supabase
    .from('summary_outputs')
    .select('*')
    .eq('summary_id', params.id)
    .single();

  return (
    <div className="container py-10 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Role</p>
          <h1 className="text-2xl font-semibold">{summary.role_title}</h1>
          <p className="text-gray-600">
            {summary.candidate_name || 'Unnamed candidate'}
            {summary.candidate_title ? ` · ${summary.candidate_title}` : ''}
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 border text-gray-800 capitalize">
          {summary.status}
        </span>
      </div>

      {!output && (
        <div className="bg-white shadow rounded-xl p-6 text-center text-gray-600">
          We are still preparing this summary.
        </div>
      )}

      {output && (
        <div className="space-y-4">
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">Candidate Header</h2>
            <pre className="bg-soft p-3 rounded text-sm overflow-auto">{JSON.stringify(output.header, null, 2)}</pre>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">What You Shared – What the Candidate Brings</h2>
            <pre className="bg-soft p-3 rounded text-sm overflow-auto">{JSON.stringify(output.what_you_shared_table, null, 2)}</pre>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">Evidence Summary</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{output.evidence_summary}</p>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">Considerations &amp; Watchouts</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{output.considerations}</p>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">Outcomes &amp; Track Record</h2>
            <pre className="bg-soft p-3 rounded text-sm overflow-auto">{JSON.stringify(output.outcomes, null, 2)}</pre>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">How they frame data for leadership decisions</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{output.leadership_framing}</p>
          </section>
          <section className="bg-white shadow rounded-xl p-6 space-y-2">
            <h2 className="text-lg font-semibold">Resume note &amp; scheduling</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{output.resume_note}</p>
          </section>
        </div>
      )}
    </div>
  );
}
