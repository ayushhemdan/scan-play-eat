"use client";

import type { MenuCategory } from "@/types/cafe";

interface Props {
  categories: MenuCategory[];
  active: string;
  onChange: (id: string) => void;
}

export default function CategoryTabs({ categories, active, onChange }: Props) {
  return (
    <div className="sticky top-0 md:top-16 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/6 -mx-4 md:-mx-6 px-4 md:px-6">
      <div className="flex gap-2 overflow-x-auto pb-3 pt-3 scrollbar-none">
        {categories.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onChange(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                isActive ? "text-[#0a0a0a]" : "text-zinc-400 hover:text-white bg-white/5 border border-white/8"
              }`}
              style={
                isActive
                  ? { background: "rgb(var(--brand-rgb))" }
                  : undefined
              }
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
