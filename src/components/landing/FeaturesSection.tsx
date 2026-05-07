"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { MessageCircle, Sparkles, Send } from "lucide-react";

// ─── QR Menu Card ─────────────────────────────────────────────────────────────
function QRCard() {
  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-amber-400/20 bg-amber-400/5 overflow-hidden min-h-[200px]">
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 px-2.5 py-1 rounded-full">
          Zero friction
        </span>
        <h3 className="text-2xl font-black text-white mt-3 leading-tight">
          Scan.<br />Browse.<br />Order.
        </h3>
        <p className="text-zinc-500 text-sm mt-2 leading-relaxed">
          Customers scan a QR on the table — your full menu opens instantly. No app, no login.
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <div className="bg-white p-3 rounded-2xl shadow-xl">
            <QRCodeSVG value="https://scan-play-eat.vercel.app/suriyansh-burgers" size={100} fgColor="#F59E0B" level="H" />
          </div>
          {/* Scan line */}
          <motion.div
            animate={{ top: ["15%", "85%", "15%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-3 right-3 h-0.5 bg-amber-400/70 blur-[1px] rounded-full"
            style={{ position: "absolute" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

// ─── WhatsApp Orders Card ─────────────────────────────────────────────────────
const WA_ORDERS = [
  { table: 3, item: "2× Smash Burger + Fries", total: "₹527" },
  { table: 7, item: "Dynamite Zinger + Cold Coffee", total: "₹318" },
  { table: 1, item: "Oreo Shake + Nachos", total: "₹278" },
];

function WhatsAppCard() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % WA_ORDERS.length), 2800);
    return () => clearInterval(t);
  }, []);

  const order = WA_ORDERS[idx];

  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-green-500/20 bg-green-500/5 overflow-hidden min-h-[180px]">
      <div className="absolute -top-8 -left-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-500/15 border border-green-500/20 px-2.5 py-1 rounded-full">
          0% commission
        </span>
        <h3 className="text-xl font-black text-white mt-3">WhatsApp Orders</h3>
        <p className="text-zinc-500 text-xs mt-1">100% profit. Direct to your phone.</p>
      </div>

      <div className="mt-4 space-y-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2.5 bg-[#0d1f14] border border-green-500/20 rounded-2xl p-3"
          >
            <div className="w-7 h-7 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
              <MessageCircle size={13} className="text-white" />
            </div>
            <div>
              <p className="text-white text-[11px] font-black">Table {order.table} · New Order 🍔</p>
              <p className="text-zinc-400 text-[10px] mt-0.5">{order.item}</p>
              <p className="text-green-400 text-[10px] font-bold mt-0.5">{order.total}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <p className="text-zinc-600 text-[10px] text-center">vs ₹130–160 in Zomato commission on this order</p>
      </div>
    </div>
  );
}

// ─── Games Card ───────────────────────────────────────────────────────────────
const GAME_ICONS = ["🎡", "🎯", "💘", "✨", "⚡"];

