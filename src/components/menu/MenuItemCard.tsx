"use client";

import { motion } from "framer-motion";
import { Plus, Minus, ChevronRight } from "lucide-react";
import type { MenuItem, Badge } from "@/types/cafe";

interface Props {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  onCustomise: () => void;
}

const BADGE: Record<Badge, { label: string; cls: string }> = {
  bestseller: { label: "⭐ Bestseller", cls: "bg-amber-500/15 text-amber-400 border-amber-500/25" },
  spicy:      { label: "🌶️ Spicy",     cls: "bg-red-500/15 text-red-400 border-red-500/25" },
  new:        { label: "✨ New",        cls: "bg-blue-500/15 text-blue-300 border-blue-500/25" },
  "must-try": { label: "🔥 Must Try",  cls: "bg-purple-500/15 text-purple-400 border-purple-500/25" },
};

export default function MenuItemCard({ item, qty, onAdd, onRemove, onCustomise }: Props) {
  const hasCustomisations = (item.customisations?.length ?? 0) > 0;
  const isBestseller = item.badges?.includes("bestseller");

  const handleAdd = () => {
    if (hasCustomisations) onCustomise();
    else onAdd();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex rounded-3xl overflow-hidden border transition-all duration-200 ${
        item.soldOut
          ? "bg-white/2 border-white/5 opacity-60"
          : isBestseller
          ? "bg-amber-500/4 border-amber-500/20 hover:border-amber-500/35"
          : "bg-[#141414] border-white/8 hover:border-white/18"
      }`}
    >
      {/* Left — details */}
      <div className="flex-1 p-5 min-w-0 flex flex-col gap-2 justify-between">
        {/* Veg dot + name */}
        <div className="flex items-start gap-2">
          <span className="mt-0.75 shrink-0 inline-flex items-center justify-center w-4.5 h-4.5 border-2 rounded-sm"
            style={{ borderColor: item.isVeg ? "#22c55e" : "#ef4444" }}>
            <span className="w-2 h-2 rounded-full"
              style={{ background: item.isVeg ? "#22c55e" : "#ef4444" }} />
          </span>
          <p className="font-bold text-white text-[15px] leading-snug">{item.name}</p>
        </div>

        {/* Badges */}
        {item.badges && item.badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.badges.map((b) => (
              <span key={b} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BADGE[b].cls}`}>
                {BADGE[b].label}
              </span>
            ))}
          </div>
        )}

        {/* Description or fallback info chips */}
        {item.description ? (
          <p className="text-zinc-500 text-[13px] leading-relaxed line-clamp-2">
            {item.description}
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              item.isVeg
                ? "bg-green-500/8 border-green-500/20 text-green-500"
                : "bg-red-500/8 border-red-500/20 text-red-400"
            }`}>
              {item.isVeg ? "🌿 Pure Veg" : "🍗 Non-Veg"}
            </span>
          </div>
        )}

        {/* Price */}
        <p className="font-black text-lg" style={{ color: "rgb(var(--brand-rgb))" }}>
          ₹{item.price}
        </p>

        {/* Customise hint */}
        {hasCustomisations && !item.soldOut && (
          <button
            onClick={onCustomise}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 flex items-center gap-0.5 w-fit transition-colors"
          >
            Customisable <ChevronRight size={10} />
          </button>
        )}
      </div>

      {/* Right — photo area + add button */}
      <div className="flex flex-col items-center gap-2.5 p-4 pl-2 shrink-0">
        {/* Emoji "photo" */}
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden shadow-lg"
          style={{
            background: isBestseller
              ? "linear-gradient(135deg, rgba(245,158,11,0.22) 0%, rgba(245,158,11,0.06) 100%)"
              : "linear-gradient(135deg, rgba(var(--brand-rgb),0.16) 0%, rgba(var(--brand-rgb),0.04) 100%)",
          }}
        >
          <span className="drop-shadow-sm">{item.emoji}</span>
          {item.soldOut && (
            <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
              <span className="text-[9px] font-black text-zinc-300 tracking-widest uppercase">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Add / qty controls */}
        {!item.soldOut && (
          qty === 0 ? (
            <motion.button
              whileTap={{ scale: 0.93 }}
              onClick={handleAdd}
              className="w-24 py-2 rounded-xl text-sm font-black text-[#0a0a0a] flex items-center justify-center gap-1 transition-opacity hover:opacity-85"
              style={{ background: "rgb(var(--brand-rgb))" }}
            >
              <Plus size={14} strokeWidth={3} /> ADD
            </motion.button>
          ) : (
            <div
              className="w-24 flex items-center justify-between rounded-xl px-2 py-1.5"
              style={{ background: "rgb(var(--brand-rgb))" }}
            >
              <button
                onClick={onRemove}
                className="w-6 h-6 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center text-[#0a0a0a] transition-colors"
              >
                <Minus size={13} strokeWidth={3} />
              </button>
              <span className="font-black text-sm text-[#0a0a0a] w-4 text-center">{qty}</span>
              <button
                onClick={handleAdd}
                className="w-6 h-6 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center text-[#0a0a0a] transition-colors"
              >
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
}
