import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Aligned MVP</h1>
      <Link href="/submit">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Submit Candidate Summary</button>
      </Link>
      <Link href="/dashboard?adminView=true" className="mt-4 text-blue-500 underline">
        Peek at Dashboard
      </Link>
    </div>
  );
}
