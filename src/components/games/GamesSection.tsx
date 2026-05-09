"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Cafe } from "@/types/cafe";
import TruthOrDare from "./TruthOrDare";
import CompatibilityQuiz from "./CompatibilityQuiz";
import VibeQuiz from "./VibeQuiz";
import SpinWheel from "./SpinWheel";
import HotTake from "./HotTake";
import QuickFire from "./QuickFire";

type GameId = "truth-dare" | "compatibility" | "vibe-quiz" | "spin-wheel" | "hot-take" | "quick-fire";

const STAR: {
  id: GameId; emoji: string; title: string; desc: string; tag: string;
  accent: string; bg: string; border: string;
} = {
  id: "quick-fire",
  emoji: "⚡",
  title: "Quick Fire",
  desc: "Place the phone between you two. Slam your side first when the category drops. Say the answer. 7 rounds. One winner.",
  tag: "2 players",
  accent: "#facc15",
  bg: "linear-gradient(135deg, rgba(234,179,8,0.22) 0%, rgba(234,88,12,0.15) 60%, transparent 100%)",
  border: "rgba(250,204,21,0.35)",
};

const FEATURED: {
  id: GameId; emoji: string; title: string; desc: string; tag: string;
  accent: string; bg: string; border: string;
}[] = [
  {
    id: "spin-wheel",
    emoji: "🎡",
    title: "Spin the Wheel",
    desc: "Who pays the bill? Let fate decide. No arguments allowed.",
    tag: "Group game",
    accent: "#a78bfa",
    bg: "linear-gradient(135deg, rgba(109,40,217,0.28) 0%, rgba(109,40,217,0.06) 60%, transparent 100%)",
    border: "rgba(139,92,246,0.3)",
  },
  {
    id: "hot-take",
    emoji: "⚡",
    title: "Hot Take",
    desc: "Food dilemmas. Everyone shouts simultaneously. Pure delicious chaos.",
    tag: "Group game",
    accent: "#fb923c",
    bg: "linear-gradient(135deg, rgba(234,88,12,0.28) 0%, rgba(234,88,12,0.06) 60%, transparent 100%)",
    border: "rgba(249,115,22,0.3)",
  },
];

const REGULAR: {
  id: GameId; emoji: string; title: string; desc: string; tag: string;
  accent: string; bg: string; border: string;
}[] = [
  {
    id: "truth-dare",
    emoji: "🎯",
    title: "Truth or Dare",
    desc: "Fun questions & wild dares while you wait for your order.",
    tag: "2+ players",
    accent: "#60a5fa",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(59,130,246,0.2)",
  },
  {
    id: "compatibility",
    emoji: "💘",
    title: "Compatibility Quiz",
    desc: "How well do you two actually match? Find out in 5 questions.",
    tag: "Couple",
    accent: "#fb7185",
    bg: "rgba(225,29,72,0.08)",
    border: "rgba(244,63,94,0.2)",
  },
  {
    id: "vibe-quiz",
    emoji: "✨",
    title: "What's Your Vibe?",
    desc: "4 questions — we pick your perfect dish from the menu.",
    tag: "Solo",
    accent: "#34d399",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
];

interface Props { cafe: Cafe }

export default function GamesSection({ cafe }: Props) {
  const [activeGame, setActiveGame] = useState<GameId | null>(null);
  const back = () => setActiveGame(null);

  if (activeGame === "truth-dare") return <TruthOrDare onBack={back} />;
  if (activeGame === "compatibility") return <CompatibilityQuiz onBack={back} />;
  if (activeGame === "vibe-quiz") return <VibeQuiz cafe={cafe} onBack={back} />;
  if (activeGame === "spin-wheel") return <SpinWheel onBack={back} />;
  if (activeGame === "hot-take") return <HotTake onBack={back} />;
  if (activeGame === "quick-fire") return <QuickFire onBack={back} />;

  return (
    <div className="max-w-2xl mx-auto md:max-w-none">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="text-4xl"
          >
            🎮
          </motion.span>
          <div>
            <h2 className="text-2xl font-black text-white leading-none">Play While You Wait</h2>
            <p className="text-zinc-500 text-sm mt-1">Food is on its way — let the games begin</p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            6 Games
          </span>
        </div>
      </div>

      {/* ⭐ Star game — full width hero */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveGame(STAR.id)}
        className="relative group text-left rounded-3xl overflow-hidden p-6 mb-4 w-full"
        style={{ background: STAR.bg, border: `1px solid ${STAR.border}` }}
      >
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: STAR.accent }}
        />
        <div className="relative z-10 flex items-center gap-5">
          <motion.span
            animate={{ rotate: [0, -15, 15, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-6xl shrink-0"
          >
            {STAR.emoji}
          </motion.span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full text-black"
                style={{ background: STAR.accent }}>
                ⭐ FEATURED
              </span>
              <span className="text-[10px] text-zinc-400">{STAR.tag}</span>
            </div>
            <h3 className="font-black text-white text-2xl leading-tight mb-1">{STAR.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{STAR.desc}</p>
          </div>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-2xl font-black shrink-0"
            style={{ color: STAR.accent }}
          >
            →
          </motion.span>
        </div>
      </motion.button>

      {/* Featured — big cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {FEATURED.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveGame(game.id)}
            className="relative group text-left rounded-3xl overflow-hidden p-6 min-h-52"
            style={{ background: game.bg, border: `1px solid ${game.border}` }}
          >
            {/* Glow blob */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.4, 0.25] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="absolute -top-8 -right-8 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: game.accent }}
            />

            {/* HOT badge */}
            <span
              className="absolute top-4 right-4 text-[10px] font-black px-2.5 py-1 rounded-full text-black z-10"
              style={{ background: game.accent }}
            >
              🔥 HOT
            </span>

            {/* Emoji */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
              className="text-6xl mb-5 relative z-10 inline-block"
            >
              {game.emoji}
            </motion.div>

            {/* Tag */}
            <p className="text-[11px] font-bold uppercase tracking-widest mb-2 relative z-10"
               style={{ color: game.accent }}>
              {game.tag}
            </p>

            {/* Title + desc */}
            <h3 className="font-black text-white text-xl leading-tight mb-2 relative z-10">
              {game.title}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
              {game.desc}
            </p>

            {/* CTA */}
            <div className="mt-5 relative z-10">
              <span
                className="inline-flex items-center gap-2 text-sm font-black px-5 py-2.5 rounded-2xl transition-all group-hover:gap-3"
                style={{ background: `${game.accent}22`, color: game.accent }}
              >
                Play Now
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Regular — smaller cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {REGULAR.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 + i * 0.07 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveGame(game.id)}
            className="group relative text-left rounded-2xl overflow-hidden p-5 transition-all"
            style={{ background: game.bg, border: `1px solid ${game.border}` }}
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${game.accent}18, transparent 70%)` }}
            />

            <div className="text-4xl mb-3 relative z-10">{game.emoji}</div>

            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 relative z-10"
               style={{ color: game.accent }}>
              {game.tag}
            </p>

            <h3 className="font-bold text-white text-[15px] leading-snug mb-1.5 relative z-10">
              {game.title}
            </h3>
            <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 relative z-10">
              {game.desc}
            </p>

            <p className="mt-3 text-xs font-bold relative z-10 opacity-60 group-hover:opacity-100 transition-opacity"
               style={{ color: game.accent }}>
              Tap to play →
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
