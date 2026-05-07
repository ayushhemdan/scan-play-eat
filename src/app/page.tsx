"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getAllCafes } from "@/lib/cafes";
import FeaturesSection from "@/components/landing/FeaturesSection";
import { ArrowRight, Check, X as XIcon, ChevronRight, MessageCircle } from "lucide-react";
import HeroPhone from "@/components/landing/HeroPhone";

// Fixed particle positions — avoids hydration mismatch
const PARTICLES = [
  { x: 8,  y: 15, s: 3, d: 5.2, delay: 0    },
  { x: 22, y: 72, s: 2, d: 6.8, delay: 1.2  },
  { x: 38, y: 35, s: 4, d: 4.5, delay: 0.6  },
  { x: 55, y: 85, s: 2, d: 7.1, delay: 2.1  },
  { x: 68, y: 20, s: 3, d: 5.8, delay: 0.3  },
  { x: 80, y: 55, s: 2, d: 6.2, delay: 1.7  },
  { x: 92, y: 40, s: 4, d: 4.9, delay: 0.9  },
  { x: 15, y: 90, s: 2, d: 7.5, delay: 2.5  },
  { x: 45, y: 10, s: 3, d: 5.5, delay: 1.4  },
  { x: 75, y: 78, s: 2, d: 6.5, delay: 0.8  },
  { x: 30, y: 50, s: 3, d: 5.0, delay: 1.9  },
  { x: 88, y: 8,  s: 2, d: 7.8, delay: 0.4  },
];

const YOUR_WHATSAPP = "919999999999"; // replace with your number
const WA_LINK = `https://wa.me/${YOUR_WHATSAPP}?text=Hi!%20I%20want%20to%20get%20my%20cafe%20on%20ScanPlayEat`;

const PROBLEMS = [
  {
    bad: "You pay 25–30% commission to Zomato & Swiggy on every single order.",
    good: "With ScanPlayEat, orders come directly to your WhatsApp. Zero commission. Ever.",
  },
  {
    bad: "Paper menus get dirty, torn, and outdated. Reprinting costs money every time.",
    good: "Update your menu in minutes. Change prices, mark sold-out items, add new dishes instantly.",
  },
  {
    bad: "Customers eat and leave. No loyalty. No reason to come back tomorrow.",
    good: "Digital stamp cards, AI recommendations, and games keep customers engaged and coming back.",
  },
];


const STEPS = [
  { n: "01", title: "Send us your menu",         desc: "WhatsApp us a photo of your menu, or just list the items. We handle everything else." },
  { n: "02", title: "We build your page",        desc: "Your custom branded menu page, QR codes, games, and AI — ready within 24 hours." },
  { n: "03", title: "Stick the QR on tables",    desc: "Print QR codes per table. Customers scan, order, and play. You get WhatsApp notifications." },
];

const STATS = [
  { value: "0%",    label: "Commission on orders" },
  { value: "24h",   label: "Setup time" },
  { value: "₹0",    label: "App download cost" },
];

const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

