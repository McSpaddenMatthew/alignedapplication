import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "../components/ui/carousel";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Recruiters exist on trust. This helps you build it.</h1>
        <p className="text-lg mb-6 max-w-xl mx-auto">
          Aligned earns trust from hiring managers with beautifully clear, instantly shareable candidate summaries.
        </p>
        <div className="flex justify-center gap-4">
          <Button className="text-white bg-blue-600 hover:bg-blue-700">Book a Demo</Button>
          <Button variant="outline">See It In Action</Button>
        </div>
      </section>

      {/* Testimonial Carousel */}
      <section className="py-20 px-6 text-center bg-gray-50">
        <h2 className="text-3xl font-semibold mb-8">What Hiring Managers Are Saying</h2>
        <Carousel className="max-w-4xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <Card>
                <CardContent className="p-6">
                  <p className="italic text-gray-700">“I knew exactly where the candidate stood before the interview. It saved me hours.”</p>
                  <p className="mt-4 font-semibold">— David L., VP of Engineering</p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card>
                <CardContent className="p-6">
                  <p className="italic text-gray-700">“Aligned gave me the confidence to move fast—without second guessing.”</p>
                  <p className="mt-4 font-semibold">— Priya R., Head of Product</p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card>
                <CardContent className="p-6">
                  <p className="italic text-gray-700">“Transparent, clean, and way easier to trust than a resume or email.”</p>
                  <p className="mt-4 font-semibold">— James H., Director of Data Science</p>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </section>

      {/* Video Demo Section */}
      <section className="py-16 bg-gray-50 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">See Aligned in Action</h2>
        <div className="mx-auto max-w-4xl aspect-video">
          <iframe
            className="w-full h-full rounded-xl shadow"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Aligned Demo Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6 text-center bg-white">
        <h2 className="text-3xl font-semibold mb-6">See the Difference</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full max-w-5xl mx-auto text-left border-collapse border border-gray-200">
            <thead>
              <tr className="bg-blue-100 text-gray-700">
                <th className="p-4">Feature</th>
                <th className="p-4">Aligned</th>
                <th className="p-4">Other AI Tools</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-200">
                <td className="p-4">Trust-Focused Design</td>
                <td className="p-4">✅ Built for confidence and clarity</td>
                <td className="p-4">❌ Data overload with unclear impact</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-4">Candidate Summary Quality</td>
                <td className="p-4">✅ Timestamped quotes, visual scorecard</td>
                <td className="p-4">❌ Basic profiles, generic summaries</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-4">Ease of Sharing</td>
                <td className="p-4">✅ One clean link, no logins</td>
                <td className="p-4">❌ Requires accounts or messy PDFs</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="p-4">Hiring Manager Confidence</td>
                <td className="p-4">✅ Clear, transparent candidate fit</td>
                <td className="p-4">❌ Leaves too many questions unanswered</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white px-6 text-center">
        <h2 className="text-3xl font-semibold mb-8">Simple, Transparent Pricing</h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Start</h3>
              <p className="mb-4 text-gray-600">Perfect for solo recruiters getting started.</p>
              <ul className="text-left list-disc list-inside text-sm text-gray-700 mb-6">
                <li>Up to 3 candidate reports/month</li>
                <li>Access to JD Scorecard</li>
                <li>Unlimited sharing</li>
              </ul>
              <Button>Start Free</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Pro – $499/month</h3>
              <p className="mb-4 text-gray-600">For firms that want confidence in every hire.</p>
              <ul className="text-left list-disc list-inside text-sm text-gray-700 mb-6">
                <li>Unlimited reports</li>
                <li>Custom branding</li>
                <li>AI assistant summaries</li>
              </ul>
              <Button className="bg-blue-600 text-white hover:bg-blue-700">Upgrade</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-semibold mb-4">Build Trust. Close Faster.</h2>
        <p className="mb-6 max-w-xl mx-auto">
          Recruiters who use Aligned report 3x faster feedback, more placements, and better client retention.
        </p>
        <Button variant="outline" className="text-white border-white">Try It Free</Button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Aligned. Built for recruiters. Trusted by hiring managers.
      </footer>
    </div>
  );
}
