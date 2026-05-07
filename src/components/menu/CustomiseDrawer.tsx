"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Check } from "lucide-react";
import type { MenuItem, CustomGroup } from "@/types/cafe";
import type { CartSelection } from "@/types/cart";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (selections: CartSelection[], qty: number) => void;
}

function groupExtraTotal(group: CustomGroup, selected: Set<string>): number {
  return group.options
    .filter((o) => selected.has(o.id))
    .reduce((sum, o) => sum + o.price, 0);
}

export default function CustomiseDrawer({ item, onClose, onAdd }: Props) {
  const [selections, setSelections] = useState<Record<string, Set<string>>>({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (item) {
      const init: Record<string, Set<string>> = {};
      item.customisations?.forEach((g) => {
        if (g.options[0]) init[g.id] = new Set([g.options[0].id]);
        else init[g.id] = new Set();
      });
      setSelections(init);
      setQty(1);
    }
  }, [item]);

  if (!item) return null;

  const extraTotal = (item.customisations ?? []).reduce(
    (sum, group) => sum + groupExtraTotal(group, selections[group.id] ?? new Set()),
    0
  );
  const unitTotal = item.price + extraTotal;
  const lineTotal = unitTotal * qty;

  const allRequiredFilled = (item.customisations ?? [])
    .filter((g) => g.required)
    .every((g) => (selections[g.id]?.size ?? 0) > 0);

  const toggle = (group: CustomGroup, optionId: string) => {
    setSelections((prev) => {
      const current = new Set(prev[group.id] ?? []);
      if (group.multiple) {
        current.has(optionId) ? current.delete(optionId) : current.add(optionId);
      } else {
        current.clear();
        current.add(optionId);
      }
      return { ...prev, [group.id]: current };
    });
  };

  const handleAdd = () => {
    if (!allRequiredFilled) return;
    const flat: CartSelection[] = [];
    (item.customisations ?? []).forEach((group) => {
      group.options.forEach((opt) => {
        if (selections[group.id]?.has(opt.id)) {
          flat.push({
            groupId: group.id,
            groupLabel: group.label,
            optionId: opt.id,
            optionLabel: opt.label,
            extraPrice: opt.price,
          });
        }
      });
    });
    onAdd(flat, qty);
    onClose();
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40"
          />

          {/* Sheet — bottom on mobile, centered on desktop */}
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed bottom-0 left-0 right-0 md:inset-0 md:m-auto md:max-w-md md:max-h-[85vh] md:rounded-3xl z-50 bg-[#111] border border-white/10 rounded-t-3xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
              <div>
                <h3 className="font-bold text-white text-lg">{item.emoji} {item.name}</h3>
                <p className="text-zinc-500 text-xs mt-0.5">Base price: ₹{item.price}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {(item.customisations ?? []).map((group) => (
                <div key={group.id}>
                  <div className="flex items-center gap-2 mb-2.5">
                    <p className="text-white text-sm font-semibold">{group.label}</p>
                    {group.required && (
                      <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">
                        Required
                      </span>
                    )}
                    {group.multiple && (
                      <span className="text-[10px] text-zinc-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        Pick many
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    {group.options.map((opt) => {
                      const selected = selections[group.id]?.has(opt.id) ?? false;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggle(group, opt.id)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all text-left ${
                            selected
                              ? "border-[rgb(var(--brand-rgb))] bg-[rgba(var(--brand-rgb)/0.1)]"
                              : "border-white/8 bg-white/4 hover:border-white/15"
                          }`}
                        >
                          <span className={`text-sm ${selected ? "text-white font-medium" : "text-zinc-300"}`}>
                            {opt.label}
                          </span>
                          <div className="flex items-center gap-3">
                            {opt.price > 0 && (
                              <span className="text-xs text-zinc-400">+₹{opt.price}</span>
                            )}
                            <span
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                selected
                                  ? "border-[rgb(var(--brand-rgb))] bg-[rgb(var(--brand-rgb))]"
                                  : "border-zinc-600"
                              }`}
                            >
                              {selected && <Check size={11} className="text-[#0a0a0a]" strokeWidth={3} />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 pb-6 pt-3 border-t border-white/8 space-y-3">
              {/* Qty selector */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#0a0a0a] transition-opacity hover:opacity-80"
                    style={{ background: "rgb(var(--brand-rgb))" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAdd}
                disabled={!allRequiredFilled}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-between px-5 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: allRequiredFilled ? "rgb(var(--brand-rgb))" : undefined,
                  color: allRequiredFilled ? "#0a0a0a" : undefined,
                }}
              >
                <span>Add to Order</span>
                <span>₹{lineTotal}</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
