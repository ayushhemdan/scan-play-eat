import Link from "next/link";
import { getAllCafes } from "@/lib/cafes";

const FEATURES = [
  { emoji: "📱", title: "Scan-to-Menu", desc: "Customers scan a QR code and instantly browse your full menu — no app download, no friction." },
  { emoji: "🛒", title: "WhatsApp Orders", desc: "Orders arrive directly on your phone with table number and items. Zero commission to Zomato or Swiggy." },
  { emoji: "🎮", title: "Games & Entertainment", desc: "Truth or Dare, Compatibility Quiz, Spin the Wheel — customers stay longer and spend more." },
  { emoji: "✨", title: "AI Recommendation", desc: "An AI buddy that reads your actual menu and recommends the perfect item based on the customer's mood." },
  { emoji: "⭐", title: "Today's Special", desc: "Highlight any item with one tap — drive attention to high-margin dishes every single day." },
  { emoji: "🎫", title: "Loyalty Stamps", desc: "Digital stamp card stored in the customer's browser. Visit 5 times, earn a reward. No app needed." },
];

const STEPS = [
  { n: "01", title: "You tell us your menu", desc: "Send us your menu — physical photo, WhatsApp message, or just a list. We handle the rest." },
  { n: "02", title: "We build your digital suite", desc: "Custom branded page with your menu, games, AI, and QR code. Ready within 24 hours." },
  { n: "03", title: "Stick the QR on your tables", desc: "Customers scan, browse, and order. You receive orders on WhatsApp instantly." },
];

export default function HomePage() {
  const cafes = getAllCafes();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-white/5">
        <span className="font-black text-xl text-white">
          Scan<span className="text-amber-400">Play</span>Eat
        </span>
        <a
          href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20get%20my%20cafe%20on%20ScanPlayEat"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold px-4 py-2 rounded-full bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-colors"
        >
          Get Started
        </a>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-24 md:py-36 text-center max-w-4xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full mb-6">
            🍔 Now live in Dehradun
          </span>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Turn your menu into<br />
            <span className="text-amber-400">an experience.</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            A digital menu, AI recommendations, couple games, and loyalty stamps —
            all behind a single QR code. No app. No commission. Just your cafe, upgraded.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20get%20my%20cafe%20on%20ScanPlayEat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full font-black text-lg bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-colors shadow-xl shadow-amber-400/25"
            >
              Get my cafe online →
            </a>
            {cafes[0] && (
              <Link
                href={`/${cafes[0].slug}`}
                className="px-8 py-4 rounded-full font-bold text-base border border-white/10 text-zinc-300 hover:text-white hover:border-white/20 transition-colors"
              >
                See a live demo
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-3">
          Everything your cafe needs
        </h2>
        <p className="text-zinc-500 text-center mb-12 max-w-xl mx-auto">
          One QR code. Six powerful features. Built specifically for local cafes in college areas.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all"
            >
              <p className="text-3xl mb-3">{f.emoji}</p>
              <h3 className="font-bold text-white text-lg mb-1">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The big number */}
      <section className="px-6 py-16 border-y border-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: "0%", label: "Commission to food aggregators" },
            { stat: "24hrs", label: "From contact to live QR code" },
            { stat: "5×", label: "More table engagement with games" },
          ].map((s) => (
            <div key={s.stat}>
              <p className="text-5xl font-black text-amber-400 mb-1">{s.stat}</p>
              <p className="text-zinc-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Up and running in 24 hours
        </h2>
        <div className="space-y-6">
          {STEPS.map((step) => (
            <div key={step.n} className="flex gap-6 items-start p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
              <span className="text-3xl font-black text-amber-400/40 shrink-0 leading-none">
                {step.n}
              </span>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live cafes */}
      {cafes.length > 0 && (
        <section className="px-6 py-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Live on ScanPlayEat</h2>
          <p className="text-zinc-500 text-sm mb-8">Scan or click to see the real thing.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {cafes.map((cafe) => (
              <Link
                key={cafe.slug}
                href={`/${cafe.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/4 text-zinc-300 hover:text-white hover:border-white/20 transition-colors text-sm font-semibold"
              >
                🍔 {cafe.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-amber-400/5 pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Ready to upgrade your cafe?
          </h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Message us on WhatsApp. We&apos;ll have your digital menu live within 24 hours.
            No tech knowledge needed — we handle everything.
          </p>
          <a
            href="https://wa.me/919999999999?text=Hi!%20I%20want%20to%20get%20my%20cafe%20on%20ScanPlayEat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-black text-lg bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-colors shadow-2xl shadow-amber-400/20"
          >
            💬 Chat on WhatsApp
          </a>
          <p className="text-zinc-600 text-xs mt-4">Dehradun-based · Fast setup · Affordable pricing</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <p className="text-zinc-700 text-sm">
          © 2025 ScanPlayEat · Built for local cafes & bakeries in Dehradun, India
        </p>
      </footer>
    </main>
  );
}
