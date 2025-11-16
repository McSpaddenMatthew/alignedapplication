import { redirect } from 'next/navigation';
import { createServerClient } from '../../../../lib/supabaseClient';
import { processSummary } from '../../../../lib/processSummary';

export default async function ProcessingPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: summary } = await supabase
    .from('summaries')
    .select('id, status')
    .eq('id', params.id)
    .single();

  if (!summary) {
    redirect('/dashboard');
  }

  if (summary.status !== 'completed' && summary.status !== 'error') {
    await processSummary(summary.id);
  }

  const { data: updated } = await supabase
    .from('summaries')
    .select('status')
    .eq('id', params.id)
    .single();

  if (updated?.status === 'completed') {
    redirect(`/summary/${params.id}`);
  }

  return (
    <div className="container py-10">
      <div className="bg-white shadow rounded-xl p-6 text-center space-y-4">
        <h1 className="text-xl font-semibold">Processing summary</h1>
        <p className="text-gray-600">Hang tight while we organize the candidate notes.</p>
        {updated?.status === 'error' && (
          <p className="text-red-600 text-sm">There was an error creating your summary. Please try again.</p>
        )}
      </div>
    </div>
  );
}
