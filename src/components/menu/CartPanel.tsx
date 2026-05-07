"use client";

import { AnimatePresence, motion } from "framer-motion";
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

export default function CartPanel(props: Props) {
  return (
    <AnimatePresence>
      {props.cart.length > 0 && (
        <motion.aside
          initial={{ opacity: 0, x: 24, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 320 }}
          exit={{ opacity: 0, x: 24, width: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="hidden md:flex flex-col shrink-0 overflow-hidden"
        >
          <div className="sticky top-28 bg-white/4 border border-white/8 rounded-3xl p-5 w-80">
            <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
              <span>🧾</span> Your Order
            </h3>
            <CartContents {...props} />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
