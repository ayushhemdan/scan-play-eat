"use client";

import { motion } from "framer-motion";
import { MapPin, QrCode, ChevronDown } from "lucide-react";
import type { Cafe } from "@/types/cafe";
import { isOpen } from "@/lib/utils";

interface Props {
  cafe: Cafe;
  onQRClick?: () => void;
  forceOpen?: boolean | null;
}

export default function CafeHero({ cafe, onQRClick, forceOpen }: Props) {
  const open = forceOpen !== null && forceOpen !== undefined ? forceOpen : isOpen(cafe.openHours);

  return (
    <div className="relative overflow-hidden">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Brand blobs */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />
      <div
        className="absolute -top-10 -right-16 w-56 h-56 rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />

      <div className="relative px-5 pt-7 pb-5 md:pt-16 md:pb-12 max-w-6xl mx-auto">

        {/* Mobile layout — compact */}
        <div className="flex items-center justify-between md:hidden">
          <div className="flex-1 min-w-0">
            {/* Open badge */}
            <motion.span
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border mb-2 ${
                open
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
              {open ? "Open" : "Closed"} · {cafe.openHours}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl font-black leading-tight tracking-tight"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              {cafe.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-zinc-500 text-xs mt-1 flex items-center gap-1"
            >
              <MapPin size={10} />
              {cafe.address.split(",")[0]}
            </motion.p>
          </div>

          {/* QR button mobile */}
          {onQRClick && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={onQRClick}
              className="shrink-0 ml-4 flex flex-col items-center gap-1 px-4 py-2.5 rounded-2xl border transition-all"
              style={{
                borderColor: "rgba(var(--brand-rgb),0.3)",
                background: "rgba(var(--brand-rgb),0.08)",
                color: "rgb(var(--brand-rgb))",
              }}
            >
              <QrCode size={18} />
              <span className="text-[9px] font-bold">QR Code</span>
            </motion.button>
          )}
        </div>

        {/* Desktop layout — full */}
        <div className="hidden md:flex flex-row items-end justify-between gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <span className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border ${
                open
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                <span className={`w-2 h-2 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                {open ? "Open now" : "Closed"}
                <span className="text-[10px] opacity-60 font-normal">· {cafe.openHours}</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              {cafe.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              className="text-zinc-400 text-base mt-3 max-w-sm leading-relaxed"
            >
              {cafe.tagline}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="flex flex-wrap justify-end gap-2"
          >
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-2 rounded-full">
              <MapPin size={11} className="text-zinc-500 shrink-0" />
              {cafe.address.split(",")[0]}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-2 rounded-full">
              🍽️ {cafe.menu.length} items
            </span>
            {onQRClick && (
              <button
                onClick={onQRClick}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all hover:opacity-80"
                style={{
                  color: "rgb(var(--brand-rgb))",
                  borderColor: "rgba(var(--brand-rgb),0.4)",
                  background: "rgba(var(--brand-rgb),0.08)",
                }}
              >
                <QrCode size={11} />
                Get QR Code
              </button>
            )}
          </motion.div>
        </div>

        {/* Divider */}
        <div className="mt-5 md:mt-8 h-px relative">
          <div className="absolute inset-0 bg-white/6" />
          <div className="absolute left-0 h-full w-32 blur-sm" style={{ background: `rgba(var(--brand-rgb),0.6)` }} />
        </div>

        {/* Scroll hint — mobile only */}
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="md:hidden flex justify-center mt-3"
        >
          <ChevronDown size={16} className="text-zinc-700" />
        </motion.div>
      </div>
    </div>
  );
}
