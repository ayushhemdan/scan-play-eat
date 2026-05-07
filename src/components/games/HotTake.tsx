"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Zap } from "lucide-react";

const DILEMMAS = [
  "Burgers for life 🍔 OR never eat fries again 🚫🍟",
  "Only eat at one cafe forever 🏠 OR never return to any cafe twice 🚪",
  "Eat your fave food cold always 🥶 OR eat something you hate piping hot 🔥",
  "No sauce ever again 😭 OR only eat with chopsticks 🥢",
  "Share every meal 👫 OR always eat alone 🙍",
  "Free meal but you can't choose 🎲 OR pay double for exactly what you want 💸",
  "Eat the same breakfast forever 🥣 OR skip breakfast for life ⏭️",
  "Cook every meal yourself 👨‍🍳 OR eat out for every single meal 🍽️",
  "Never use your phone while eating 📵 OR always eat alone 🙍",
  "Unlimited dessert 🍰 OR unlimited mains but zero dessert ever 🍔",
  "Best burger once in your life 🏆 OR a decent burger every single day 🔄",
  "Food always slightly cold 🌡️ OR always slightly overcooked 🔥",
  "Always be the one who pays 💳 OR always arrive last 🐢",
  "Never spicy food again 🙅 OR only spicy for the rest of your life 🌶️",
  "Every meal is a surprise 🎁 OR know your meals 3 days in advance 📅",
  "Eat in silence every meal 🤫 OR always eat with extremely loud music 🎸",
  "All food tastes like chicken 🍗 OR everything looks like chicken but tastes right 😭",
  "Eat in the dark every meal 🌑 OR everyone watches you eat 👀",
  "Only eat sitting on the floor 🧘 OR eat standing at a counter always 🏃",
  "Your food always looks terrible 😬 OR always smells terrible but tastes amazing 🤢",
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

  // Split dilemma into two sides on " OR "
  const raw = deck[index];
  const splitIdx = raw.search(/ OR /i);
  const left = splitIdx > -1 ? raw.slice(0, splitIdx).trim() : raw;
  const right = splitIdx > -1 ? raw.slice(splitIdx + 4).trim() : "";

  return (
    <div className="max-w-lg mx-auto">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm mb-6 transition-colors font-semibold"
        style={{ color: "#fb923c" }}
      >
        <ArrowLeft size={15} /> Back to games
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full mb-3">
          <Zap size={14} className="text-orange-400" />
          <span className="text-orange-400 font-black text-sm uppercase tracking-widest">Hot Take</span>
        </div>
        <p className="text-zinc-400 text-sm leading-relaxed">
          Everyone shouts their answer <strong className="text-white">simultaneously</strong>. No thinking. No changing.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-1 mb-6">
        {deck.map((_, i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: i <= index ? "#fb923c" : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>

      {/* Dilemma — VS split card */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, scale: 0.94, x: direction * 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.94, x: direction * -30 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="relative mb-5"
        >
          <div className="grid grid-cols-2 rounded-3xl overflow-hidden border border-orange-500/20 min-h-52">
            {/* Left choice */}
            <div className="bg-orange-500/10 p-6 flex flex-col items-center justify-center text-center">
              <p className="text-white font-bold text-base leading-snug">{left}</p>
            </div>
            {/* Right choice */}
            <div className="border-l border-orange-500/15 bg-white/4 p-6 flex flex-col items-center justify-center text-center">
              <p className="text-white font-bold text-base leading-snug">{right || left}</p>
            </div>
          </div>

          {/* OR badge in center */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10 pointer-events-none">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="bg-orange-500 text-black font-black text-xs px-2.5 py-1.5 rounded-full shadow-lg"
              style={{ boxShadow: "0 4px 20px rgba(249,115,22,0.5)" }}
            >
              OR
            </motion.span>
          </div>

          {/* Countdown ring */}
          {countdown !== null && countdown > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-14 h-14"
            >
              <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24" fill="none"
                  stroke="#fb923c"
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
        </motion.div>
      </AnimatePresence>

      {/* SHOUT banner */}
      <AnimatePresence>
        {timerDone && (
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-3 mb-4"
          >
            <motion.p
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 0.4, repeat: 3 }}
              className="text-orange-400 font-black text-2xl"
            >
              SHOUT IT! 📣
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={restart}
          className="px-4 py-3 rounded-2xl border border-white/8 bg-white/4 text-zinc-400 hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
        </button>

        {countdown === null ? (
          <button
            onClick={startTimer}
            className="flex-1 py-3 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-opacity hover:opacity-85"
            style={{ background: "#fb923c", boxShadow: "0 6px 24px rgba(249,115,22,0.4)" }}
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
