"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, Gamepad2, MapPin } from "lucide-react";
import type { Cafe } from "@/types/cafe";
import type { TabId } from "./BottomNav";

interface Props {
  cafe: Cafe;
  active: TabId;
  onChange: (tab: TabId) => void;
}

const TABS: { id: TabId; label: string; icon: typeof UtensilsCrossed }[] = [
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "games", label: "Games", icon: Gamepad2 },
];

export default function TopNav({ cafe, active, onChange }: Props) {
  const visibleTabs = TABS.filter(
    (t) => t.id === "menu" || (t.id === "games" && cafe.features.games)
  );

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-30 h-16 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/[0.06] items-center px-6">
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        {/* Left — cafe identity */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🍔</span>
          <div>
            <p
              className="font-black text-lg leading-none"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              {cafe.name}
            </p>
            <p className="flex items-center gap-1 text-zinc-500 text-xs mt-0.5">
              <MapPin size={9} />
              {cafe.address.split(",")[0]}
            </p>
          </div>
        </div>

        {/* Center — tab links */}
        <nav className="flex items-center gap-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className="relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                style={
                  isActive
                    ? {
                        color: "rgb(var(--brand-rgb))",
                        background: `rgba(var(--brand-rgb) / 0.1)`,
                      }
                    : undefined
                }
              >
                {!isActive && (
                  <span className="absolute inset-0 rounded-full hover:bg-white/5 transition-colors" />
                )}
                <Icon
                  size={15}
                  className={isActive ? "" : "text-zinc-500"}
                />
                <span className={isActive ? "" : "text-zinc-500"}>
                  {tab.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="top-nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full"
                    style={{ background: "rgb(var(--brand-rgb))" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right — open status */}
        <div className="flex items-center gap-3">
          <span className="text-zinc-500 text-xs">{cafe.openHours}</span>
          <a
            href={`https://wa.me/${cafe.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors hover:text-white"
            style={{
              borderColor: `rgba(var(--brand-rgb) / 0.4)`,
              color: "rgb(var(--brand-rgb))",
            }}
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </header>
  );
}
