export default function NewSummaryPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-xl w-full border rounded-xl p-8 shadow-sm bg-white">
        <h1 className="text-2xl font-semibold mb-4">Create Summary (Coming Soon)</h1>
        <p className="text-sm text-gray-700">
          This is a temporary placeholder for the /summary/new route so the app can deploy
          successfully. We&apos;ll wire this up to a real form and Supabase soon.
        </p>
      </div>
    </main>
  );
}
