"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import type { MenuItem } from "@/types/cafe";

interface Props {
  item: MenuItem;
  onAdd: () => void;
}

export default function TodaySpecial({ item, onAdd }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden mb-4"
      style={{
        background: "linear-gradient(135deg, rgba(var(--brand-rgb),0.18) 0%, rgba(var(--brand-rgb),0.06) 60%, transparent 100%)",
        border: "1px solid rgba(var(--brand-rgb),0.25)",
      }}
    >
      {/* Animated glow blob */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-40 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: "rgb(var(--brand-rgb))" }}
      />

      <div className="relative flex items-center gap-4 p-5">
        {/* Left — text content */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-[#0a0a0a] mb-3"
            style={{ background: "rgb(var(--brand-rgb))" }}
          >
            <Sparkles size={9} />
            Chef&apos;s Pick Today
          </span>

          <p className="font-black text-white text-xl leading-tight">{item.name}</p>

          {item.description && (
            <p className="text-zinc-400 text-xs mt-1 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <span className="font-black text-xl" style={{ color: "rgb(var(--brand-rgb))" }}>
              ₹{item.price}
            </span>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-black text-[#0a0a0a] hover:opacity-85 active:scale-95 transition-all"
              style={{ background: "rgb(var(--brand-rgb))" }}
            >
              <Plus size={14} strokeWidth={3} />
              Add
            </button>
          </div>
        </div>

        {/* Right — emoji with glow */}
        <div className="shrink-0 relative">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{ background: "rgb(var(--brand-rgb))" }}
          />
          <div
            className="relative w-24 h-24 rounded-2xl flex items-center justify-center text-5xl"
            style={{ background: "rgba(var(--brand-rgb),0.15)" }}
          >
            {item.emoji}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
