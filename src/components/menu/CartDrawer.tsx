"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X } from "lucide-react";
import type { CartItem } from "@/types/cart";
import CartContents from "./CartContents";

interface Props {
  cart: CartItem[];
  tableNo: string;
  cafeName: string;
  whatsapp: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onTableChange: (v: string) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
  onOrder?: () => void;
}

export default function CartDrawer({
  cart, tableNo, cafeName, whatsapp,
  open, onOpen, onClose,
  onTableChange, onUpdateQty, onOrder,
}: Props) {
  const totalItems = cart.reduce((s, e) => s + e.qty, 0);
  const totalPrice = cart.reduce((s, e) => s + e.unitTotal * e.qty, 0);

  return (
    <>
      {/* Sticky cart bar — mobile only */}
      <AnimatePresence>
        {totalItems > 0 && !open && (
          <motion.div
            key="cart-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 24, stiffness: 320 }}
            className="md:hidden fixed bottom-16 left-3 right-3 z-30"
          >
            <button
              onClick={onOpen}
              className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl shadow-2xl text-[#0a0a0a]"
              style={{
                background: "rgb(var(--brand-rgb))",
                boxShadow: `0 8px 32px rgba(var(--brand-rgb),0.45)`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center">
                  <ShoppingCart size={15} />
                </div>
                <span className="font-bold text-sm">
                  {totalItems} item{totalItems > 1 ? "s" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base">₹{totalPrice}</span>
                <span className="text-xs font-semibold opacity-70">View Order →</span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="md:hidden fixed inset-0 bg-black/60 z-40"
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-3xl max-h-[85vh] flex flex-col"
            >
              {/* Handle */}
              <div className="shrink-0 flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 bg-zinc-700 rounded-full" />
                <h3 className="font-bold text-white mt-2">Your Order</h3>
                <button
                  onClick={onClose}
                  className="mt-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-5 py-4">
                <CartContents
                  cart={cart}
                  tableNo={tableNo}
                  cafeName={cafeName}
                  whatsapp={whatsapp}
                  onTableChange={onTableChange}
                  onUpdateQty={onUpdateQty}
                  onOrder={() => { onOrder?.(); onClose(); }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
