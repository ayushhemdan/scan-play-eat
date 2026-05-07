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

const BADGE = {
  bestseller: { label: "Bestseller", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  spicy:      { label: "🌶️ Spicy",   cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  new:        { label: "✨ New",      cls: "bg-blue-500/15 text-blue-400 border-blue-500/20" },
  "must-try": { label: "🔥 Must Try",cls: "bg-purple-500/15 text-purple-400 border-purple-500/20" },
} satisfies Record<Badge, { label: string; cls: string }>;

export default function MenuItemCard({ item, qty, onAdd, onRemove, onCustomise }: Props) {
  const hasCustomisations = (item.customisations?.length ?? 0) > 0;

  const handleAdd = () => {
    if (hasCustomisations) onCustomise();
    else onAdd();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative flex gap-4 p-4 rounded-2xl border transition-colors ${
        item.soldOut
          ? "border-white/5 bg-white/[0.02] opacity-50"
          : "border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
      }`}
    >
      {/* Sold-out overlay */}
      {item.soldOut && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl z-10">
          <span className="bg-zinc-900/90 text-zinc-400 text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
            Sold Out
          </span>
        </div>
      )}

      {/* Emoji */}
      <div className="shrink-0 w-14 h-14 flex items-center justify-center text-4xl bg-white/5 rounded-xl">
        {item.emoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + veg indicator */}
        <div className="flex items-start gap-2">
          {/* FSSAI-style veg/non-veg dot */}
          <span className="mt-0.5 shrink-0">
            <span
              className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm ${
                item.isVeg ? "border-green-500" : "border-red-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  item.isVeg ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </span>
          </span>
          <span className="font-semibold text-white text-sm leading-snug">{item.name}</span>
        </div>

        {/* Description */}
        <p className="text-zinc-500 text-xs mt-1 leading-relaxed line-clamp-2">
          {item.description}
        </p>

        {/* Price + badges */}
        <div className="flex items-center flex-wrap gap-1.5 mt-2">
          <span className="font-bold text-sm" style={{ color: "rgb(var(--brand-rgb))" }}>
            ₹{item.price}
          </span>
          {item.badges?.map((b) => (
            <span
              key={b}
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${BADGE[b].cls}`}
            >
              {BADGE[b].label}
            </span>
          ))}
        </div>

        {/* Customise hint */}
        {hasCustomisations && (
          <button
            onClick={onCustomise}
            className="flex items-center gap-0.5 mt-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Customise <ChevronRight size={11} />
          </button>
        )}
      </div>

      {/* Add / qty controls */}
      {!item.soldOut && (
        <div className="shrink-0 flex items-center self-center">
          {qty === 0 ? (
            <button
              onClick={handleAdd}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#0a0a0a] font-bold transition-opacity hover:opacity-80"
              style={{ background: "rgb(var(--brand-rgb))" }}
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onRemove}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                <Minus size={13} />
              </button>
              <span className="font-bold text-sm w-4 text-center" style={{ color: "rgb(var(--brand-rgb))" }}>
                {qty}
              </span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#0a0a0a] transition-opacity hover:opacity-80"
                style={{ background: "rgb(var(--brand-rgb))" }}
              >
                <Plus size={13} />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
