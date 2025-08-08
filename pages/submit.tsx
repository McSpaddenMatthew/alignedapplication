export default function Submit() {
  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">On this page you will…</p>
        <h1 className="text-2xl font-bold mb-4">Provide job + candidate inputs</h1>
        <p className="text-gray-700">
          Paste the JD, add recruiter/HM notes, upload a resume, and optional market notes.
          (Form wiring to Supabase will come next.)
        </p>
      </div>
    </div>
  );
}
