"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import type { MenuCategory, MenuItem } from "@/types/cafe";

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryTabs({ categories, items, active, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const countFor = (catId: string) => items.filter((i) => i.category === catId).length;

  return (
    <div className="sticky top-0 md:top-16 z-20 bg-[#0a0a0a]/96 backdrop-blur-xl -mx-4 md:-mx-6">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-4 md:px-6 py-3 scrollbar-none"
      >
        {categories.map((cat) => {
          const isActive = active === cat.id;
          const count = countFor(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className="relative shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all"
              style={
                isActive
                  ? { color: "rgb(var(--brand-rgb))" }
                  : { color: "#71717a" }
              }
            >
              {isActive && (
                <motion.div
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(var(--brand-rgb), 0.12)" }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative text-base leading-none">{cat.emoji}</span>
              <span className="relative">{cat.label}</span>
              <span
                className="relative text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={
                  isActive
                    ? { background: "rgba(var(--brand-rgb), 0.18)", color: "rgb(var(--brand-rgb))" }
                    : { background: "rgba(255,255,255,0.06)", color: "#52525b" }
                }
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-px bg-white/5" />
    </div>
  );
}
