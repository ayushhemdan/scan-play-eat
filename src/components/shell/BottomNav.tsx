"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Gamepad2 } from "lucide-react";
import type { Cafe } from "@/types/cafe";

export type TabId = "menu" | "games";

interface Props {
  cafe: Cafe;
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof UtensilsCrossed }[] = [
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "games", label: "Games", icon: Gamepad2 },
];

export default function BottomNav({ cafe, active, onChange }: Props) {
  const visibleTabs = TABS.filter(
    (t) => t.id === "menu" || (t.id === "games" && cafe.features.games)
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/6">
      <div className="flex max-w-lg mx-auto">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors"
              suppressHydrationWarning
            >
              {/* Active indicator bar at top */}
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-10 rounded-full"
                  style={{ background: "rgb(var(--brand-rgb))" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <Icon
                size={20}
                style={isActive ? { color: "rgb(var(--brand-rgb))" } : undefined}
                className={isActive ? "" : "text-zinc-600"}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  isActive ? "" : "text-zinc-600"
                }`}
                style={isActive ? { color: "rgb(var(--brand-rgb))" } : undefined}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
