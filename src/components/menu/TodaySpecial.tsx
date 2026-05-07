"use client";

import { motion } from "framer-motion";
import { Star, Plus } from "lucide-react";
import type { MenuItem } from "@/types/cafe";

interface Props {
  item: MenuItem;
  onAdd: () => void;
}

export default function TodaySpecial({ item, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden border mb-4"
      style={{
        borderColor: "rgba(var(--brand-rgb) / 0.3)",
        background: "rgba(var(--brand-rgb) / 0.07)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-25 pointer-events-none"
        style={{ background: "rgb(var(--brand-rgb))" }}
      />

      <div className="relative flex items-center gap-4 px-5 py-4">
        {/* Label */}
        <div className="shrink-0">
          <span
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full text-[#0a0a0a]"
            style={{ background: "rgb(var(--brand-rgb))" }}
          >
            <Star size={9} fill="currentColor" />
            Today&apos;s Special
          </span>
          <p className="text-3xl mt-2 ml-1">{item.emoji}</p>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-white text-base leading-snug">{item.name}</p>
          <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1">{item.description}</p>
          <p className="font-bold mt-1 text-sm" style={{ color: "rgb(var(--brand-rgb))" }}>
            ₹{item.price}
          </p>
        </div>

        {/* Add button */}
        <button
          onClick={onAdd}
          className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[#0a0a0a] hover:opacity-80 transition-opacity"
          style={{ background: "rgb(var(--brand-rgb))" }}
        >
          <Plus size={18} />
        </button>
      </div>
    </motion.div>
  );
}
