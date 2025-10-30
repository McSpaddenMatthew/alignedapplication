export default function Home() {
  return (
    <main className="min-h-screen bg-soft">
      <div className="container py-16">
        <section className="grid gap-12 md:grid-cols-[1.05fr,0.95fr] items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">
              Evidence over instinct
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
              Hiring decisions need evidence.<br className="hidden sm:block" /> PE firms need confidence.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-gray-700">
              Built by recruiters who believe in evidence over opinion. Aligned turns recruiter insight into investor-grade clarity so operating partners can decide faster—without the rehash.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:mason@weldrecruiting.co?subject=Aligned%20Reports"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-5 py-3 text-base font-semibold text-white shadow-md transition hover:bg-accent/90"
              >
                Get my first 3 reports free
              </a>
              <a
                href="#investor-sample"
                className="inline-flex items-center justify-center rounded-lg border border-primary/40 px-5 py-3 text-base font-semibold text-primary transition hover:border-primary hover:text-primary"
              >
                See a sample investor report
              </a>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {[{
                stat: "72%",
                label: "reports reviewed same-day"
              }, {
                stat: "9/10",
                label: "managers rate clarity \u201cexcellent\u201d"
              }, {
                stat: "30 min",
                label: "average time saved per slate"
              }].map((item) => (
                <div key={item.stat} className="rounded-xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur">
                  <div className="text-2xl font-bold text-primary">{item.stat}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card relative overflow-hidden">
            <div className="absolute right-6 top-6 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-600">
              Investor-ready preview
            </div>
            <div className="card-pad space-y-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Private equity update</p>
                <h2 className="mt-2 text-2xl font-semibold text-primary">Operator briefing — Week 8</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Concise candidate evidence routed straight to deal teams so they can focus on value creation.
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">Portfolio: Northwind Healthcare</span>
                  <span className="text-xs text-gray-500">Shared 2 hours ago</span>
                </div>
                <div className="mt-4 space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-accent" />
                    <div>
                      <div className="font-semibold text-primary">Role: VP Revenue Operations</div>
                      <p className="text-gray-600">Risk-first summary linked to diligence requirements, with mitigation plan and value creation roadmap.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-amber-400" />
                    <div>
                      <div className="font-semibold text-primary">Signals surfaced</div>
                      <p className="text-gray-600">RevCycle turnaround outcomes, EBITDA impact, post-close retention metrics.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-emerald-500" />
                    <div>
                      <div className="font-semibold text-primary">Decision status</div>
                      <p className="text-gray-600">Operating partner approved for final interview slate.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-primary/5 p-4 text-sm text-primary">
                "Aligned gets us to conviction faster. Risks are surfaced, the math is clear, and we can keep the deal team moving."
                <div className="mt-3 font-semibold">— Managing Partner, Growth PE Fund</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20" id="investor-sample">
          <div className="text-sm font-semibold uppercase tracking-wide text-primary/70">Why funds choose aligned</div>
          <h2 className="mt-3 text-3xl font-bold text-primary">Every report is built to earn trust in the first pass.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Structured like an investment memo",
                copy: "We map recruiter intel to diligence priorities \u2014 outcomes, risk, mitigation, and upside \u2014 in a single view."
              },
              {
                title: "Signals, not stories",
                copy: "Resume facts, KPI deltas, stakeholder quotes, and market context are verified before we ship the report."
              },
              {
                title: "Designed for the operating cadence",
                copy: "Slack, email, or the dashboard \u2014 your partners get the same template every time and can respond in minutes."
              }
            ].map((item) => (
              <div key={item.title} className="card h-full p-6">
                <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
                <p className="mt-3 text-sm text-gray-700">{item.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 rounded-3xl bg-white p-10 shadow-lg lg:grid-cols-[0.8fr,1.2fr]">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-primary/70">Workflow</div>
            <h2 className="mt-4 text-3xl font-bold text-primary">What happens after you send the req</h2>
            <p className="mt-4 text-gray-700">
              Recruiters drop structured notes, resumes, and diligence asks. Aligned standardizes every signal into a defensible report and routes it where it needs to go.
            </p>
            <a
              href="mailto:mason@weldrecruiting.co"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80"
            >
              Book a 15 min workflow audit
              <span aria-hidden>→</span>
            </a>
          </div>
          <ol className="grid gap-6 text-sm text-gray-700 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "01",
                title: "Upload",
                detail: "Resume, HM notes, diligence asks, target metrics."
              },
              {
                step: "02",
                title: "Align",
                detail: "We fact-check, map risks, and quantify outcomes."
              },
              {
                step: "03",
                title: "Deliver",
                detail: "Investor-ready summary + mitigation plan hits every inbox."
              }
            ].map((item) => (
              <li key={item.step} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-primary/60">Step {item.step}</div>
                <div className="mt-3 text-lg font-semibold text-primary">{item.title}</div>
                <p className="mt-2 text-gray-600">{item.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 mb-10 flex flex-col items-center rounded-3xl bg-primary px-10 py-12 text-center text-white shadow-xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to see the next slate in investor format?</h2>
          <p className="mt-4 max-w-2xl text-base text-white/80">
            Share your upcoming search and we\'ll send three full reports on us. No contract, no platform lift \u2014 just the evidence your partners need.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="mailto:mason@weldrecruiting.co?subject=Aligned%20Investor%20Reports"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-base font-semibold text-primary shadow-sm transition hover:bg-white/90"
            >
              Email Mason to start
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border border-white/40 px-5 py-3 text-base font-semibold text-white transition hover:border-white"
            >
              Log in
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}