export default function HomePage() {
  const cafes = getAllCafes();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="font-black text-xl tracking-tight">
            Scan<span className="text-amber-400">Play</span>Eat
          </span>
          <div className="flex items-center gap-3">
            {cafes[0] && (
              <Link
                href={`/${cafes[0].slug}`}
                className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Live demo <ChevronRight size={14} />
              </Link>
            )}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold px-5 py-2.5 rounded-full bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        {/* Animated glow blobs */}
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.12, 1] }}
          transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-400 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.04, 0.1, 0.04], scale: [1, 1.2, 1] }}
          transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 1.5 }}
          className="absolute top-20 left-0 w-72 h-72 bg-amber-400 rounded-full blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ opacity: [0.03, 0.08, 0.03], scale: [1, 1.15, 1] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity, delay: 0.8 }}
          className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-3xl pointer-events-none"
        />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.x}
              className="absolute rounded-full bg-amber-400"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: 0.25 }}
              animate={{ y: [0, -30, 0], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: p.d, ease: "easeInOut", repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

            {/* Left — copy */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div {...fade} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full mb-8">
                🍔 Now live in Dehradun
              </motion.div>

              <motion.h1 {...fade} transition={{ duration: 0.5, delay: 0.05 }}
                className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
                One QR code.<br />
                <span className="text-amber-400">Your whole cafe,</span><br />
                upgraded.
              </motion.h1>

              <motion.p {...fade} transition={{ duration: 0.5, delay: 0.1 }}
                className="text-zinc-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
                Digital menu, WhatsApp orders, couple games, AI recommendations,
                and loyalty stamps — all behind a single QR code.
                No app. No commission.
              </motion.p>

              <motion.div {...fade} transition={{ duration: 0.5, delay: 0.15 }}
                className="flex flex-wrap justify-center lg:justify-start gap-3">
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-full font-black text-base bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-all shadow-2xl shadow-amber-400/25 hover:shadow-amber-400/40 hover:-translate-y-0.5">
                  Get my cafe online <ArrowRight size={18} />
                </a>
                {cafes[0] && (
                  <Link href={`/${cafes[0].slug}`}
                    className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-base border border-white/10 text-zinc-300 hover:text-white hover:border-white/25 transition-all hover:-translate-y-0.5">
                    See live demo
                  </Link>
                )}
              </motion.div>

              {/* Trust pills */}
              <motion.div {...fade} transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap justify-center lg:justify-start gap-2 mt-8">
                {["No app download", "Zero commission", "Live in 24 hours", "WhatsApp orders"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-zinc-500 bg-white/4 border border-white/8 px-3 py-1.5 rounded-full">
                    <Check size={10} className="text-amber-400" /> {t}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right — animated phone mockup (visible on all screens) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="shrink-0 flex justify-center w-full lg:w-auto"
            >
              <HeroPhone />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {STATS.map((s, i) => (
            <motion.div key={s.value} {...fade} transition={{ duration: 0.4, delay: i * 0.08 }}>
              <p className="text-4xl md:text-5xl font-black text-amber-400">{s.value}</p>
              <p className="text-zinc-500 text-xs md:text-sm mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Problem → Solution ──────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <motion.div {...fade} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3">
            Paper menus are costing you money
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
            Every cafe owner in Dehradun faces the same three problems. Here&apos;s how ScanPlayEat solves each one.
          </p>
        </motion.div>

        <div className="space-y-4">
          {PROBLEMS.map((p, i) => (
            <motion.div key={i} {...fade} transition={{ duration: 0.45, delay: i * 0.1 }}
              className="grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/8">
              <div className="flex gap-3 p-5 bg-red-500/5 border-b md:border-b-0 md:border-r border-white/8">
                <XIcon size={16} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-zinc-400 text-sm leading-relaxed">{p.bad}</p>
              </div>
              <div className="flex gap-3 p-5 bg-green-500/5">
                <Check size={16} className="text-green-400 shrink-0 mt-0.5" />
                <p className="text-zinc-300 text-sm leading-relaxed">{p.good}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <FeaturesSection />

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <motion.div {...fade} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Up and running in 24 hours</h2>
          <p className="text-zinc-500 text-sm">Three steps. We do the heavy lifting.</p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[28px] top-10 bottom-10 w-px bg-white/6 hidden md:block" />

          <div className="space-y-5">
            {STEPS.map((step, i) => (
              <motion.div key={step.n} {...fade} transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex gap-5 items-start p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/12 transition-colors">
                <span className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  {step.n}
                </span>
                <div className="pt-1">
                  <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Live showcase ────────────────────────────────────────────── */}
      {cafes.length > 0 && (
        <section className="px-6 py-16 bg-white/[0.015] border-y border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fade}>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-400 mb-3">Live right now</p>
              <h2 className="text-2xl md:text-3xl font-black mb-2">See it working in the real world</h2>
              <p className="text-zinc-500 text-sm mb-8">Open on your phone and scan the QR code to experience it as a customer would.</p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-3">
              {cafes.map((cafe) => (
                <Link key={cafe.slug} href={`/${cafe.slug}`}
                  className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl border border-amber-400/20 bg-amber-400/5 hover:border-amber-400/40 hover:bg-amber-400/10 transition-all text-left">
                  <span className="text-2xl">🍔</span>
                  <div>
                    <p className="text-white font-bold text-sm">{cafe.name}</p>
                    <p className="text-zinc-500 text-xs">{cafe.address.split(",")[0]}</p>
                  </div>
                  <ArrowRight size={14} className="text-zinc-600 group-hover:text-amber-400 transition-colors ml-2" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <section className="px-6 py-24 max-w-4xl mx-auto">
        <motion.div {...fade} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Simple, honest pricing</h2>
          <p className="text-zinc-500 text-sm">No hidden fees. No contracts. Cancel anytime.</p>
        </motion.div>

        <motion.div {...fade} className="max-w-sm mx-auto">
          <div className="relative rounded-3xl border-2 border-amber-400/30 bg-amber-400/5 p-8 text-center overflow-hidden">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <span className="relative text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/25 px-3 py-1 rounded-full">
              Most popular
            </span>
            <div className="relative mt-5 mb-1">
              <span className="text-zinc-500 text-sm">Setup fee</span>
              <p className="text-5xl font-black text-white mt-1">₹2,999</p>
            </div>
            <p className="text-zinc-400 text-sm mb-1">+ <strong className="text-white">₹499/month</strong> maintenance</p>
            <p className="text-zinc-600 text-xs mb-8">vs. ₹3,000–8,000/month in Zomato commissions</p>

            <div className="space-y-3 text-left mb-8">
              {[
                "Custom branded menu page",
                "QR codes per table (up to 20)",
                "WhatsApp ordering system",
                "5 interactive games",
                "AI recommendation buddy",
                "Today's Special feature",
                "Loyalty stamp card",
                "Menu updates anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <Check size={14} className="text-amber-400 shrink-0" />
                  <span className="text-zinc-300 text-sm">{item}</span>
                </div>
              ))}
            </div>

            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-colors">
              <MessageCircle size={16} /> Get started on WhatsApp
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="relative px-6 py-28 overflow-hidden">
        <div className="absolute inset-0 bg-amber-400/4 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />

        <motion.div {...fade} className="relative max-w-2xl mx-auto text-center">
          <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">Based in Dehradun · Fast setup</p>
          <h2 className="text-4xl md:text-5xl font-black mb-5 leading-tight">
            Ready to make your cafe the most modern spot in the area?
          </h2>
          <p className="text-zinc-400 mb-10 leading-relaxed">
            Message us on WhatsApp right now. Tell us your cafe name and location.
            We&apos;ll have your digital menu live within 24 hours.
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-black text-lg bg-amber-400 text-[#0a0a0a] hover:bg-amber-300 transition-all shadow-2xl shadow-amber-400/20 hover:shadow-amber-400/35 hover:-translate-y-1">
            <MessageCircle size={22} />
            Chat on WhatsApp
          </a>
        </motion.div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-black text-lg">
            Scan<span className="text-amber-400">Play</span>Eat
          </span>
          <p className="text-zinc-600 text-sm text-center">
            © 2025 ScanPlayEat · Digital experience suite for local cafes & bakeries · Dehradun, India
          </p>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
            className="text-sm text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1.5">
            <MessageCircle size={14} /> WhatsApp us
          </a>
        </div>
      </footer>
    </main>
  );
}
