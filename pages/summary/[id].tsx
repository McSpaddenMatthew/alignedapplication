import { useRouter } from 'next/router';

export default function SummaryDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container">
      <div className="bg-white rounded-xl shadow p-8 mt-10">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">On this page you will…</p>
        <h1 className="text-2xl font-bold mb-4">View a candidate summary</h1>
        <p className="text-gray-700">Summary ID: <span className="font-mono">{id as string || '(none)'}</span></p>
        <div className="mt-4 text-gray-700">
          <p><strong>Sections coming next:</strong></p>
          <ul className="list-disc pl-6">
            <li>What You Shared – What the Candidate Brings (timestamped quotes)</li>
            <li>Known Risks &amp; Mitigations</li>
            <li>Outcomes Delivered</li>
            <li>How [Candidate Name] Frames Data for Leadership Decisions</li>
            <li>Resume note + scheduling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
