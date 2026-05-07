"use client";

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
    <aside className="hidden md:flex flex-col w-80 shrink-0">
      <div className="sticky top-28 bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
          <span>🧾</span> Your Order
        </h3>
        <CartContents {...props} />
      </div>
    </aside>
  );
}
