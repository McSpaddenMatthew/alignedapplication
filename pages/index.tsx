import Link from 'next/link';

export default function Landing() {
  return (
    <div className="container">
      {/* HERO */}
      <section className="bg-white rounded-xl shadow p-8 mt-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Build confidence and trust — and help hiring managers move fast with data to back it up
        </h1>
        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
          Aligned transforms recruiter notes, job details, and candidate insights into a clear, consistent
          summary that earns trust, speeds decisions, and proves why the interview is worth their time.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="mailto:mason@weldrecruiting.co"
            className="bg-accent text-white rounded-lg px-4 py-2 font-semibold"
          >
            Join the waitlist
          </a>
          <a
            href="#sample"
            className="border border-accent text-accent bg-white rounded-lg px-4 py-2 font-semibold"
          >
            See a sample
          </a>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Built for recruiters. <span className="text-gray-800 font-semibold">Trusted by hiring managers.</span>
        </div>
      </section>

      {/* WHO IT’S FOR STRIP */}
      <section className="rounded-xl p-4 mt-6 text-sm bg-white shadow">
        <div className="flex flex-wrap gap-4 justify-center">
          <span className="px-3 py-1 rounded-md bg-gray-100">Agency & in-house recruiters</span>
          <span className="px-3 py-1 rounded-md bg-gray-100">Busy hiring managers</span>
          <span className="px-3 py-1 rounded-md bg-gray-100">Teams that value clarity</span>
        </div>
      </section>

      {/* DATA PROOF */}
      <section className="bg-white rounded-xl shadow p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-2">Data first. Minimum noise.</h2>
        <p className="text-gray-700 mb-6">
          Aligned structures the signals you already have—no fluff, no drama. Every summary is defensible and easy to review.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-gray-800">
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Real-world signals:</strong> JD must-haves, HM notes, resume facts, market context.</li>
            <li><strong>Defensible decisions:</strong> risks are explicit with suggested mitigations.</li>
            <li><strong>Consistent format:</strong> same structure every time → faster, fairer review.</li>
          </ul>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Review in minutes:</strong> outcome highlights + “what’s missing”.</li>
            <li><strong>Shareable link:</strong> one clean page for hiring managers.</li>
            <li><strong>Privacy-aware:</strong> you control access; we store only what you submit.</li>
          </ul>
        </div>
      </section>

      {/* 3-STEP EXPLAINER */}
      <section className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          {
            step: '1',
            title: 'Paste your inputs',
            desc: 'JD, recruiter/HM notes, resume, optional market notes.',
          },
          {
            step: '2',
            title: 'Aligned structures the signal',
            desc: 'Standard layout with risks, mitigations, outcomes, and mapped quotes—data over drama.',
          },
          {
            step: '3',
            title: 'Share a clean, defensible summary',
            desc: 'Managers review in minutes. Clear rationale. Fewer meetings.',
          },
        ].map((s) => (
          <div key={s.step} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
            <div className="text-accent font-bold text-sm mb-1">Step {s.step}</div>
            <div className="text-xl font-semibold mb-2">{s.title}</div>
            <p className="text-gray-700">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* WHAT YOU’RE BUYING */}
      <section className="bg-white rounded-xl shadow p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-3">What you’re buying</h2>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li><strong>Risk-first summary</strong> with clear <em>Mitigations</em>.</li>
          <li><strong>Outcome highlights</strong> mapped to the JD and role priorities.</li>
          <li><strong>One shareable link</strong>, easy on desktop or phone.</li>
          <li><strong>History</strong> to re-share and compare quickly.</li>
          <li><strong>Consistency</strong> across recruiters and roles.</li>
        </ul>
      </section>

      {/* SAMPLE PREVIEW (anchor target for CTA) */}
      <section id="sample" className="bg-white rounded-xl shadow p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-4">What a manager sees</h2>

        <div className="rounded-lg border p-6">
          <div className="text-sm text-gray-500 mb-2 uppercase">Candidate Summary (example)</div>
          <h3 className="text-xl font-semibold">Jane Doe — Director, Data Strategy</h3>
          <p className="text-gray-600 mb-4">Healthcare analytics | Multi-site ops | Value-based care</p>

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
                <li>Built cost-to-serve dashboard used in monthly ops review.</li>
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

      {/* COMPARISON */}
      <section className="bg-white rounded-xl shadow p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-3">Compared to sending raw resumes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-2">Old way</div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Managers skim; risks get missed; meetings pile up.</li>
              <li>Format varies by recruiter; decisions drift.</li>
              <li>Hard to compare candidates quickly.</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <div className="font-semibold mb-2">Aligned</div>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Risk-first, defensible summary.</li>
              <li>Same structure every time; faster approvals.</li>
              <li>Clean share link; mobile-friendly.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-white rounded-xl shadow p-8 mt-8 mb-10 text-center">
        <h3 className="text-2xl font-bold mb-2">Give managers a summary they’ll actually read</h3>
        <p className="text-gray-700 mb-4">Evidence-backed, consistent, and fast to share.</p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/login" className="bg-accent text-white rounded-lg px-4 py-2 font-semibold">Log in</Link>
          <a href="mailto:mason@weldrecruiting.co" className="border border-accent text-accent rounded-lg px-4 py-2 font-semibold">Join the waitlist</a>
        </div>
      </section>
    </div>
  );
}
