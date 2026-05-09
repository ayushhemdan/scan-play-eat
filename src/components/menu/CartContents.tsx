"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Send, ShoppingBag, CheckCircle } from "lucide-react";
import type { CartItem } from "@/types/cart";

interface Props {
  cart: CartItem[];
  tableNo: string;
  cafeName: string;
  whatsapp: string;
  onTableChange: (v: string) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
  onOrder?: () => void;
}

function buildWhatsAppMessage(cart: CartItem[], tableNo: string, cafeName: string): string {
  const itemCount = cart.reduce((s, e) => s + e.qty, 0);
  const lines = cart
    .map((entry) => {
      const subtotal = entry.unitTotal * entry.qty;
      const extras = entry.selections.length > 0
        ? `\n      _${entry.selections.map((s) => s.optionLabel).join(", ")}_`
        : "";
      return `${entry.emoji} *${entry.name}*\n      ${entry.qty} × ₹${entry.unitTotal} = *₹${subtotal}*${extras}`;
    })
    .join("\n\n");
  const total = cart.reduce((s, e) => s + e.unitTotal * e.qty, 0);
  const now = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `━━━━━━━━━━━━━━━━━━\n🧾 *ORDER — ${cafeName}*\n━━━━━━━━━━━━━━━━━━\n📍 Table *${tableNo}*  |  🕐 ${now}\n${itemCount} item${itemCount > 1 ? "s" : ""}\n\n${lines}\n\n━━━━━━━━━━━━━━━━━━\n💰 *Total: ₹${total}*\n━━━━━━━━━━━━━━━━━━\n\n_Please confirm this order. Thank you!_ 🙏`;
}

export default function CartContents({ cart, tableNo, cafeName, whatsapp, onTableChange, onUpdateQty, onOrder }: Props) {
  const [ordered, setOrdered] = useState(false);
  const total = cart.reduce((s, e) => s + e.unitTotal * e.qty, 0);

  const sendOrder = () => {
    const msg = buildWhatsAppMessage(cart, tableNo, cafeName);
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    onOrder?.();
    setOrdered(true);
    setTimeout(() => setOrdered(false), 4000);
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <ShoppingBag size={36} className="text-zinc-700" />
        <p className="text-zinc-500 text-sm">Your order is empty</p>
        <p className="text-zinc-600 text-xs">Add items from the menu</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 relative">
      {/* Order sent confirmation overlay */}
      <AnimatePresence>
        {ordered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#111]/95 rounded-2xl text-center px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1, stiffness: 260 }}
            >
              <CheckCircle size={56} className="text-green-400 mb-4" />
            </motion.div>
            <p className="text-white font-black text-2xl mb-1">Order Sent! 🎉</p>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Your order has been sent to <strong className="text-white">{cafeName}</strong> via WhatsApp.
            </p>
            <div className="mt-4 flex items-center gap-2 text-green-400 text-xs font-semibold bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              Waiting for confirmation from the cafe
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items */}
      <div className="space-y-3">
        {cart.map((entry) => (
          <div key={entry.itemId} className="flex items-start gap-3">
            <span className="text-2xl">{entry.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white leading-snug">{entry.name}</p>
              {entry.selections.length > 0 && (
                <p className="text-zinc-500 text-xs mt-0.5">
                  {entry.selections.map((s) => s.optionLabel).join(", ")}
                </p>
              )}
              <p className="text-xs mt-0.5" style={{ color: "rgb(var(--brand-rgb))" }}>
                ₹{entry.unitTotal} each
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => onUpdateQty(entry.itemId, -1)} className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors">
                <Minus size={11} />
              </button>
              <span className="text-sm font-bold text-white w-4 text-center">{entry.qty}</span>
              <button onClick={() => onUpdateQty(entry.itemId, 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-[#0a0a0a] transition-opacity hover:opacity-80" style={{ background: "rgb(var(--brand-rgb))" }}>
                <Plus size={11} />
              </button>
            </div>
            <span className="text-sm font-bold text-white shrink-0 w-14 text-right">₹{entry.unitTotal * entry.qty}</span>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="border-t border-white/8 pt-3 flex justify-between items-center">
        <span className="text-zinc-400 text-sm font-medium">Total</span>
        <span className="font-black text-lg" style={{ color: "rgb(var(--brand-rgb))" }}>₹{total}</span>
      </div>

      {/* Table number */}
      <div className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5">
        <span className="text-zinc-400 text-sm shrink-0">Table No.</span>
        <input
          type="number"
          min={1}
          value={tableNo}
          onChange={(e) => onTableChange(e.target.value)}
          className="flex-1 bg-transparent text-white font-bold text-center outline-none text-sm"
        />
      </div>

      {/* WhatsApp CTA */}
      <button
        onClick={sendOrder}
        className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-500 hover:bg-green-400 text-white transition-colors shadow-lg shadow-green-500/20"
      >
        <Send size={16} />
        Order via WhatsApp
      </button>

      <p className="text-center text-zinc-600 text-[10px]">
        Your order goes directly to the kitchen — no commission, no delay.
      </p>
    </div>
  );
}
