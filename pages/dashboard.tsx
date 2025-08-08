import Link from 'next/link';

export default function Dashboard() {
  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">On this page you will…</p>
        <h1 className="text-2xl font-bold mb-4">Choose your next action</h1>
        <p className="text-gray-700 mb-6">Start a new candidate summary, view your history, or update settings.</p>

        <div className="grid sm:grid-cols-3 gap-4">
          <Link href="/submit" className="bg-accent text-white rounded-lg px-4 py-6 text-center font-semibold">New Summary</Link>
          <Link href="/history" className="bg-white border border-accent text-accent rounded-lg px-4 py-6 text-center font-semibold">History</Link>
          <Link href="/settings" className="bg-white border border-accent text-accent rounded-lg px-4 py-6 text-center font-semibold">Settings</Link>
        </div>
      </div>
    </div>
  );
}
