import Link from 'next/link';

export default function Landing() {
  return (
    <div className="container">
      <section className="mt-10 mb-12 bg-white rounded-xl shadow p-8">
        <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">On this page you will…</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">See exactly what you’re buying</h1>
        <p className="text-lg text-gray-700">
          Aligned turns job inputs into a <strong>trust-first candidate summary</strong> your hiring managers will actually use.
          No fluff. Clear risks. Instant sharing.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="mailto:mason@weldrecruiting.co" className="bg-accent text-white rounded-lg px-4 py-2 text-sm font-semibold">Join the Waitlist</a>
          <Link href="/login" className="border border-accent text-accent rounded-lg px-4 py-2 text-sm font-semibold">Login</Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6">
        {[
          { step: '1', title: 'Add your inputs', desc: 'Paste the JD, add recruiter/HM notes, upload a resume, and optional market notes.' },
          { step: '2', title: 'Aligned formats it', desc: 'A standardized, trust-first summary—risks + mitigations, outcomes, quotes.' },
          { step: '3', title: 'Share instantly', desc: 'Send a link your hiring manager can read in minutes. Clear, simple, consistent.' }
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-xl shadow p-6">
            <div className="text-accent font-bold text-sm mb-1">Step {s.step}</div>
            <div className="text-xl font-semibold mb-2">{s.title}</div>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-12 bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-3">What you’re buying</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Trust-first format with <em>Known Risks &amp; Mitigations</em> front-and-center.</li>
          <li>Timestamped quote table: <em>What You Shared – What the Candidate Brings</em>.</li>
          <li>Simple share link, easy to read on desktop or phone.</li>
          <li>History to find and re-share past summaries.</li>
          <li>Consistent quality—no guesswork for your hiring managers.</li>
        </ul>
      </section>
    </div>
  );
}
