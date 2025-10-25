import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const redirectIfAuthenticated = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      if (data?.session) {
        router.replace('/dashboard');
      }
    };

    redirectIfAuthenticated();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace('/dashboard');
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="min-h-screen pb-16">
      <div className="container">
        {/* HERO */}
        <section className="card card-pad mt-12 lg:mt-16 text-center bg-white/95">
          <p className="uppercase tracking-widest text-xs text-primary/70 mb-3">For operating partners at private equity firms</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-5 text-primary leading-tight">
            Evidence-grade candidate briefs that help you move first—and move with conviction.
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Aligned turns recruiter inputs into defensible, investor-ready candidate summaries. No finger-pointing, no extra headcount—just the clarity your hiring managers demand.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="/login" className="bg-primary text-white rounded-lg px-6 py-3 font-semibold shadow-md hover:shadow-lg transition">
              Log in
            </a>
            <a
              href="mailto:mason@weldrecruiting.co"
              className="border border-primary text-primary bg-white rounded-lg px-6 py-3 font-semibold hover:bg-primary/5 transition"
            >
              Book a private demo
            </a>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Built with senior recruiters. Trusted by deal teams.
          </p>
        </section>

        {/* VALUE PROPOSITION */}
        <section className="grid lg:grid-cols-3 gap-6 mt-12">
          {[{ title: 'Make the investment case fast', desc: 'Cut through resumes with a one-page view of outcomes, risks, and readiness aligned to the value creation plan.' },
            { title: 'Keep diligence tight', desc: 'Structured inputs—JD priorities, HM transcripts, resumes, call notes—mapped to what you need to validate.' },
            { title: 'De-risk every handoff', desc: 'Your recruiters stay the hero. Aligned makes their work legible so stakeholders stay aligned without extra chasing.' }
          ].map((item) => (
            <div key={item.title} className="card p-6 border border-gray-100 hover:border-primary/40 hover:shadow-lg transition">
              <div className="text-xl font-semibold text-primary mb-2">{item.title}</div>
              <p className="text-gray-700 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* HOW IT WORKS */}
        <section className="card card-pad mt-12">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-primary mb-4">Your plan in four clear steps</h2>
              <p className="text-gray-700">
                Operating partners stay focused on value creation. Recruiters get a simple workspace that respects their time. Every summary is consistent, auditable, and ready for a partner review in minutes.
              </p>
            </div>
            <ol className="lg:w-1/2 space-y-4 text-gray-700">
              {[
                { step: '1', title: 'Log in', copy: 'Invite your recruiters and internal talent partners. No passwords—secure magic links only.' },
                { step: '2', title: 'Drop in the evidence', copy: 'Paste the hiring manager transcript, job description, candidate resume, and recruiter call notes.' },
                { step: '3', title: 'Aligned builds the brief', copy: 'We assemble the signals into an executive-ready summary highlighting risks, mitigations, and outcomes.' },
                { step: '4', title: 'Review in the dashboard', copy: 'Each operating partner sees only their candidates. Share links or export for IC memos instantly.' }
              ].map(({ step, title, copy }) => (
                <li key={title} className="flex items-start gap-4">
                  <span className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                    {step}
                  </span>
                  <div>
                    <div className="font-semibold text-primary text-lg">{title}</div>
                    <p>{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="card card-pad mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Why recruiters ask for Aligned</h2>
          <div className="grid md:grid-cols-3 gap-6 text-gray-700">
            {[
              'One workspace for every search—no more piecing together emails and slides.',
              'Summaries stay true to the recruiter’s voice while giving partners the clarity they expect.',
              'Magic-link access for hiring managers: share the win without exposing your tools.'
            ].map((item) => (
              <div key={item} className="bg-soft rounded-lg p-5 border border-transparent hover:border-primary/30 transition">
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* SAMPLE */}
        <section id="sample" className="card card-pad mt-12">
          <h2 className="text-2xl font-semibold text-primary mb-4">Sample investor-ready brief</h2>
          <div className="rounded-xl border border-gray-200 p-6 bg-white">
            <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Candidate Summary</div>
            <h3 className="text-xl font-semibold text-primary">Director of Portfolio Operations – Healthcare</h3>
            <p className="text-gray-600 mb-5">Prepared for Horizon Equity | Candidate: Jane Doe</p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold mb-2 text-primary">Risks we’re watching</div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Limited payer contracting depth → pair with revenue cycle leader during first 45 days.</li>
                  <li>Prefers lean teams → plan interim PMO support during integration phase.</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-2 text-primary">Evidence of outcomes</div>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Grew EBITDA +140 bps through multi-site supply chain consolidation (2023).</li>
                  <li>Designed ops dashboard now used in monthly board materials.</li>
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <div className="font-semibold mb-2 text-primary">What you asked for → What the candidate proved</div>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="bg-soft p-3 rounded-lg">HM transcript: “Need someone fluent in VBC metrics.”</div>
                <div className="bg-soft p-3 rounded-lg">Call notes: “Built value-based care KPI pack adopted across 5 hospitals.”</div>
                <div className="bg-soft p-3 rounded-lg">JD: “Own diligence on two tuck-ins.”</div>
                <div className="bg-soft p-3 rounded-lg">Resume: “Led integration playbook for 3 acquisitions in 18 months.”</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="card card-pad mt-12 text-center bg-primary text-white">
          <h3 className="text-3xl font-bold mb-3">Ready to review candidates like an investment memo?</h3>
          <p className="text-white/80 mb-6">Partner with recruiters who already trust you—Aligned simply amplifies their work.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/login" className="bg-white text-primary rounded-lg px-6 py-3 font-semibold shadow-md">
              Log in
            </a>
            <a href="mailto:mason@weldrecruiting.co" className="border border-white text-white rounded-lg px-6 py-3 font-semibold">
              Request pricing
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
