"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, ShoppingCart } from "lucide-react";
import type { Cafe, MenuItem } from "@/types/cafe";

const QUESTIONS: { q: string; opts: { label: string; value: string }[] }[] = [
  {
    q: "How hungry are you right now?",
    opts: [
      { label: "😤 Absolutely starving", value: "starving" },
      { label: "😊 Pretty hungry", value: "hungry" },
      { label: "👀 Just a little something", value: "light" },
      { label: "🍰 Just want something sweet", value: "sweet" },
    ],
  },
  {
    q: "What's your vibe today?",
    opts: [
      { label: "🔥 Adventurous — surprise me", value: "adventurous" },
      { label: "😌 Comfort — the classics", value: "comfort" },
      { label: "🌿 Light & fresh", value: "fresh" },
      { label: "🎉 Celebrating something", value: "celebrate" },
    ],
  },
  {
    q: "Spice preference?",
    opts: [
      { label: "🌶️🌶️🌶️ Bring the heat", value: "spicy" },
      { label: "🌶️ A little kick is fine", value: "mild-spicy" },
      { label: "😊 Not spicy at all", value: "no-spice" },
      { label: "🤷 Whatever, doesn't matter", value: "any" },
    ],
  },
  {
    q: "Veg or Non-Veg?",
    opts: [
      { label: "🥬 Veg only", value: "veg" },
      { label: "🍗 Non-Veg please", value: "non-veg" },
      { label: "✌️ Either works for me", value: "both" },
    ],
  },
];

type Answers = (string | null)[];

function recommend(answers: Answers, menu: MenuItem[]): MenuItem | null {
  const [hunger, vibe, spice, vegPref] = answers;

  let pool = menu.filter((i) => !i.soldOut);

  // Veg filter
  if (vegPref === "veg") pool = pool.filter((i) => i.isVeg);
  if (vegPref === "non-veg") pool = pool.filter((i) => !i.isVeg);

  // Category preference by hunger
  if (hunger === "sweet") pool = pool.filter((i) => i.category === "desserts");
  else if (hunger === "light") pool = pool.filter((i) =>
    ["cafe-bites", "sides", "beverages", "cold-drinks", "hot-drinks"].includes(i.category)
  );
  else pool = pool.filter((i) =>
    ["burgers", "cafe-bites", "sides"].includes(i.category)
  );

  // Spice filter
  if (spice === "no-spice") pool = pool.filter((i) => !i.badges?.includes("spicy"));
  if (spice === "spicy" || spice === "mild-spicy") {
    const spicyPool = pool.filter((i) => i.badges?.includes("spicy"));
    if (spicyPool.length > 0) pool = spicyPool;
  }

  // Vibe scoring — prefer certain badges
  const scored = pool.map((item) => {
    let score = 0;
    if (vibe === "adventurous" && item.badges?.includes("must-try")) score += 3;
    if (vibe === "adventurous" && item.badges?.includes("new")) score += 2;
    if (vibe === "comfort" && item.badges?.includes("bestseller")) score += 3;
    if (vibe === "celebrate" && item.badges?.includes("must-try")) score += 2;
    if (vibe === "fresh" && item.isVeg) score += 2;
    if (hunger === "starving" && item.price >= 180) score += 1;
    if (hunger === "light" && item.price <= 130) score += 1;
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.item ?? pool[0] ?? menu[0] ?? null;
}

interface Props {
  cafe: Cafe;
  onBack: () => void;
}

export default function VibeQuiz({ cafe, onBack }: Props) {
  const [answers, setAnswers] = useState<Answers>(Array(QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const picked = answers[step];

  const pick = (val: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = val;
      return next;
    });
  };

  const advance = () => {
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setDone(false);
  };

  const recommendation = done ? recommend(answers, cafe.menu) : null;

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to games
      </button>

      <AnimatePresence mode="wait">
        {/* Result */}
        {done && recommendation ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-zinc-500 text-sm mb-2">Based on your vibe, we think you&apos;ll love...</p>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="rounded-3xl border border-white/10 bg-white/4 p-8 mb-6 relative overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{ background: "rgb(var(--brand-rgb))" }}
              />

              <div className="text-7xl mb-4">{recommendation.emoji}</div>
              <h3 className="text-2xl font-black text-white mb-1">{recommendation.name}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-3">{recommendation.description}</p>
              <p className="text-2xl font-black" style={{ color: "rgb(var(--brand-rgb))" }}>
                ₹{recommendation.price}
              </p>

              {recommendation.badges && recommendation.badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {recommendation.badges.map((b) => (
                    <span key={b} className="text-[10px] text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full capitalize">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              href="#menu"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[#0a0a0a] mb-4"
              style={{ background: "rgb(var(--brand-rgb))" }}
            >
              <ShoppingCart size={15} />
              Add to order
            </motion.a>

            <div className="mt-2">
              <button
                onClick={reset}
                className="flex items-center gap-2 mx-auto text-zinc-500 hover:text-white text-sm transition-colors"
              >
                <RotateCcw size={13} /> Try again
              </button>
            </div>
          </motion.div>
        ) : (
          /* Question */
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < step ? "rgb(var(--brand-rgb))"
                      : i === step ? "rgba(var(--brand-rgb) / 0.4)"
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>

            <p className="text-white text-xl font-bold mb-5 leading-snug">{q.q}</p>

            <div className="space-y-2.5 mb-6">
              {q.opts.map((opt) => {
                const selected = answers[step] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => pick(opt.value)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all"
                    style={
                      selected
                        ? {
                            borderColor: "rgb(var(--brand-rgb))",
                            background: "rgba(var(--brand-rgb) / 0.12)",
                            color: "#fff",
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            color: "#a1a1aa",
                          }
                    }
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <button
              onClick={advance}
              disabled={picked === null}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0a0a]"
              style={{ background: picked !== null ? "rgb(var(--brand-rgb))" : "rgba(255,255,255,0.1)" }}
            >
              {isLast ? "Find my vibe ✨" : "Next →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
