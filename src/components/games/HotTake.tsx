"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";

const DILEMMAS = [
  "Burgers for life 🍔  OR  never eat fries again 🚫🍟",
  "Only eat at one cafe forever 🏠  OR  never return to any cafe twice 🚪",
  "Eat your fave food cold always 🥶  OR  eat something you hate piping hot 🔥",
  "No sauce ever again 😭  OR  only eat with chopsticks 🥢",
  "Share every meal 👫  OR  always eat alone 🙍",
  "Free meal but you can't choose 🎲  OR  pay double for exactly what you want 💸",
  "Eat the same breakfast forever 🥣  OR  skip breakfast for life ⏭️",
  "Cook every meal yourself 👨‍🍳  OR  eat out for every single meal 🍽️",
  "Never use your phone while eating 📵  OR  always eat alone 🙍",
  "Unlimited dessert 🍰  OR  unlimited mains but zero dessert ever 🍔",
  "Best burger once in your life 🏆  OR  a decent burger every single day 🔄",
  "Food always slightly cold 🌡️  OR  always slightly overcooked 🔥",
  "Always be the one who pays 💳  OR  always arrive last 🐢",
  "Never spicy food again 🙅  OR  only spicy for the rest of your life 🌶️",
  "Every meal is a surprise 🎁  OR  know your meals 3 days in advance 📅",
  "Eat in silence every meal 🤫  OR  always eat with extremely loud music 🎸",
  "All your food tastes like chicken 🍗  OR  everything looks like chicken but tastes right 😭",
  "Eat in the dark every meal 🌑  OR  everyone watches you eat 👀",
  "Only eat sitting on the floor 🧘  OR  eat standing at a counter always 🏃",
  "Your food always looks terrible 😬  OR  always smells terrible but tastes amazing 🤢",
];

function shuffle<T>(arr: T[]) {
  return [...arr].sort(() => Math.random() - 0.5);
}

interface Props { onBack: () => void }

export default function HotTake({ onBack }: Props) {
  const deck = useMemo(() => shuffle(DILEMMAS), []);
  const [index, setIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (countdown === null || countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const startTimer = () => setCountdown(5);

  const next = () => {
    if (index >= deck.length - 1) return;
    setDirection(1);
    setCountdown(null);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setCountdown(null);
    setDirection(-1);
  };

  const timerDone = countdown === 0;

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={15} /> Back to games
      </button>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
          <Zap size={22} className="text-yellow-400" /> Hot Take
        </h2>
        <p className="text-zinc-500 text-sm mt-1">
          Everyone shouts their answer simultaneously. No thinking. No changing.
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 justify-center mb-6">
        {deck.map((_, i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: i <= index ? "rgb(var(--brand-rgb))" : "rgba(255,255,255,0.12)" }}
          />
        ))}
      </div>

      {/* Dilemma card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, scale: 0.92, x: direction * 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.92, x: direction * -40 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 md:p-10 min-h-[200px] flex flex-col items-center justify-center text-center relative overflow-hidden mb-5"
        >
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 0%, rgb(var(--brand-rgb)), transparent 70%)` }}
          />
          <Zap size={20} className="text-yellow-400 mb-4 opacity-60" />
          <p className="text-white text-lg md:text-xl font-bold leading-snug relative z-10">
            {deck[index]}
          </p>

          {/* Countdown ring */}
          {countdown !== null && countdown > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-6 relative w-14 h-14"
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="rgb(var(--brand-rgb))"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - countdown / 5)}`}
                  className="transition-all duration-1000 linear"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-black text-white text-lg">
                {countdown}
              </span>
            </motion.div>
          )}

          {timerDone && (
            <motion.p
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 text-yellow-400 font-black text-xl"
            >
              SHOUT IT! 📣
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={restart}
          className="px-4 py-3 rounded-2xl border border-white/8 bg-white/4 text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
        </button>

        {countdown === null ? (
          <button
            onClick={startTimer}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-[#0a0a0a] flex items-center justify-center gap-2"
            style={{ background: "rgb(var(--brand-rgb))" }}
          >
            <Zap size={15} /> Ready — Start Timer!
          </button>
        ) : (
          <button
            onClick={next}
            disabled={index >= deck.length - 1}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-white border border-white/10 bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            Next Dilemma →
          </button>
        )}
      </div>

      <p className="text-center text-zinc-600 text-xs mt-4">
        {index + 1} / {deck.length} dilemmas
      </p>
    </div>
  );
}
