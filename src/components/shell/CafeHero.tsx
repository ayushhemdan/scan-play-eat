"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, QrCode } from "lucide-react";
import type { Cafe } from "@/types/cafe";
import { isOpen } from "@/lib/utils";

interface Props {
  cafe: Cafe;
  onQRClick?: () => void;
}

export default function CafeHero({ cafe, onQRClick }: Props) {
  const open = isOpen(cafe.openHours);

  return (
    <div className="relative overflow-hidden">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Brand blobs */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 md:w-125 md:h-125 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />
      <div
        className="absolute -top-10 -right-16 w-56 h-56 md:w-80 md:h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />

      <div className="relative px-5 pt-12 pb-8 md:pt-16 md:pb-12 max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-8">

          {/* Left — identity */}
          <div>
            {/* Open / closed */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex justify-center md:justify-start mb-4"
            >
              <span
                className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-full border ${
                  open
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${open ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
                {open ? "Open now" : "Closed"}
                <span className="text-[10px] opacity-60 font-normal">· {cafe.openHours}</span>
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              {cafe.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.12 }}
              className="text-zinc-400 text-sm md:text-base mt-3 max-w-sm leading-relaxed"
            >
              {cafe.tagline}
            </motion.p>
          </div>

          {/* Right — info + QR */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="flex flex-wrap justify-center md:justify-end gap-2"
          >
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-2 rounded-full whitespace-nowrap">
              <MapPin size={11} className="text-zinc-500 shrink-0" />
              {cafe.address.split(",")[0]}
            </span>

            <a
              href={`tel:${cafe.phone}`}
              className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-2 rounded-full hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
            >
              <Phone size={11} className="text-zinc-500 shrink-0" />
              {cafe.phone}
            </a>

            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-2 rounded-full whitespace-nowrap">
              🍽️ {cafe.menu.length} items on menu
            </span>

            {onQRClick && (
              <button
                onClick={onQRClick}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full border transition-all hover:opacity-80 whitespace-nowrap"
                style={{
                  color: "rgb(var(--brand-rgb))",
                  borderColor: "rgba(var(--brand-rgb) / 0.4)",
                  background: "rgba(var(--brand-rgb) / 0.08)",
                }}
              >
                <QrCode size={11} className="shrink-0" />
                Get QR Code
              </button>
            )}
          </motion.div>
        </div>

        {/* Bottom divider with brand glow */}
        <div className="mt-8 h-px relative">
          <div className="absolute inset-0 bg-white/6" />
          <div
            className="absolute left-0 h-full w-32 blur-sm"
            style={{ background: `rgba(var(--brand-rgb) / 0.6)` }}
          />
        </div>
      </div>
    </div>
  );
}
