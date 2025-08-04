import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ShieldCheck, Handshake, Users, HelpCircle } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Hero Section */}
      <section className="bg-blue-50 py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4">Aligned: Built for Recruiters. Trusted by Hiring Managers.</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Aligned helps recruiters present candidates with clarity and trust — putting hiring managers in control of the decision.</p>
        <Button className="text-lg px-6 py-3">Request Early Access</Button>
      </section>

      {/* 1-2-3 How It Works */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">How Aligned Builds Trust</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card>
            <CardContent className="p-6">
              <ShieldCheck className="mx-auto text-blue-500" size={40} />
              <h3 className="text-xl font-bold mt-4">1. Standardized Candidate Reports</h3>
              <p className="mt-2 text-gray-600">Aligned presents each candidate with consistent, decision-ready summaries.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Users className="mx-auto text-blue-500" size={40} />
              <h3 className="text-xl font-bold mt-4">2. Removes Recruiter Noise</h3>
              <p className="mt-2 text-gray-600">Let the hiring manager focus on what matters: the candidate and their fit.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Handshake className="mx-auto text-blue-500" size={40} />
              <h3 className="text-xl font-bold mt-4">3. Builds Executive Confidence</h3>
              <p className="mt-2 text-gray-600">Every detail, summary, and quote is designed to inspire trust and alignment.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Timestamped candidate quotes",
            "Visual requirement scorecards",
            "Trust-layer candidate reports",
            "Weekly hiring progress summaries",
            "Client landing pages",
            "No login required for hiring managers",
          ].map((feature) => (
            <div key={feature} className="flex items-start gap-4">
              <CheckCircle className="text-green-600 mt-1" />
              <p className="text-gray-700">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">What Hiring Managers Are Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 italic">“I’ve never trusted a candidate submission more. Aligned made it easy to focus on what mattered — the fit.”</p>
              <p className="mt-4 font-bold">— VP, Data Strategy</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-700 italic">“Our recruiter was great, but Aligned’s report let me cut through the fluff. Every candidate now feels buttoned up.”</p>
              <p className="mt-4 font-bold">— Sr. Director, Product</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Simple Pricing</h2>
        <p className="mb-8">No logins. No complexity. Just trust-building reports.</p>
        <div className="text-4xl font-bold mb-2">$500/month</div>
        <p className="text-gray-600 mb-6">Unlimited candidate reports • Unlimited hiring managers</p>
        <Button size="lg">Start Free Trial</Button>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold text-center mb-12">FAQs</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><HelpCircle size={20} />Do hiring managers need to log in?</h3>
            <p className="text-gray-600 ml-6">Nope! We send them a shareable link with everything they need. It’s frictionless by design.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2"><HelpCircle size={20} />What’s included in each candidate summary?</h3>
            <p className="text-gray-600 ml-6">A trust-layer report with JD alignment, timestamped quotes, scorecard, and our recommendation.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Aligned. Built for recruiters. Trusted by hiring managers.
      </footer>
    </div>
  );
}
