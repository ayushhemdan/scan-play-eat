"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Cafe } from "@/types/cafe";
import TruthOrDare from "./TruthOrDare";
import CompatibilityQuiz from "./CompatibilityQuiz";
import VibeQuiz from "./VibeQuiz";
import SpinWheel from "./SpinWheel";
import HotTake from "./HotTake";

type GameId = "truth-dare" | "compatibility" | "vibe-quiz" | "spin-wheel" | "hot-take";

const GAMES: { id: GameId; emoji: string; title: string; desc: string; tag: string; hot?: boolean }[] = [
  {
    id: "spin-wheel",
    emoji: "🎡",
    title: "Spin the Wheel",
    desc: "Who pays the bill? Let fate decide. No arguments allowed.",
    tag: "Group",
    hot: true,
  },
  {
    id: "hot-take",
    emoji: "⚡",
    title: "Hot Take",
    desc: "Food dilemmas. Everyone shouts simultaneously. Pure chaos.",
    tag: "Group",
    hot: true,
  },
  {
    id: "truth-dare",
    emoji: "🎯",
    title: "Truth or Dare",
    desc: "Fun questions & wild dares while you wait for your order.",
    tag: "2+ players",
  },
  {
    id: "compatibility",
    emoji: "💘",
    title: "Compatibility Quiz",
    desc: "How well do you two actually match? Find out in 5 questions.",
    tag: "2 players",
  },
  {
    id: "vibe-quiz",
    emoji: "✨",
    title: "What's Your Vibe?",
    desc: "Answer 4 questions — we'll pick the perfect item from the menu for you.",
    tag: "Solo",
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

  return (
    <div className="max-w-lg mx-auto md:max-w-none">
      <div className="text-center md:text-left mb-6">
        <h2 className="text-2xl font-black text-white">Play While You Wait 🎮</h2>
        <p className="text-zinc-500 text-sm mt-1">Your order is being prepared — have some fun meanwhile.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GAMES.map((game, i) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveGame(game.id)}
            className="group text-left p-5 rounded-2xl border transition-all relative overflow-hidden"
            style={
              game.hot
                ? {
                    borderColor: "rgba(var(--brand-rgb) / 0.35)",
                    background: "rgba(var(--brand-rgb) / 0.06)",
                  }
                : {
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                  }
            }
          >
            {game.hot && (
              <span
                className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded-full text-[#0a0a0a]"
                style={{ background: "rgb(var(--brand-rgb))" }}
              >
                HOT
              </span>
            )}
            <div className="text-5xl mb-4">{game.emoji}</div>
            <div
              className="text-[10px] font-bold uppercase tracking-widest mb-2 px-2 py-0.5 rounded-full border w-fit"
              style={{
                color: "rgb(var(--brand-rgb))",
                borderColor: "rgba(var(--brand-rgb) / 0.3)",
                background: "rgba(var(--brand-rgb) / 0.1)",
              }}
            >
              {game.tag}
            </div>
            <h3 className="font-bold text-white text-lg mb-1">{game.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{game.desc}</p>
            <div
              className="mt-4 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              Play now →
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
