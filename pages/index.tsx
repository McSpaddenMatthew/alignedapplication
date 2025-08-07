// pages/index.tsx
import Link from 'next/link';

export default function Home() {
  return (
    <main className="bg-white text-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <section className="min-h-screen py-24 flex items-center justify-center text-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-gray-900">
              Recruiters exist on trust. This helps you build trust.
            </h1>
            <p className="text-xl text-gray-700 mb-4">
              Aligned turns your recruiter calls into polished candidate summaries hiring managers trust — without the follow-up dance.
            </p>
            <p className="text-md text-gray-500 mb-8">
              You’ll understand it in minutes. You’ll want it after one use. You’ll trust it to build trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <button className="bg-black text-white px-6 py-3 rounded-full text-lg font-semibold hover:scale-105 transition duration-300">
                  See Aligned in Action
                </button>
              </Link>
              <Link href="/login">
                <button className="border border-black text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 hover:scale-105 transition duration-300">
                  Start Free Trial
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Hiring Feels Broken */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Why Hiring Feels Broken</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-lg">
              <div>
                <h3 className="font-semibold text-2xl mb-4">Recruiters:</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  <li>Tired of chasing hiring manager feedback?</li>
                  <li>Frustrated when strong candidates get ignored?</li>
                  <li>Know your gut is good — but want data to back it?</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-2xl mb-4">Hiring Managers:</h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700">
                  <li>Drowning in resumes?</li>
                  <li>Struggling to trust recruiter recommendations?</li>
                  <li>Want proof, not pitches?</li>
                </ul>
              </div>
            </div>
            <p className="text-center mt-12 text-xl text-blue-600 font-medium">🚀 Aligned solves that with data over instinct.</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">How Aligned Works</h2>
            <p className="text-xl text-gray-600 mb-12">Simple enough to use today. Powerful enough to use forever.</p>
            <p className="text-md text-gray-500 mb-6">No guesswork. No emotion. Just data.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-lg font-medium text-gray-700">
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">🎙️ Record a candidate conversation</div>
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">🧠 Aligned AI generates a summary</div>
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">🔗 Share one link with your hiring manager</div>
              <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">✅ Get faster feedback & build trust</div>
            </div>
          </div>
        </section>

        {/* What Hiring Managers See */}
        <section className="py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">What Hiring Managers See</h2>
            <ul className="space-y-4 text-lg text-gray-700">
              <li>🎧 JD Trust Table with Timestamps</li>
              <li>✅ Fast Facts</li>
              <li>🧩 Requirement Scorecard</li>
              <li>📥 Next Step Recommendation</li>
              <li>🧾 Narrative Summary</li>
            </ul>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">What People Are Saying</h2>
            <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-800">
              <blockquote className="bg-white rounded-xl p-6 shadow-md">“Our hiring managers finally trust our process — we’re not chasing feedback anymore.”<br /><span className="text-sm italic">– Sr. Recruiter, HealthTech</span></blockquote>
              <blockquote className="bg-white rounded-xl p-6 shadow-md">“Aligned got us more interviews, faster. This is the future.”<br /><span className="text-sm italic">– Talent Partner, FinTech</span></blockquote>
              <blockquote className="bg-white rounded-xl p-6 shadow-md">“I actually read candidate profiles now — Aligned makes it simple.”<br /><span className="text-sm italic">– VP of Engineering, SaaS Startup</span></blockquote>
              <blockquote className="bg-white rounded-xl p-6 shadow-md">“This is the first time I’ve felt confident saying ‘yes’ to an intro without a call.”<br /><span className="text-sm italic">– Hiring Manager, Data Strategy Team</span></blockquote>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-8">Why Aligned &gt; Other AI Recruiting Tools</h2>
            <p className="text-center text-lg text-gray-600 mb-12">Data &gt; Instinct. Aligned brings the power of structured evidence to every hiring conversation.</p>
            <div className="overflow-auto rounded-xl border border-gray-200 shadow-md">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-medium">What Recruiters & Owners Really Want</th>
                    <th className="px-6 py-3 font-medium">Other AI Tools</th>
                    <th className="px-6 py-3 font-medium">Aligned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-6 py-4">Recruiter Branding</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                  <tr><td className="px-6 py-4">Timestamped Quotes</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                  <tr><td className="px-6 py-4">JD Requirement Scorecard</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                  <tr><td className="px-6 py-4">Sharing & Feedback Loop</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                  <tr><td className="px-6 py-4">Trust-First Candidate Delivery</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                  <tr><td className="px-6 py-4">Built-In Buyer Confidence</td><td className="px-6 py-4">❌</td><td className="px-6 py-4">✅</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 bg-gray-50 text-center">
          <h2 className="text-4xl font-bold mb-6">Pricing</h2>
          <p className="text-xl mb-2 text-gray-800">Free during private beta.</p>
          <p className="text-md mb-2 text-gray-600">Try it. Trust it. Pay only when it works for you.</p>
          <p className="text-sm text-gray-500">Pay only when you make a hire. Built to create value before we ever charge you.</p>
        </section>
      </div>
    </main>
  );
}