function GamesCard() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((i) => (i + 1) % GAME_ICONS.length), 1200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-violet-500/20 bg-violet-500/5 overflow-hidden min-h-[180px]">
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-violet-400 bg-violet-500/15 border border-violet-500/20 px-2.5 py-1 rounded-full">
          5 games
        </span>
        <h3 className="text-xl font-black text-white mt-3">Play While You Wait</h3>
        <p className="text-zinc-500 text-xs mt-1">Customers stay longer → order more.</p>
      </div>

      <div className="mt-4 flex gap-2">
        {GAME_ICONS.map((icon, i) => (
          <motion.div
            key={icon}
            animate={i === active ? { scale: 1.3, y: -4 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`flex-1 aspect-square rounded-2xl flex items-center justify-center text-xl border transition-colors ${
              i === active
                ? "bg-violet-500/25 border-violet-400/40"
                : "bg-white/4 border-white/8"
            }`}
          >
            {icon}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Buddy Card ────────────────────────────────────────────────────────────
const AI_CONVOS = [
  { q: "I want something spicy 🌶️", a: "Try our Dynamite Zinger (₹219) — crispy chicken with jalapeños. Pair with Cold Coffee to cool down! 😄" },
  { q: "Under ₹150 please 💰", a: "Garden Crunch Burger (₹169) + Masala Chai (₹49) = a full meal under ₹220. Best value on the menu!" },
  { q: "Build me a date combo 💑", a: "Double Patty Monster + Oreo Shake × 2 + Nutella Waffle to share. Total ₹656. Perfect date night! 💕" },
];

function AICard() {
  const [convoIdx, setConvoIdx] = useState(0);
  const [phase, setPhase] = useState<"question" | "typing" | "answer">("question");

  useEffect(() => {
    const cycle = () => {
      setPhase("question");
      setTimeout(() => setPhase("typing"), 1400);
      setTimeout(() => setPhase("answer"), 2600);
      setTimeout(() => {
        setConvoIdx((i) => (i + 1) % AI_CONVOS.length);
      }, 5000);
    };
    cycle();
    const t = setInterval(cycle, 5200);
    return () => clearInterval(t);
  }, []);

  const convo = AI_CONVOS[convoIdx];

  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-blue-500/20 bg-blue-500/5 overflow-hidden min-h-[200px]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/15 border border-blue-500/20 px-2.5 py-1 rounded-full">
            Knows your menu
          </span>
          <h3 className="text-xl font-black text-white mt-3">AI Buddy</h3>
          <p className="text-zinc-500 text-xs mt-1">Recommends. Upsells. Never sleeps.</p>
        </div>
        <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center mt-1" style={{ background: "linear-gradient(135deg,#7C3AED,#4F46E5)" }}>
          <Sparkles size={16} className="text-white" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {/* User message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${convoIdx}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div className="bg-blue-500/20 border border-blue-500/20 text-white text-[11px] px-3 py-2 rounded-2xl rounded-br-sm max-w-[80%]">
              {convo.q}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* AI response */}
        <div className="flex justify-start">
          {phase === "typing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/6 border border-white/10 px-3 py-2 rounded-2xl rounded-bl-sm"
            >
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                    className="w-1.5 h-1.5 bg-blue-400 rounded-full block"
                  />
                ))}
              </div>
            </motion.div>
          )}
          {phase === "answer" && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/6 border border-white/10 text-zinc-200 text-[11px] px-3 py-2 rounded-2xl rounded-bl-sm max-w-[85%] leading-relaxed"
            >
              {convo.a}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Today's Special Card ─────────────────────────────────────────────────────
function TodaySpecialCard() {
  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-amber-400/20 bg-amber-400/5 overflow-hidden min-h-[160px]">
      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/15 border border-amber-400/20 px-2.5 py-1 rounded-full">
          Daily spotlight
        </span>
        <h3 className="text-xl font-black text-white mt-3">Today&apos;s Special</h3>
        <p className="text-zinc-500 text-xs mt-1">Pin any item. Drive sales instantly.</p>
      </div>

      <motion.div
        animate={{ boxShadow: ["0 0 0 0 rgba(245,158,11,0)", "0 0 20px 4px rgba(245,158,11,0.3)", "0 0 0 0 rgba(245,158,11,0)"] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="mt-4 flex items-center gap-3 bg-amber-400/10 border border-amber-400/30 rounded-2xl p-3"
      >
        <span className="text-3xl">🍔</span>
        <div>
          <p className="text-white text-[11px] font-black">Dynamite Zinger ⭐</p>
          <p className="text-amber-400 text-[11px] font-bold">₹219</p>
          <p className="text-zinc-500 text-[10px]">Today&apos;s pick</p>
        </div>
        <div className="ml-auto">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-black text-xs font-black"
          >
            +
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Loyalty Stamps Card ──────────────────────────────────────────────────────
function LoyaltyCard() {
  const [stamps, setStamps] = useState(0);

  useEffect(() => {
    const fill = setInterval(() => {
      setStamps((s) => {
        if (s >= 5) {
          setTimeout(() => setStamps(0), 1000);
          return s;
        }
        return s + 1;
      });
    }, 600);
    return () => clearInterval(fill);
  }, []);

  return (
    <div className="relative h-full flex flex-col justify-between p-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden min-h-[180px]">
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/15 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          No app needed
        </span>
        <h3 className="text-xl font-black text-white mt-3">Loyalty Stamps</h3>
        <p className="text-zinc-500 text-xs mt-1">Visit 5×, earn a free reward.</p>
      </div>

      <div className="mt-4">
        <div className="flex gap-2 justify-center mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              animate={i < stamps
                ? { scale: [1, 1.25, 1], backgroundColor: "#10b981" }
                : { scale: 1, backgroundColor: "rgba(255,255,255,0.05)" }
              }
              transition={{ duration: 0.3, delay: i < stamps ? 0 : 0 }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-base"
              style={{ borderColor: i < stamps ? "#10b981" : "rgba(255,255,255,0.1)" }}
            >
              {i < stamps ? "✓" : ""}
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {stamps >= 5 && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-emerald-400 text-xs font-black"
            >
              🎉 Free Cold Coffee unlocked!
            </motion.p>
          )}
        </AnimatePresence>
        {stamps < 5 && (
          <p className="text-center text-zinc-600 text-[10px]">{5 - stamps} more visit{5 - stamps !== 1 ? "s" : ""} to earn your reward</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
const fade = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function FeaturesSection() {
  return (
    <section className="px-6 py-24 bg-white/[0.015] border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fade} transition={{ duration: 0.5 }} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black mb-3">Everything in one QR code</h2>
          <p className="text-zinc-500 text-sm max-w-lg mx-auto">
            Six features that work together. Your customers see a seamless experience. You see more orders.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {/* Row 1: QR (wide) + WhatsApp */}
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.05 }} className="lg:col-span-2">
            <QRCard />
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.1 }}>
            <WhatsAppCard />
          </motion.div>

          {/* Row 2: Games + AI (wide) */}
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.15 }}>
            <GamesCard />
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.2 }} className="lg:col-span-2">
            <AICard />
          </motion.div>

          {/* Row 3: Today's Special + Loyalty (wide) */}
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.25 }}>
            <TodaySpecialCard />
          </motion.div>
          <motion.div {...fade} transition={{ duration: 0.4, delay: 0.3 }} className="lg:col-span-2">
            <LoyaltyCard />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
