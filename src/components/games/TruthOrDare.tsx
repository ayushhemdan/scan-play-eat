"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, ArrowLeft, RotateCcw } from "lucide-react";

type Card = { type: "truth" | "dare"; text: string };

const CARDS: Card[] = [
  // ── Truths ────────────────────────────────────────────────────────────────
  { type: "truth", text: "What was your first thought when you saw this person today?" },
  { type: "truth", text: "What's the most embarrassing thing you've ever ordered at a restaurant?" },
  { type: "truth", text: "If you could only eat one item from this menu for a month, what would it be?" },
  { type: "truth", text: "What's a secret talent nobody at this table knows about?" },
  { type: "truth", text: "What's the cheesiest thing you've ever done to impress someone?" },
  { type: "truth", text: "Rate everyone at the table on their food taste from 1–10." },
  { type: "truth", text: "What's the weirdest food combination you actually enjoy?" },
  { type: "truth", text: "Have you ever lied about liking someone's cooking? Who was it?" },
  { type: "truth", text: "What's the most you've ever spent on a single meal? Was it worth it?" },
  { type: "truth", text: "If this cafe named a burger after you, what would be in it?" },
  { type: "truth", text: "Who at this table would you trust to order for you without seeing the menu?" },
  { type: "truth", text: "What's something you pretend to like but actually hate?" },
  // ── Dares ─────────────────────────────────────────────────────────────────
  { type: "dare", text: "Feed someone at the table a bite of your food — no hands allowed." },
  { type: "dare", text: "Do your best impression of a food critic reviewing what you ordered. Be dramatic." },
  { type: "dare", text: "Swap your meal with the person next to you for the next 3 bites." },
  { type: "dare", text: "Take a ridiculous selfie and set it as your WhatsApp profile picture for 1 hour." },
  { type: "dare", text: "Call someone not here and describe your food so well they get hungry." },
  { type: "dare", text: "Come up with a full jingle for this cafe on the spot. Must be at least 15 seconds." },
  { type: "dare", text: "Attempt to eat your next bite using only your non-dominant hand." },
  { type: "dare", text: "Write a 5-star Google review for this cafe right now — and actually post it." },
  { type: "dare", text: "Ask the waiter what their personal favourite item is and order it without question." },
  { type: "dare", text: "Do a 10-second food commercial for any item on the table. Sell it hard." },
  { type: "dare", text: "Draw a quick portrait of someone at the table. They rate it. No deleting." },
  { type: "dare", text: "Text someone 'I think I'm in love with a burger' and screenshot the reply." },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props {
  onBack: () => void;
}

export default function TruthOrDare({ onBack }: Props) {
  const deck = useMemo(() => shuffle(CARDS), []);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const card = deck[index];
  const isLast = index === deck.length - 1;

  const next = () => {
    if (isLast) return;
    setDirection(1);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setDirection(-1);
    setIndex(0);
  };

  const isTruth = card.type === "truth";

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors font-semibold"
        style={{ color: "#60a5fa" }}
      >
        <ArrowLeft size={15} /> Back to games
      </button>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {deck.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background:
                i < index
                  ? "rgb(var(--brand-rgb))"
                  : i === index
                  ? "rgba(var(--brand-rgb) / 0.5)"
                  : "rgba(255,255,255,0.1)",
            }}
          />
        ))}
      </div>

      {/* Card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, x: direction * 60, rotateY: direction * 15 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          exit={{ opacity: 0, x: direction * -60 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="rounded-3xl border p-8 md:p-10 min-h-65 flex flex-col items-center justify-center text-center relative overflow-hidden"
          style={{
            borderColor: isTruth
              ? "rgba(59,130,246,0.25)"
              : "rgba(239,68,68,0.25)",
            background: isTruth
              ? "rgba(59,130,246,0.05)"
              : "rgba(239,68,68,0.05)",
          }}
        >
          {/* Glow blob */}
          <div
            className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              background: isTruth ? "#3b82f6" : "#ef4444",
            }}
          />

          {/* Badge */}
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border mb-6 ${
              isTruth
                ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
                : "bg-red-500/15 text-red-400 border-red-500/25"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTruth ? "bg-blue-400" : "bg-red-400"
              }`}
            />
            {isTruth ? "Truth" : "Dare"}
          </span>

          <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed relative z-10">
            {card.text}
          </p>

          <p className="text-zinc-600 text-xs mt-6">
            {index + 1} / {deck.length}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={restart}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border border-white/8 bg-white/4 text-zinc-400 hover:text-white transition-colors text-sm"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={next}
          disabled={isLast}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-[#0a0a0a]"
          style={{ background: "rgb(var(--brand-rgb))" }}
        >
          <RefreshCw size={15} />
          {isLast ? "All done!" : "Next Card"}
        </button>
      </div>
    </div>
  );
}
