"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";

type Answer = string | null;
type PlayerAnswers = Answer[];

const QUESTIONS: { q: string; opts: string[] }[] = [
  {
    q: "Perfect way to spend a Saturday?",
    opts: ["Netflix marathon 🎬", "Outdoor adventure 🏕️", "Cafe hopping ☕", "Gaming all day 🎮"],
  },
  {
    q: "Your food order style?",
    opts: ["Order the same thing every time", "Always try something new", "Let someone else decide", "Ask the waiter what's best"],
  },
  {
    q: "Ideal evening together?",
    opts: ["Quiet dinner at home 🕯️", "Street food & long walk 🚶", "Movie + snacks 🎥", "Spontaneous road trip 🚗"],
  },
  {
    q: "If the food is late, you...",
    opts: ["Wait patiently 😌", "Get mildly annoyed 😤", "Start eating someone else's food 😂", "Go ask what's happening 🏃"],
  },
  {
    q: "Your dessert personality?",
    opts: ["Always order dessert 🍰", "Share one between two", "Skip it entirely", "Only if it's chocolate 🍫"],
  },
];

function calcScore(p1: PlayerAnswers, p2: PlayerAnswers): number {
  const matches = p1.filter((a, i) => a !== null && a === p2[i]).length;
  return Math.round((matches / QUESTIONS.length) * 100);
}

function resultLabel(score: number): { emoji: string; title: string; subtitle: string } {
  if (score >= 80)
    return { emoji: "💖", title: "Perfect Match!", subtitle: "You two are made for each other. Celebrate with an extra milkshake." };
  if (score >= 60)
    return { emoji: "💕", title: "Really Compatible!", subtitle: "Solid chemistry. A little difference keeps things exciting." };
  if (score >= 40)
    return { emoji: "🤝", title: "Interesting Combo!", subtitle: "Opposites attract. You balance each other out nicely." };
  return { emoji: "🌶️", title: "Fire & Ice!", subtitle: "Wildly different — but that's what makes it fun. Embrace it." };
}

interface Props {
  onBack: () => void;
}

type Phase = "p1" | "p2" | "result";

export default function CompatibilityQuiz({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("p1");
  const [p1Answers, setP1Answers] = useState<PlayerAnswers>(Array(QUESTIONS.length).fill(null));
  const [p2Answers, setP2Answers] = useState<PlayerAnswers>(Array(QUESTIONS.length).fill(null));
  const [step, setStep] = useState(0);

  const answers = phase === "p1" ? p1Answers : p2Answers;
  const setAnswers = phase === "p1" ? setP1Answers : setP2Answers;
  const q = QUESTIONS[step];
  const isLastQ = step === QUESTIONS.length - 1;
  const allFilled = answers.every((a) => a !== null);

  const pick = (opt: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[step] = opt;
      return next;
    });
  };

  const advance = () => {
    if (!isLastQ) {
      setStep((s) => s + 1);
    } else if (phase === "p1") {
      setPhase("p2");
      setStep(0);
    } else {
      setPhase("result");
    }
  };

  const reset = () => {
    setPhase("p1");
    setStep(0);
    setP1Answers(Array(QUESTIONS.length).fill(null));
    setP2Answers(Array(QUESTIONS.length).fill(null));
  };

  const score = phase === "result" ? calcScore(p1Answers, p2Answers) : 0;
  const result = resultLabel(score);
  const playerColor = phase === "p1" ? "#f97316" : "#ec4899";
  const playerLabel = phase === "p1" ? "Player 1" : "Player 2";

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to games
      </button>

      <AnimatePresence mode="wait">
        {/* Result screen */}
        {phase === "result" ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
              className="text-8xl mb-4"
            >
              {result.emoji}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Score ring */}
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke="rgb(var(--brand-rgb))"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - score / 100)}`}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white">{score}%</span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-white mb-2">{result.title}</h3>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto leading-relaxed">{result.subtitle}</p>

              <button
                onClick={reset}
                className="mt-8 flex items-center gap-2 mx-auto px-5 py-2.5 rounded-full border border-white/10 text-zinc-400 hover:text-white text-sm transition-colors"
              >
                <RotateCcw size={13} /> Play again
              </button>
            </motion.div>
          </motion.div>
        ) : (
          /* Question screen */
          <motion.div key={`${phase}-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {/* Player indicator */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: playerColor }}
              >
                {phase === "p1" ? "1" : "2"}
              </span>
              <span className="text-white font-semibold">{playerLabel}&apos;s turn</span>
              <span className="ml-auto text-zinc-600 text-xs">{step + 1} / {QUESTIONS.length}</span>
            </div>

            {/* Progress */}
            <div className="flex gap-1 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className="h-1 flex-1 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < step ? playerColor
                      : i === step ? `${playerColor}80`
                      : "rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>

            {/* Question */}
            <p className="text-white text-xl font-bold mb-5 leading-snug">{q.q}</p>

            {/* Options */}
            <div className="space-y-2.5 mb-6">
              {q.opts.map((opt) => {
                const selected = answers[step] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => pick(opt)}
                    className="w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all"
                    style={
                      selected
                        ? { borderColor: playerColor, background: `${playerColor}18`, color: "#fff" }
                        : { borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#a1a1aa" }
                    }
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            <button
              onClick={advance}
              disabled={answers[step] === null}
              className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white"
              style={{ background: answers[step] !== null ? playerColor : "rgba(255,255,255,0.1)" }}
            >
              {isLastQ && phase === "p1" ? "Hand to Player 2 →" : isLastQ ? "See Results 🎉" : "Next →"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
