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
  onTableChange: (v: string) => void;
  onUpdateQty: (itemId: string, delta: number) => void;
  onOrder?: () => void;
}

export default function CartDrawer(props: Props) {
  const { cart } = props;
  const totalItems = cart.reduce((s, e) => s + e.qty, 0);
  const totalPrice = cart.reduce((s, e) => s + e.unitTotal * e.qty, 0);

  return (
    <>
      {/* Floating trigger button — mobile only, shows when cart has items */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.button
            key="cart-btn"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            onClick={() => document.getElementById("cart-drawer-toggle")?.click()}
            className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-5 py-3 rounded-full font-bold text-sm text-[#0a0a0a] shadow-2xl"
            style={{
              background: "rgb(var(--brand-rgb))",
              boxShadow: `0 8px 30px rgba(var(--brand-rgb) / 0.4)`,
            }}
          >
            <ShoppingCart size={16} />
            {totalItems} item{totalItems > 1 ? "s" : ""} &nbsp;·&nbsp; ₹{totalPrice}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hidden checkbox trick for toggle — real toggle state lives in MenuSection */}
      <input type="checkbox" id="cart-drawer-toggle" className="sr-only peer" />

      {/* Backdrop */}
      <label
        htmlFor="cart-drawer-toggle"
        className="md:hidden fixed inset-0 bg-black/60 z-40 hidden peer-checked:block cursor-pointer"
      />

      {/* Drawer */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-3xl translate-y-full peer-checked:translate-y-0 transition-transform duration-300 max-h-[85vh] flex flex-col">
        {/* Handle + header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-white/8">
          <div className="w-10 h-1 bg-zinc-700 rounded-full absolute top-2 left-1/2 -translate-x-1/2" />
          <h3 className="font-bold text-white mt-2">Your Order</h3>
          <label
            htmlFor="cart-drawer-toggle"
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white cursor-pointer mt-2"
          >
            <X size={16} />
          </label>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4">
          <CartContents {...props} />
        </div>
      </div>
    </>
  );
}
