import Link from 'next/link';

const heroPoints = [
  {
    title: 'Prove fit in minutes',
    description:
      'Story-driven, evidence-backed summaries that help hiring managers picture the candidate on their team.',
  },
  {
    title: 'Protect the relationship',
    description:
      'Surface risks, mitigations, and expectations so decisions feel collaborative instead of combative.',
  },
  {
    title: 'Win repeat business',
    description:
      'Deliver a consistent, trusted experience that keeps you embedded in every hiring decision.',
  },
];

const planSteps = [
  {
    label: '1',
    title: 'Capture the truth',
    description: 'Drop in JD highlights, manager notes, and recruiter intel—aligned keeps it structured.',
  },
  {
    label: '2',
    title: 'Share the story',
    description: 'Aligned turns the inputs into a single summary that answers the question “why this person?”.',
  },
  {
    label: '3',
    title: 'Guide the decision',
    description: 'Walk managers through risks, next steps, and outcomes so they can say yes with confidence.',
  },
];

const proofSections = [
  {
    heading: 'Give them a clear hero',
    body: 'Your candidate is the hero. Aligned frames their wins in the context of the hiring manager’s problem so the narrative is obvious.',
  },
  {
    heading: 'Position yourself as the guide',
    body: 'Instead of forwarding resumes, you provide context, guardrails, and next steps. You look like a strategic partner, not a middleperson.',
  },
  {
    heading: 'Show the plan to success',
    body: 'Each summary closes with risks, mitigations, and action items so managers know exactly what to do next.',
  },
];

const successOutcomes = [
  'Hiring managers reply faster because they understand the story.',
  'Candidates get the right interviews without extra phone calls.',
  'Recruiters protect trust and stay close to the real decisions.',
];

const faqItems = [
  {
    question: 'What makes Aligned different from a resume deck?',
    answer:
      'Resumes dump information. Aligned curates a narrative that maps job requirements to candidate proof points, risk flags, and follow-up actions.',
  },
  {
    question: 'Do my clients need another login?',
    answer:
      'No. Hiring managers get a secure share link that opens directly to the candidate summary. Only you need to log in to create and manage the work.',
  },
  {
    question: 'How does the dashboard stay personalized?',
    answer:
      'Every summary you create is tied to your account. When you log in, the dashboard shows only the candidates and roles you have submitted.',
  },
];

export default function Home() {
  return (
    <main className="bg-soft">
      <header className="container py-16 grid gap-10 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <p className="uppercase tracking-[0.3em] text-sm text-accent">StoryBrand for recruiting</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary leading-tight">
            Turn recruiter intel into a narrative hiring managers can trust
          </h1>
          <p className="text-lg text-gray-700">
            Aligned is the guided story that moves a candidate from introduction to signed offer. Capture the problem, present
            the plan, and highlight the win—every time.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/login" className="bg-accent text-white font-semibold px-5 py-3 rounded-lg shadow">
              Log in to start a summary
            </Link>
            <a
              href="#plan"
              className="px-5 py-3 rounded-lg border border-accent text-accent font-semibold hover:bg-accent/5 transition"
            >
              See the plan
            </a>
          </div>
        </div>
        <div className="card card-pad space-y-4">
          <h2 className="text-xl font-semibold text-primary">Your candidate story, chapter by chapter</h2>
          <ul className="space-y-3 text-gray-700">
            {heroPoints.map((point) => (
              <li key={point.title} className="flex gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-accent" aria-hidden />
                <div>
                  <p className="font-semibold text-ink">{point.title}</p>
                  <p>{point.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section className="container grid gap-6 md:grid-cols-3">
        {proofSections.map((section) => (
          <div key={section.heading} className="card card-pad">
            <h3 className="text-xl font-semibold text-primary mb-2">{section.heading}</h3>
            <p className="text-gray-700">{section.body}</p>
          </div>
        ))}
      </section>

      <section id="plan" className="container mt-16">
        <div className="card card-pad">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-accent">The plan</p>
              <h2 className="text-3xl font-bold text-primary">A simple path from intake to “yes”</h2>
            </div>
            <Link href="/login" className="px-4 py-2 bg-accent text-white rounded-lg font-semibold shadow">
              Log in
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {planSteps.map((step) => (
              <div key={step.label} className="bg-soft rounded-xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <span className="h-10 w-10 rounded-full bg-accent text-white flex items-center justify-center font-bold text-lg">
                    {step.label}
                  </span>
                  <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
                </div>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mt-16 grid gap-8 md:grid-cols-[2fr,1fr]">
        <div className="card card-pad space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-accent">Future state</p>
          <h2 className="text-3xl font-bold text-primary">What success looks like</h2>
          <ul className="space-y-3 text-gray-700">
            {successOutcomes.map((outcome) => (
              <li key={outcome} className="flex gap-3">
                <span className="text-success font-semibold">✔</span>
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700">
            Aligned gives you the language, the structure, and the follow-through so every candidate story lands the same way—clear,
            confident, and ready for a decision.
          </p>
        </div>
        <aside className="card card-pad space-y-4">
          <h3 className="text-xl font-semibold text-primary">Give yourself the guide</h3>
          <p className="text-gray-700">
            On every page we remind you what to do next. From intake to email to follow-up, you stay in control of the process.
          </p>
          <Link href="/login" className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg font-semibold">
            Get my dashboard
          </Link>
        </aside>
      </section>

      <section className="container mt-16">
        <div className="card card-pad">
          <h2 className="text-2xl font-bold text-primary mb-6">Frequently asked</h2>
          <div className="space-y-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-semibold text-primary">{item.question}</h3>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mt-16 mb-24">
        <div className="card card-pad text-center space-y-4">
          <h2 className="text-3xl font-bold text-primary">Ready to tell the right story?</h2>
          <p className="text-gray-700 text-lg">
            Align every candidate narrative and put your clients on the path to yes.
          </p>
          <Link href="/login" className="px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow">
            Enter the dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
