"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customiseItem, setCustomiseItem] = useState<MenuItem | null>(null);
  const [tableNo, setTableNo] = useState(tableFromUrl);
  const [cartOpen, setCartOpen] = useState(false);

  const specialItem = cafe.todaySpecial
    ? cafe.menu.find((i) => i.id === cafe.todaySpecial)
    : null;

  const isSearching = search.trim().length > 0;

  const filteredItems = isSearching
    ? cafe.menu.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description?.toLowerCase().includes(search.toLowerCase())
      )
    : cafe.menu.filter((i) => i.category === activeCategory);

  const activeCategory_ = cafe.categories.find((c) => c.id === activeCategory);

  // ── Cart helpers ──────────────────────────────────────────────────────────────

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
      {/* Today's Special */}
      {specialItem && !isSearching && (
        <TodaySpecial item={specialItem} onAdd={() => addItem(specialItem)} />
      )}

      {/* Search bar */}
      <div className="relative mb-3">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu…"
          className="w-full bg-white/5 border border-white/8 rounded-2xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/20 transition-colors"
        />
        {isSearching && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category tabs — hidden while searching */}
      {!isSearching && (
        <CategoryTabs
          categories={cafe.categories}
          items={cafe.menu}
          active={activeCategory}
          onChange={setActiveCategory}
        />
      )}

      {/* Main layout */}
      <div className="flex gap-8 mt-4">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-4">
            {isSearching ? (
              <p className="text-zinc-500 text-sm">
                {filteredItems.length === 0
                  ? `No results for "${search}"`
                  : `${filteredItems.length} result${filteredItems.length > 1 ? "s" : ""} for "${search}"`}
              </p>
            ) : (
              <div>
                <p className="text-white font-black text-lg">
                  {activeCategory_?.emoji} {activeCategory_?.label}
                </p>
                <p className="text-zinc-600 text-xs mt-0.5">
                  {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
                </p>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSearching ? `search-${search}` : activeCategory}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-3"
            >
              {filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-5xl mb-4">
                    {isSearching ? "🔍" : activeCategory_?.emoji ?? "🍽️"}
                  </p>
                  <p className="text-zinc-400 font-semibold">
                    {isSearching ? "Nothing found" : "Coming soon"}
                  </p>
                  <p className="text-zinc-600 text-sm mt-1">
                    {isSearching
                      ? "Try a different search term"
                      : "Items will be added to this category soon"}
                  </p>
                </div>
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

      <CartDrawer
        {...cartProps}
        open={cartOpen}
        onOpen={() => setCartOpen(true)}
        onClose={() => setCartOpen(false)}
      />

      <CustomiseDrawer
        item={customiseItem}
        onClose={() => setCustomiseItem(null)}
        onAdd={(selections, qty) => { if (customiseItem) addItem(customiseItem, selections, qty); }}
      />
    </>
  );
}
