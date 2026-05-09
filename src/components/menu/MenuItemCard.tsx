"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { MenuItem, Badge } from "@/types/cafe";

interface Props {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onCustomise: () => void;
}

const BADGE: Record<Badge, { label: string; color: string }> = {
  bestseller: { label: "⭐ Bestseller", color: "#fbbf24" },
  spicy:      { label: "🌶️ Spicy",     color: "#f87171" },
  new:        { label: "✨ New",        color: "#93c5fd" },
  "must-try": { label: "🔥 Must Try",  color: "#c084fc" },
};

// Rich deep gradients per category — the visual identity of each section
const CAT_GRADIENT: Record<string, string> = {
  "burgers":     "linear-gradient(160deg, #92400e 0%, #431407 50%, #0f0804 100%)",
  "cafe-bites":  "linear-gradient(160deg, #9a3412 0%, #431407 50%, #0f0603 100%)",
  "sides":       "linear-gradient(160deg, #854d0e 0%, #3f2205 50%, #0d0902 100%)",
  "hot-drinks":  "linear-gradient(160deg, #7c2d12 0%, #3b0f05 50%, #0a0503 100%)",
  "cold-drinks": "linear-gradient(160deg, #075985 0%, #0c2b4a 50%, #030a14 100%)",
  "desserts":    "linear-gradient(160deg, #9d174d 0%, #4a0726 50%, #0f0308 100%)",
  "other":       "linear-gradient(160deg, #27272a 0%, #18181b 50%, #0f0f10 100%)",
};

const CAT_GLOW: Record<string, string> = {
  "burgers":     "rgba(180,83,9,0.5)",
  "cafe-bites":  "rgba(194,65,12,0.5)",
  "sides":       "rgba(161,98,7,0.5)",
  "hot-drinks":  "rgba(154,52,18,0.5)",
  "cold-drinks": "rgba(7,89,133,0.5)",
  "desserts":    "rgba(157,23,77,0.5)",
  "other":       "rgba(63,63,70,0.5)",
};

export default function MenuItemCard({ item, qty, onAdd, onRemove, onCustomise }: Props) {
  const hasCustomisations = (item.customisations?.length ?? 0) > 0;
  const isBestseller = item.badges?.includes("bestseller");
  const topBadge = item.badges?.[0];

  const handleAdd = () => {
    if (hasCustomisations) onCustomise();
    else onAdd();
  };

  const gradient = CAT_GRADIENT[item.category] ?? CAT_GRADIENT["other"];
  const glow = CAT_GLOW[item.category] ?? "rgba(63,63,70,0.4)";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col rounded-3xl overflow-hidden"
      style={{
        boxShadow: isBestseller
          ? `0 0 0 1.5px rgba(245,158,11,0.4), 0 8px 32px rgba(180,83,9,0.25)`
          : `0 4px 20px rgba(0,0,0,0.4)`,
      }}
    >
      {/* ── Photo area ──────────────────────────────── */}
      <div className="relative h-36 overflow-hidden" style={{ background: gradient }}>

        {item.imageUrl ? (
          <>
            {/* Real food photo */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Subtle darkening overlay so badges stay readable */}
            <div className="absolute inset-0 bg-black/20" />
          </>
        ) : (
          <>
            {/* Ambient glow behind emoji */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-60 pointer-events-none"
              style={{ background: glow }}
            />
            {/* Emoji — hero element */}
            <motion.span
              animate={isBestseller ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl drop-shadow-lg select-none"
            >
              {item.emoji}
            </motion.span>
          </>
        )}

        {/* Veg dot */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="flex items-center justify-center w-4.5 h-4.5 border-2 rounded-sm"
            style={{ borderColor: item.isVeg ? "#22c55e" : "#ef4444", background: "rgba(0,0,0,0.5)" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: item.isVeg ? "#22c55e" : "#ef4444" }} />
          </span>
        </div>

        {/* Top badge */}
        {topBadge && (
          <div className="absolute top-3 right-3 z-10">
            <span
              className="text-[9px] font-black px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,0,0,0.6)", color: BADGE[topBadge].color, border: `1px solid ${BADGE[topBadge].color}40` }}
            >
              {BADGE[topBadge].label}
            </span>
          </div>
        )}

        {/* Sold out */}
        {item.soldOut && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
            <span className="text-[10px] font-black tracking-widest text-zinc-300 uppercase bg-black/60 px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #111)" }} />
      </div>

      {/* ── Details area ────────────────────────────── */}
      <div className="flex flex-col flex-1 bg-[#111] px-3 pb-3 pt-2 gap-1">
        <p className="font-black text-white text-[13px] leading-snug line-clamp-2">
          {item.name}
        </p>

        {item.description ? (
          <p className="text-zinc-500 text-[11px] leading-relaxed line-clamp-2 italic">
            {item.description}
          </p>
        ) : (
          <p className="text-[11px] font-medium" style={{ color: item.isVeg ? "#4ade80" : "#f87171" }}>
            {item.isVeg ? "🌿 Pure Veg" : "🍗 Non-Veg"}
          </p>
        )}

        {hasCustomisations && !item.soldOut && (
          <p className="text-[10px] text-zinc-600">● Customisable</p>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-[10px] text-zinc-500 font-semibold">₹</span>
            <span className="font-black text-lg leading-none" style={{ color: "rgb(var(--brand-rgb))" }}>
              {item.price}
            </span>
          </div>

          {!item.soldOut && (
            <AnimatePresence mode="wait">
              {qty === 0 ? (
                <motion.button
                  key="add"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={handleAdd}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-black text-[#0a0a0a] transition-opacity hover:opacity-85"
                  style={{ background: "rgb(var(--brand-rgb))" }}
                >
                  <Plus size={11} strokeWidth={3} /> ADD
                </motion.button>
              ) : (
                <motion.div
                  key="qty"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <button
                    onClick={onRemove}
                    className="w-6 h-6 rounded-lg flex items-center justify-center bg-white/10 hover:bg-white/15 text-white"
                  >
                    <Minus size={11} strokeWidth={3} />
                  </button>
                  <span className="font-black text-sm w-3.5 text-center" style={{ color: "rgb(var(--brand-rgb))" }}>
                    {qty}
                  </span>
                  <button
                    onClick={handleAdd}
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[#0a0a0a] hover:opacity-85"
                    style={{ background: "rgb(var(--brand-rgb))" }}
                  >
                    <Plus size={11} strokeWidth={3} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
