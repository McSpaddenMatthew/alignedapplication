import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerClient } from '../../lib/supabaseClient';
import { LogoutButton } from '../../components/LogoutButton';

interface SummaryRow {
  id: string;
  candidate_name: string | null;
  candidate_title: string | null;
  role_title: string | null;
  status: string;
  created_at: string;
}

export default async function DashboardPage() {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const userId = session.user.id;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', userId)
    .single();

  const { data: summaries } = await supabase
    .from('summaries')
    .select('id, candidate_name, candidate_title, role_title, status, created_at')
    .eq('created_by', userId)
    .order('created_at', { ascending: false });

  const nameToShow = profile?.full_name || profile?.email || session.user.email;

  return (
    <div className="container py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Welcome back</p>
          <h1 className="text-2xl font-semibold">{nameToShow}</h1>
        </div>
        <LogoutButton />
      </div>

      <div className="flex justify-between items-center bg-white shadow rounded-xl p-4">
        <div>
          <h2 className="text-lg font-semibold">Your candidate summaries</h2>
          <p className="text-sm text-gray-600">Create and track summaries you have generated.</p>
        </div>
        <Link
          href="/summary/new"
          className="bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary"
        >
          Create New Summary
        </Link>
      </div>

      {!summaries || summaries.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-6 text-center text-gray-600">
          You don’t have any summaries yet. Click “Create New Summary” to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {summaries.map((summary) => (
            <Link
              key={summary.id}
              href={`/summary/${summary.id}`}
              className="block bg-white shadow rounded-xl p-4 hover:border-accent border border-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">{summary.role_title}</p>
                  <h3 className="text-lg font-semibold">
                    {summary.candidate_name || 'Unnamed candidate'}
                    {summary.candidate_title ? ` · ${summary.candidate_title}` : ''}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Created {new Date(summary.created_at).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-gray-100 border text-gray-800 capitalize">
                  {summary.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
