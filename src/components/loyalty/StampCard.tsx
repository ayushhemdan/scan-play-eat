"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X, Stamp } from "lucide-react";
import type { LoyaltyConfig } from "@/types/cafe";

interface Props {
  loyalty: LoyaltyConfig;
  stamps: number;
  onClaim: () => void;
}

export default function StampCard({ loyalty, stamps, onClaim }: Props) {
  const [open, setOpen] = useState(false);
  const earned = stamps >= loyalty.stampsRequired;
  const progress = Math.min(stamps, loyalty.stampsRequired);

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm text-white border border-white/10 bg-[#111] shadow-xl hover:bg-[#181818] transition-colors"
      >
        <Stamp size={15} style={{ color: "rgb(var(--brand-rgb))" }} />
        <span className="text-zinc-300">
          {progress}/{loyalty.stampsRequired}
        </span>
        {earned && (
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: "rgb(var(--brand-rgb))" }}
          />
        )}
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-3xl p-6 max-w-lg mx-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-white text-xl">Loyalty Stamps</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">
                    Collect {loyalty.stampsRequired} stamps, get {loyalty.reward}
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Stamp grid */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                {Array.from({ length: loyalty.stampsRequired }).map((_, i) => {
                  const filled = i < stamps;
                  return (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={filled ? { scale: [1, 1.15, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all"
                      style={
                        filled
                          ? {
                              borderColor: "rgb(var(--brand-rgb))",
                              background: "rgba(var(--brand-rgb) / 0.15)",
                            }
                          : { borderColor: "rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.03)" }
                      }
                    >
                      {filled ? (
                        <Stamp size={20} style={{ color: "rgb(var(--brand-rgb))" }} />
                      ) : (
                        <span className="text-zinc-700 text-xs font-bold">{i + 1}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-white/8 rounded-full mb-5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "rgb(var(--brand-rgb))" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(progress / loyalty.stampsRequired) * 100}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>

              {earned ? (
                <div className="text-center">
                  <p className="text-2xl mb-2">🎉</p>
                  <p className="text-white font-black text-lg mb-1">You earned it!</p>
                  <p className="text-zinc-400 text-sm mb-4">
                    Show this to the counter to claim your <strong className="text-white">{loyalty.reward}</strong>
                  </p>
                  <button
                    onClick={() => { onClaim(); setOpen(false); }}
                    className="w-full py-3.5 rounded-2xl font-bold text-sm text-[#0a0a0a] flex items-center justify-center gap-2"
                    style={{ background: "rgb(var(--brand-rgb))" }}
                  >
                    <Gift size={16} /> Claim Reward
                  </button>
                </div>
              ) : (
                <p className="text-center text-zinc-500 text-sm">
                  {loyalty.stampsRequired - stamps} more order{loyalty.stampsRequired - stamps !== 1 ? "s" : ""} to unlock your reward.
                  Every WhatsApp order earns a stamp.
                </p>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
