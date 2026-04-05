import Link from "next/link";
import { Plane, Star, Zap, Shield, ChevronRight, MapPin, CreditCard, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a3048] glass">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#d4a843] rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-[#0a0e1a]" />
            </div>
            <span className="font-display text-xl font-bold text-[#f5f0e8]">Trippr</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#b8b0a0] hover:text-[#f5f0e8] transition-colors">Sign in</Link>
            <Link href="/signup" className="text-sm bg-[#d4a843] text-[#0a0e1a] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#e8c06a] transition-all hover:scale-105">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#d4a843] opacity-5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500 opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-[#1a2035] border border-[#d4a843]/30 rounded-full px-4 py-2 text-sm text-[#d4a843] mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5" />
            Powered by Claude AI
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold text-[#f5f0e8] leading-tight mb-6 animate-slide-up">
            Travel smarter.<br />
            <span className="gold-gradient">Points first.</span>
          </h1>

          <p className="text-xl text-[#b8b0a0] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in" style={{animationDelay: "0.2s", opacity: 0, animationFillMode: "forwards"}}>
            Describe your dream trip in plain English. Trippr optimizes every booking for your loyalty programs, credit card perks, and travel style — in seconds.
          </p>

          {/* Demo chat preview */}
          <div className="glass rounded-2xl p-6 max-w-2xl mx-auto mb-10 text-left animate-fade-in" style={{animationDelay: "0.3s", opacity: 0, animationFillMode: "forwards"}}>
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#2a3048] flex items-center justify-center text-sm">✈️</div>
              <div className="bg-[#2a3048] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-[#f5f0e8] max-w-sm">
                Book me a long weekend in Lisbon in April, business class if my United miles cover it
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-[#d4a843]/10 border border-[#d4a843]/20 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-[#f5f0e8] max-w-sm">
                Found the perfect Lisbon getaway! Using your <span className="text-[#d4a843]">45,000 United miles</span> for business class on TAP Air Portugal + <span className="text-[#d4a843]">30,000 Bonvoy points</span> for 3 nights at Bairro Alto Hotel. Total savings: <span className="text-[#d4a843] font-semibold">$1,240</span> vs cash. ✨
              </div>
              <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center text-sm">🤖</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: "0.4s", opacity: 0, animationFillMode: "forwards"}}>
            <Link href="/signup" className="bg-[#d4a843] text-[#0a0e1a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e8c06a] transition-all hover:scale-105 flex items-center gap-2 justify-center">
              Start planning for free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="border border-[#2a3048] text-[#f5f0e8] px-8 py-4 rounded-xl font-semibold text-lg hover:border-[#d4a843]/50 transition-all flex items-center gap-2 justify-center">
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-[#2a3048]">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#f5f0e8] mb-4">
            Your points, fully optimized
          </h2>
          <p className="text-[#b8b0a0] text-center mb-14 max-w-xl mx-auto">
            Trippr knows which card to charge, which miles to burn, and how to stretch every dollar of your annual credits.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Award className="w-6 h-6 text-[#d4a843]" />,
                title: "Loyalty Optimization",
                desc: "Tell us your balances once. Trippr picks the best program for every flight and hotel automatically.",
              },
              {
                icon: <CreditCard className="w-6 h-6 text-[#d4a843]" />,
                title: "Card Perk Maximizer",
                desc: "Chase 3x on travel, Amex 5x on hotels — we calculate the optimal card for each booking line.",
              },
              {
                icon: <MapPin className="w-6 h-6 text-[#d4a843]" />,
                title: "Personalized Itineraries",
                desc: "Window seat, boutique hotels, morning flights — preferences learned and applied to every trip.",
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#141927] border border-[#2a3048] rounded-2xl p-6 hover:border-[#d4a843]/30 transition-all group">
                <div className="w-12 h-12 bg-[#d4a843]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#d4a843]/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-[#f5f0e8] mb-2">{f.title}</h3>
                <p className="text-[#b8b0a0] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#141927]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-[#f5f0e8] mb-14">
            Three steps to your perfect trip
          </h2>
          <div className="space-y-8">
            {[
              { n: "01", title: "Set up your travel profile", desc: "Add your loyalty programs with balances, your credit cards, and your preferences. Takes 3 minutes." },
              { n: "02", title: "Describe your trip in plain English", desc: "\"Long weekend in Lisbon, business class if miles cover it, boutique hotel\" — that's all you need." },
              { n: "03", title: "Get an optimized itinerary instantly", desc: "Trippr returns flights, hotels, points breakdown, and card recommendations. Tweak it in chat. Save when ready." },
            ].map((step, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="font-display text-5xl font-bold text-[#d4a843]/20 w-16 shrink-0">{step.n}</div>
                <div>
                  <h3 className="font-display text-xl font-semibold text-[#f5f0e8] mb-2">{step.title}</h3>
                  <p className="text-[#b8b0a0]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-[#d4a843] text-[#d4a843]" />)}
          </div>
          <blockquote className="font-display text-2xl md:text-3xl text-[#f5f0e8] italic mb-6 max-w-2xl mx-auto">
            "I saved $2,100 on my Tokyo trip just by letting Trippr pick my cards and miles combination. This is insane."
          </blockquote>
          <p className="text-[#b8b0a0]">— Marcus T., frequent flyer with 4 loyalty programs</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-[#2a3048]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold text-[#f5f0e8] mb-4">
            Ready to stop leaving points on the table?
          </h2>
          <p className="text-[#b8b0a0] mb-8">Free to start. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#d4a843] text-[#0a0e1a] px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#e8c06a] transition-all hover:scale-105">
            Get started free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a3048] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#d4a843] rounded-md flex items-center justify-center">
              <Plane className="w-3 h-3 text-[#0a0e1a]" />
            </div>
            <span className="font-display text-lg font-bold text-[#f5f0e8]">Trippr</span>
          </div>
          <p className="text-[#b8b0a0] text-sm">
            Itineraries are AI-suggested. Always verify prices and availability before booking.
          </p>
          <p className="text-[#b8b0a0] text-sm">© 2026 Trippr</p>
        </div>
      </footer>
    </div>
  );
}
