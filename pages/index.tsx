import Link from 'next/link';

export default function Landing() {
  return (
    <div className="container">
      {/* HERO */}
      <section className="card card-pad mt-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 text-primary">
          Data-backed confidence and trust — so hiring managers move faster
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Aligned turns recruiter notes, job details, and candidate facts into a
          clear, consistent summary that speeds decisions and proves why the
          interview is worth their time.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="#sample"
            className="bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            See how Aligned works
          </Link>
          <a
            href="mailto:mason@weldrecruiting.co"
            className="border border-accent text-accent bg-white rounded-lg px-4 py-2 font-semibold"
          >
            Join the waitlist
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Built for recruiters. <span className="text-gray-800 font-semibold">Trusted by hiring managers.</span>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          {
            title: 'Data that speaks for you',
            desc: 'Evidence—JD must-haves, HM notes, resume facts—organized into one page.'
          },
          {
            title: 'Faster, confident decisions',
            desc: 'Risks + mitigations up front. Managers review in minutes, not meetings.'
          },
          {
            title: 'Trust that compounds',
            desc: 'Same structure every time. Clear, consistent communication builds credibility.'
          }
        ].map((b) => (
          <div key={b.title} className="card p-6 hover:shadow-lg transition">
            <div className="text-xl font-semibold mb-2">{b.title}</div>
            <p className="text-gray-700">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* DATA PROOF */}
      <section className="card card-pad mt-8">
        <h2 className="text-2xl font-semibold mb-2">Data first. Minimum noise.</h2>
        <p className="text-gray-700 mb-6">
          Aligned structures the signals you already have—no fluff, no drama.
          Every summary is defensible and easy to review.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-gray-800">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Real-world signals:</strong> JD priorities, HM notes, resume facts, market context.</li>
            <li><strong>Defensible decisions:</strong> risks are explicit with suggested mitigations.</li>
            <li><strong>Consistent format:</strong> same structure every time → faster, fairer review.</li>
          </ul>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Review in minutes:</strong> outcome highlights + what’s missing.</li>
            <li><strong>Shareable link:</strong> one clean page for hiring managers.</li>
            <li><strong>Privacy-aware:</strong> you control access; we store only what you submit.</li>
          </ul>
        </div>
      </section>

      {/* SAMPLE */}
      <section id="sample" className="card card-pad mt-8">
        <h2 className="text-2xl font-semibold mb-4">What a manager sees (example)</h2>

        <div className="rounded-lg border p-6">
          <div className="text-sm text-gray-500 mb-2 uppercase">Candidate Summary</div>
          <h3 className="text-xl font-semibold">Jane Doe — Director, Data Strategy</h3>
          <p className="text-gray-600 mb-4">Analytics leadership · Multi-site ops · Value-based care</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="font-semibold mb-1">Known Risks &amp; Mitigations</div>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Limited payer-facing experience → pair with RevCycle lead in first 30 days.</li>
                <li>Team of 3 currently → stagger roadmap to de-risk onboarding.</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-1">Outcomes</div>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Reduced LOS variance 8% across 5 facilities (’23).</li>
                <li>Built “cost-to-serve” dashboard used in monthly ops review.</li>
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-semibold mb-1">What you shared → What the candidate brings</div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">JD: “Value-based care metrics”</div>
              <div className="bg-gray-50 p-3 rounded">Candidate: “Designed VBC KPI pack adopted by SLT”</div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="card card-pad mt-8 mb-10 text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to earn trust and move faster?</h3>
        <p className="text-gray-700 mb-4">Evidence-backed, consistent, and easy to share.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="bg-accent text-white rounded-lg px-4 py-2 font-semibold">
            Log in
          </Link>
          <a href="mailto:mason@weldrecruiting.co" className="border border-accent text-accent rounded-lg px-4 py-2 font-semibold">
            Join the waitlist
          </a>
        </div>
      </section>
    </div>
  );
}

