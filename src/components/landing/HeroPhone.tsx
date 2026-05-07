"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

const NOTIFICATIONS = [
  { table: 3, items: "2× Smash Burger, Loaded Fries", total: "₹527" },
  { table: 7, items: "Dynamite Zinger + Cold Coffee", total: "₹318" },
  { table: 1, items: "Oreo Shake + Nachos Platter", total: "₹278" },
  { table: 5, items: "Nutella Waffle + Cappuccino", total: "₹248" },
  { table: 9, items: "Double Patty Monster + Lassi", total: "₹358" },
];

export default function HeroPhone() {
  const [notifIndex, setNotifIndex] = useState<number | null>(null);

  // Cycle notifications
  useEffect(() => {
    let i = 0;

    const show = () => {
      setNotifIndex(i % NOTIFICATIONS.length);
      i++;
      setTimeout(() => setNotifIndex(null), 2800);
    };

    // First one after 1.5s
    const first = setTimeout(() => {
      show();
      // Then every 4.5s
      const interval = setInterval(show, 4500);
      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(first);
  }, []);

  const notif = notifIndex !== null ? NOTIFICATIONS[notifIndex] : null;

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity }}
      className="relative w-55 md:w-65"
    >
      {/* Glow behind phone */}
      <motion.div
        animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        className="absolute inset-0 bg-amber-400/25 rounded-[40px] blur-2xl scale-110 pointer-events-none"
      />

      {/* Phone frame */}
      <div className="relative bg-[#111] border-2 border-white/15 rounded-[36px] overflow-hidden shadow-2xl">

        {/* Notification popup */}
        <AnimatePresence>
          {notif && (
            <motion.div
              key={notifIndex}
              initial={{ opacity: 0, y: -60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 280 }}
              className="absolute top-3 left-3 right-3 z-20 bg-[#1a1a1a] border border-white/10 rounded-2xl p-3 shadow-2xl"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-white text-[10px] font-black leading-tight">
                    New Order — Table {notif.table} 🍔
                  </p>
                  <p className="text-zinc-400 text-[9px] mt-0.5 truncate">{notif.items}</p>
                  <p className="text-green-400 text-[9px] font-bold mt-0.5">{notif.total}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span className="text-[10px] text-zinc-500">9:41</span>
          <div className="w-16 h-4 bg-black rounded-full" />
          <div className="flex gap-1">
            <div className="w-3 h-2 bg-zinc-600 rounded-sm" />
            <div className="w-2 h-2 bg-zinc-600 rounded-full" />
          </div>
        </div>

        {/* Cafe hero area */}
        <div className="relative bg-[#0d0d0d] px-4 pt-4 pb-3 overflow-hidden">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[9px] text-green-400 font-bold bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
            <span className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
            Open now
          </span>
          <p className="text-amber-400 font-black text-lg mt-1 leading-tight">Suriyansh<br />Cafe</p>
          <p className="text-zinc-500 text-[9px] mt-0.5">Burgers, bites & brews</p>
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 px-3 py-2 bg-[#0a0a0a] border-b border-white/5 overflow-x-hidden">
          {["🍔 Burgers", "🥪 Bites", "☕ Drinks"].map((t, i) => (
            <span key={t}
              className={`flex-shrink-0 text-[9px] font-bold px-2.5 py-1 rounded-full ${
                i === 0 ? "bg-amber-400 text-black" : "text-zinc-500"
              }`}>
              {t}
            </span>
          ))}
        </div>

        {/* Menu items */}
        <div className="px-3 py-2 space-y-2 bg-[#0a0a0a]">
          {[
            { e: "🍔", n: "Classic Smash Burger", p: "₹199", badge: "⭐ Bestseller" },
            { e: "🌶️", n: "Dynamite Zinger",      p: "₹219", badge: "🔥 Spicy" },
            { e: "🍟", n: "Loaded Fries",          p: "₹129", badge: "" },
          ].map((item) => (
            <div key={item.n} className="flex items-center gap-2 bg-white/4 border border-white/5 rounded-xl p-2">
              <span className="text-xl">{item.e}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-[10px] font-semibold truncate">{item.n}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-amber-400 text-[9px] font-bold">{item.p}</p>
                  {item.badge && (
                    <span className="text-[8px] text-zinc-500">{item.badge}</span>
                  )}
                </div>
              </div>
              <div className="w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center text-black text-[10px] font-black shrink-0">
                +
              </div>
            </div>
          ))}
        </div>

        {/* Cart button */}
        <div className="px-3 py-2.5 bg-[#0a0a0a]">
          <div className="w-full bg-green-500 rounded-full py-2 flex items-center justify-center gap-1.5">
            <MessageCircle size={11} className="text-white" />
            <span className="text-white text-[10px] font-black">Order via WhatsApp</span>
          </div>
        </div>

        {/* Bottom nav */}
        <div className="flex border-t border-white/5 bg-[#0a0a0a]">
          {["🍔 Menu", "🎮 Games"].map((t, i) => (
            <div key={t}
              className={`flex-1 py-2 text-center text-[9px] font-bold ${
                i === 0 ? "text-amber-400" : "text-zinc-600"
              }`}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
