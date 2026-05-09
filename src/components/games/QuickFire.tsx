"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Zap, Trophy } from "lucide-react";

const ROUNDS = 7;
const TOTAL_TIME = 8;

const CATEGORIES = [
  "Name a cold drink 🥤",
  "Name a burger topping 🍔",
  "Name something sweet 🍰",
  "Name a type of coffee ☕",
  "Name a spicy food 🌶️",
  "Name a sandwich filling 🥪",
  "Name a fruit 🍎",
  "Name a breakfast dish 🍳",
  "Name a sauce or dip 🫙",
  "Name a dessert 🍮",
  "Name something you dip fries in 🍟",
  "Name a type of tea 🍵",
  "Name a street food 🌮",
  "Name a milkshake flavour 🥛",
  "Name something you crave at midnight 🌙",
  "Name a crunchy snack 🍿",
  "Name something grilled 🔥",
  "Name a type of bread 🍞",
  "Name a comfort food ❤️",
  "Name something you find in a café ☕",
  "Name a pizza topping 🍕",
  "Name a food that's yellow 💛",
  "Name a food better when shared 👫",
  "Name a food that makes you sleepy 😴",
  "Name a drink with ice 🧊",
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const P1 = { color: "#7C3AED", light: "rgba(124,58,237,0.18)", glow: "rgba(124,58,237,0.5)" };
const P2 = { color: "#EA580C", light: "rgba(234,88,12,0.18)", glow: "rgba(234,88,12,0.5)" };

type Phase = "setup" | "countdown" | "buzz" | "buzzed" | "result";

interface Props { onBack: () => void }

export default function QuickFire({ onBack }: Props) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [names, setNames] = useState(["Player 1", "Player 2"]);
  const [scores, setScores] = useState([0, 0]);
  const [round, setRound] = useState(0);
  const [categories] = useState(() => shuffle(CATEGORIES).slice(0, ROUNDS));
  const [countdown, setCountdown] = useState(3);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [buzzedBy, setBuzzedBy] = useState<0 | 1 | null>(null);
  const buzzLocked = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

  // Countdown 3-2-1-GO
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown <= 0) { setPhase("buzz"); setTimeLeft(TOTAL_TIME); buzzLocked.current = false; return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 700);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // In-round timer
  useEffect(() => {
    if (phase !== "buzz") { clearTimer(); return; }
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearTimer();
          // Time's up — no one buzzed, go next
          const nextRound = round + 1;
          if (nextRound >= ROUNDS) { setRound(nextRound); setPhase("result"); }
          else { setRound(nextRound); setCountdown(3); setPhase("countdown"); buzzLocked.current = false; }
          return TOTAL_TIME;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [phase, round]);

  const startGame = useCallback(() => {
    setScores([0, 0]);
    setRound(0);
    setBuzzedBy(null);
    buzzLocked.current = false;
    setCountdown(3);
    setPhase("countdown");
  }, []);

  const handleBuzz = (player: 0 | 1) => {
    if (buzzLocked.current || phase !== "buzz") return;
    buzzLocked.current = true;
    clearTimer();
    setBuzzedBy(player);
    setPhase("buzzed");
  };

  const handleAnswer = (correct: boolean) => {
    const newScores = [...scores];
    if (correct && buzzedBy !== null) newScores[buzzedBy] += 1;
    setScores(newScores);
    const nextRound = round + 1;
    if (nextRound >= ROUNDS) { setRound(nextRound); setPhase("result"); }
    else { setRound(nextRound); setBuzzedBy(null); setCountdown(3); setPhase("countdown"); buzzLocked.current = false; }
  };

  const winner = scores[0] > scores[1] ? 0 : scores[1] > scores[0] ? 1 : null;

  // ── Setup ──────────────────────────────────────────────────────────────────

  if (phase === "setup") {
    return (
      <div className="max-w-lg mx-auto">
        <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-8 font-semibold" style={{ color: "#facc15" }}>
          <ArrowLeft size={15} /> Back to games
        </button>

        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl mb-4 inline-block">⚡</motion.div>
          <h2 className="text-4xl font-black text-white mb-2">Quick Fire</h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
            Place the phone between you. Slam your side first when a category appears. Say the answer. 7 rounds. Winner takes glory.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          {[0, 1].map(i => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border transition-all"
              style={{ background: i === 0 ? P1.light : P2.light, borderColor: i === 0 ? `${P1.color}50` : `${P2.color}50` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0"
                style={{ background: i === 0 ? P1.color : P2.color }}>
                {i + 1}
              </div>
              <input
                value={names[i]}
                onChange={e => setNames(prev => { const n = [...prev]; n[i] = e.target.value; return n; })}
                className="flex-1 bg-transparent text-white font-bold text-lg outline-none placeholder-zinc-600"
                placeholder={`Player ${i + 1} name`}
              />
            </div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={startGame}
          className="w-full py-5 rounded-3xl font-black text-xl text-white flex items-center justify-center gap-3"
          style={{ background: `linear-gradient(135deg, ${P1.color}, ${P2.color})`, boxShadow: `0 12px 40px rgba(124,58,237,0.4)` }}
        >
          <Zap size={22} /> Let&apos;s GO!
        </motion.button>
      </div>
    );
  }

  // ── Result ─────────────────────────────────────────────────────────────────

  if (phase === "result") {
    const p = winner === null ? null : winner === 0 ? P1 : P2;
    return (
      <div className="max-w-lg mx-auto text-center py-4">
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }} className="text-8xl mb-5">
          {winner === null ? "🤝" : "🏆"}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-black text-white mb-1">
            {winner === null ? "It's a Tie!" : `${names[winner]} Wins!`}
          </h2>
          {winner !== null && (
            <p className="font-bold mb-6" style={{ color: p?.color }}>
              {scores[winner]}–{scores[winner === 0 ? 1 : 0]} 🔥
            </p>
          )}
          {winner === null && <p className="text-zinc-500 mb-6">{scores[0]} – {scores[1]}</p>}

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[0, 1].map(i => {
              const pp = i === 0 ? P1 : P2;
              const isWinner = winner === i;
              return (
                <div key={i} className="rounded-2xl p-5 border" style={{ background: pp.light, borderColor: `${pp.color}50` }}>
                  {isWinner && <Trophy size={18} className="mx-auto mb-2" style={{ color: pp.color }} />}
                  <p className="text-4xl font-black text-white">{scores[i]}</p>
                  <p className="text-sm mt-1 font-semibold" style={{ color: pp.color }}>{names[i]}</p>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <motion.button whileTap={{ scale: 0.95 }} onClick={startGame}
              className="flex-1 py-3.5 rounded-2xl font-black text-white flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${P1.color}, ${P2.color})` }}>
              <Zap size={16} /> Play Again
            </motion.button>
            <button onClick={onBack}
              className="px-5 py-3.5 rounded-2xl border border-white/10 text-zinc-400 font-semibold hover:text-white transition-colors">
              Done
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Active game — full screen ──────────────────────────────────────────────

  const timerPct = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#080808]" style={{ userSelect: "none", WebkitUserSelect: "none" }}>

      {/* Score bar */}
      <div className="flex items-center shrink-0 bg-black/60 border-b border-white/8">
        <div className="flex-1 flex items-center gap-3 px-5 py-3">
          <div className="w-8 h-8 rounded-xl font-black text-white text-sm flex items-center justify-center" style={{ background: P1.color }}>1</div>
          <div>
            <p className="font-black text-white text-sm leading-none">{names[0]}</p>
            <p className="text-xs mt-0.5" style={{ color: P1.color }}>{scores[0]} pts</p>
          </div>
        </div>
        <div className="text-center px-4">
          <p className="text-zinc-500 text-[11px] uppercase tracking-widest">Round</p>
          <p className="text-white font-black">{Math.min(round + 1, ROUNDS)}/{ROUNDS}</p>
        </div>
        <div className="flex-1 flex items-center gap-3 px-5 py-3 justify-end">
          <div className="text-right">
            <p className="font-black text-white text-sm leading-none">{names[1]}</p>
            <p className="text-xs mt-0.5" style={{ color: P2.color }}>{scores[1]} pts</p>
          </div>
          <div className="w-8 h-8 rounded-xl font-black text-white text-sm flex items-center justify-center" style={{ background: P2.color }}>2</div>
        </div>
      </div>

      {/* Player 1 — top zone (upside down for player across) */}
      <motion.div
        animate={{ flex: phase === "buzzed" ? (buzzedBy === 0 ? 1.8 : 0.4) : 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ background: phase === "buzzed" && buzzedBy !== 0 ? "rgba(0,0,0,0.7)" : `linear-gradient(to bottom, ${P1.color}ee, ${P1.color}55)` }}
        onPointerDown={() => handleBuzz(0)}
      >
        {/* Glow */}
        {(phase !== "buzzed" || buzzedBy === 0) && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${P1.glow} 0%, transparent 70%)`, opacity: 0.4 }} />
        )}

        <div className="text-center rotate-180 pointer-events-none select-none">
          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.p key={`c1-${countdown}`} initial={{ scale: 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="text-8xl font-black text-white drop-shadow-lg">
                {countdown === 0 ? "GO!" : countdown}
              </motion.p>
            )}
            {phase === "buzz" && (
              <motion.div key="tap1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-6xl font-black text-white/50">TAP!</p>
              </motion.div>
            )}
            {phase === "buzzed" && buzzedBy === 0 && (
              <motion.div key="buzz1" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <p className="text-7xl mb-2">⚡</p>
                <p className="text-5xl font-black text-white drop-shadow-lg">BUZZ!</p>
                <p className="text-white/70 text-lg font-bold mt-2">{names[0]}</p>
              </motion.div>
            )}
            {phase === "buzzed" && buzzedBy !== 0 && (
              <p key="sleep1" className="text-5xl opacity-25">😴</p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Center strip */}
      <div className="shrink-0 bg-[#0d0d0d] z-10 border-y border-white/10">
        {/* Timer bar */}
        {phase === "buzz" && (
          <div className="h-1 bg-white/8">
            <motion.div className="h-full rounded-full" style={{ width: `${timerPct}%`, background: timerPct > 50 ? "#22c55e" : timerPct > 25 ? "#f59e0b" : "#ef4444" }}
              transition={{ duration: 0.5 }} />
          </div>
        )}

        <div className="px-5 py-4 text-center">
          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.p key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-zinc-500 text-sm py-1">
                Get ready to tap your side...
              </motion.p>
            )}
            {phase === "buzz" && (
              <motion.div key={`cat-${round}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-[11px] uppercase tracking-widest text-zinc-600 mb-1">Category</p>
                <p className="text-white font-black text-xl leading-snug">{categories[round]}</p>
                <p className="text-zinc-600 text-xs mt-1">{timeLeft}s remaining</p>
              </motion.div>
            )}
            {phase === "buzzed" && (
              <motion.div key="answer" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-white font-bold text-sm mb-0.5">
                  ⚡ <span style={{ color: buzzedBy === 0 ? P1.color : P2.color }}>{names[buzzedBy!]}</span> buzzed first!
                </p>
                <p className="text-zinc-500 text-xs mb-3">Say your answer out loud, then tap:</p>
                <div className="flex gap-2">
                  <button onClick={() => handleAnswer(true)}
                    className="flex-1 py-2.5 rounded-xl font-black text-white text-sm bg-green-500 active:scale-95 transition-transform">
                    ✅ Correct +1
                  </button>
                  <button onClick={() => handleAnswer(false)}
                    className="flex-1 py-2.5 rounded-xl font-black text-white text-sm bg-red-500 active:scale-95 transition-transform">
                    ❌ Wrong
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Player 2 — bottom zone */}
      <motion.div
        animate={{ flex: phase === "buzzed" ? (buzzedBy === 1 ? 1.8 : 0.4) : 1 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        className="relative flex items-center justify-center overflow-hidden cursor-pointer"
        style={{ background: phase === "buzzed" && buzzedBy !== 1 ? "rgba(0,0,0,0.7)" : `linear-gradient(to top, ${P2.color}ee, ${P2.color}55)` }}
        onPointerDown={() => handleBuzz(1)}
      >
        {(phase !== "buzzed" || buzzedBy === 1) && (
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${P2.glow} 0%, transparent 70%)`, opacity: 0.4 }} />
        )}

        <div className="text-center pointer-events-none select-none">
          <AnimatePresence mode="wait">
            {phase === "countdown" && (
              <motion.p key={`c2-${countdown}`} initial={{ scale: 2.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                className="text-8xl font-black text-white drop-shadow-lg">
                {countdown === 0 ? "GO!" : countdown}
              </motion.p>
            )}
            {phase === "buzz" && (
              <motion.div key="tap2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-6xl font-black text-white/50">TAP!</p>
              </motion.div>
            )}
            {phase === "buzzed" && buzzedBy === 1 && (
              <motion.div key="buzz2" initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}>
                <p className="text-7xl mb-2">⚡</p>
                <p className="text-5xl font-black text-white drop-shadow-lg">BUZZ!</p>
                <p className="text-white/70 text-lg font-bold mt-2">{names[1]}</p>
              </motion.div>
            )}
            {phase === "buzzed" && buzzedBy !== 1 && (
              <p key="sleep2" className="text-5xl opacity-25">😴</p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
