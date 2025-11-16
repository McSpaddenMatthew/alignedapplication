import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';
import { createServerClient } from '../../lib/supabaseServerClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
};

type SummaryStatus = 'draft' | 'processing' | 'completed' | 'error';

type Summary = {
  id: string;
  candidate_name: string | null;
  candidate_title: string | null;
  role_title: string | null;
  status: SummaryStatus | null;
  created_at: string;
};

const statusStyles: Record<SummaryStatus, string> = {
  draft: 'bg-gray-100 text-gray-800 border border-gray-200',
  processing: 'bg-blue-50 text-blue-700 border border-blue-100',
  completed: 'bg-green-50 text-green-700 border border-green-100',
  error: 'bg-red-50 text-red-700 border border-red-100',
};

const formatDate = (timestamp: string) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
    new Date(timestamp),
  );

export default async function DashboardPage() {
  const { supabase, accessToken } = createServerClient();

  if (!accessToken) {
    redirect('/login');
  }

  const { data: userData } = await supabase.auth.getUser(accessToken);
  const user = userData?.user;

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('id', user.id)
    .single();

  const { data: summariesData } = await supabase
    .from('summaries')
    .select('id, candidate_name, candidate_title, role_title, status, created_at')
    .eq('created_by', user.id)
    .order('created_at', { ascending: false });

  const summaries: Summary[] = (summariesData ?? []) as Summary[];

  const displayName = profile?.full_name || profile?.email || user.email || 'there';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">Dashboard</p>
          <h1 className="text-3xl font-semibold text-ink">Welcome, {displayName}</h1>
        </div>
        <LogoutButton />
      </header>

      <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-ink">Your summaries</h2>
            <p className="text-sm text-gray-600">Create, review, and share concise candidate write-ups.</p>
          </div>
          <Link
            href="/summary/new"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent/90"
          >
            Create New Summary
          </Link>
        </div>

        {summaries.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
            <p className="text-base font-semibold text-gray-800 mb-2">You don’t have any summaries yet.</p>
            <p className="text-sm text-gray-600">
              Click <span className="font-semibold">“Create New Summary”</span> to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {summaries.map((summary) => (
              <Link
                key={summary.id}
                href={`/summary/${summary.id}`}
                className="block rounded-lg border border-gray-200 bg-white px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">{formatDate(summary.created_at)}</p>
                    <h3 className="text-lg font-semibold text-ink">
                      {summary.candidate_name?.trim() || 'Unnamed candidate'}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                      {summary.candidate_title && <span className="text-gray-700">{summary.candidate_title}</span>}
                      {summary.candidate_title && summary.role_title && <span>•</span>}
                      {summary.role_title && <span className="text-gray-700">For {summary.role_title}</span>}
                    </div>
                  </div>
                  {summary.status && (
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[summary.status]
                    }`}
                  >
                    <span className="h-2 w-2 rounded-full bg-current opacity-60" />
                    {summary.status.charAt(0).toUpperCase() + summary.status.slice(1)}
                  </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
