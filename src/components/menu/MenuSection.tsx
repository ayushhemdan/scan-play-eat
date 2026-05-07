"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Cafe, MenuItem } from "@/types/cafe";
import type { CartItem, CartSelection } from "@/types/cart";
import CategoryTabs from "./CategoryTabs";
import MenuItemCard from "./MenuItemCard";
import CustomiseDrawer from "./CustomiseDrawer";
import CartPanel from "./CartPanel";
import CartDrawer from "./CartDrawer";
import TodaySpecial from "./TodaySpecial";
import { useTableParam } from "@/lib/useTableParam";

interface Props {
  cafe: Cafe;
  onOrder?: () => void;
}

export default function MenuSection({ cafe, onOrder }: Props) {
  const tableFromUrl = useTableParam();
  const [activeCategory, setActiveCategory] = useState(cafe.categories[0]?.id ?? "");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customiseItem, setCustomiseItem] = useState<MenuItem | null>(null);
  const [tableNo, setTableNo] = useState(tableFromUrl);

  const specialItem = cafe.todaySpecial
    ? cafe.menu.find((i) => i.id === cafe.todaySpecial)
    : null;

  const filteredItems = cafe.menu.filter((i) => i.category === activeCategory);

  // ── Cart helpers ─────────────────────────────────────────────────────────────

  const getQty = (itemId: string) => cart.find((e) => e.itemId === itemId)?.qty ?? 0;

  const addItem = (item: MenuItem, selections: CartSelection[] = [], qty = 1) => {
    const extraTotal = selections.reduce((s, sel) => s + sel.extraPrice, 0);
    const unitTotal = item.price + extraTotal;
    setCart((prev) => {
      const exists = prev.find((e) => e.itemId === item.id);
      if (exists) return prev.map((e) => e.itemId === item.id ? { ...e, qty: e.qty + qty, selections, unitTotal } : e);
      return [...prev, { itemId: item.id, name: item.name, emoji: item.emoji, basePrice: item.price, qty, selections, unitTotal }];
    });
  };

  const removeItem = (itemId: string) => {
    setCart((prev) => {
      const entry = prev.find((e) => e.itemId === itemId);
      if (!entry) return prev;
      if (entry.qty <= 1) return prev.filter((e) => e.itemId !== itemId);
      return prev.map((e) => (e.itemId === itemId ? { ...e, qty: e.qty - 1 } : e));
    });
  };

  const updateQty = (itemId: string, delta: number) => {
    if (delta > 0) { const item = cafe.menu.find((i) => i.id === itemId); if (item) addItem(item, [], delta); }
    else removeItem(itemId);
  };

  const cartProps = {
    cart, tableNo,
    cafeName: cafe.name,
    whatsapp: cafe.whatsapp,
    onTableChange: setTableNo,
    onUpdateQty: updateQty,
    onOrder,
  };

  return (
    <>
      {/* Today's Special banner */}
      {specialItem && (
        <TodaySpecial
          item={specialItem}
          onAdd={() => addItem(specialItem)}
        />
      )}

      {/* Category tabs */}
      <CategoryTabs
        categories={cafe.categories}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      {/* Main layout: item grid + desktop cart panel */}
      <div className="flex gap-6 mt-4">
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {filteredItems.length === 0 && (
                <p className="col-span-2 text-zinc-600 text-sm text-center py-12">
                  No items in this category yet.
                </p>
              )}
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  qty={getQty(item.id)}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item.id)}
                  onCustomise={() => setCustomiseItem(item)}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <CartPanel {...cartProps} />
      </div>

      <CartDrawer {...cartProps} />

      <CustomiseDrawer
        item={customiseItem}
        onClose={() => setCustomiseItem(null)}
        onAdd={(selections, qty) => { if (customiseItem) addItem(customiseItem, selections, qty); }}
      />
    </>
  );
}
