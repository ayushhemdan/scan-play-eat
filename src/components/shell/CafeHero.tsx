"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, QrCode } from "lucide-react";
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
      {/* Brand blobs — bigger on desktop */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />
      <div
        className="absolute -top-12 -right-12 w-48 h-48 md:w-72 md:h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: `rgb(var(--brand-rgb))` }}
      />

      {/* Content — centered on mobile, wider on desktop */}
      <div className="relative px-5 pt-10 pb-6 md:pt-14 md:pb-10 max-w-6xl mx-auto">

        {/* Desktop: side-by-side. Mobile: stacked centered */}
        <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-6">

          {/* Left block — name + tagline + status */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex justify-center md:justify-start mb-3"
            >
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
                  open
                    ? "bg-green-500/15 text-green-400 border border-green-500/25"
                    : "bg-red-500/15 text-red-400 border border-red-500/25"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    open ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                {open ? "Open now" : "Closed"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight"
              style={{ color: "rgb(var(--brand-rgb))" }}
            >
              {cafe.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-zinc-400 text-sm md:text-base mt-2 max-w-md"
            >
              {cafe.tagline}
            </motion.p>
          </div>

          {/* Right block — info pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex flex-wrap justify-center md:justify-end gap-2"
          >
            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full whitespace-nowrap">
              <MapPin size={11} className="text-zinc-500 shrink-0" />
              {cafe.address.split(",")[0]}
            </span>

            <span className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full whitespace-nowrap">
              <Clock size={11} className="text-zinc-500 shrink-0" />
              {cafe.openHours}
            </span>

            <a
              href={`tel:${cafe.phone}`}
              className="flex items-center gap-1.5 text-xs text-zinc-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
            >
              <Phone size={11} className="text-zinc-500 shrink-0" />
              {cafe.phone}
            </a>

            {onQRClick && (
              <button
                onClick={onQRClick}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap hover:opacity-80"
                style={{
                  color: "rgb(var(--brand-rgb))",
                  borderColor: "rgba(var(--brand-rgb) / 0.35)",
                  background: "rgba(var(--brand-rgb) / 0.08)",
                }}
              >
                <QrCode size={11} className="shrink-0" />
                Get QR Code
              </button>
            )}
          </motion.div>
        </div>

        <div className="mt-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
