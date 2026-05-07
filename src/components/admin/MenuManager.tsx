"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2, Edit3, Check, X, Loader, ImagePlus,
  RefreshCw, AlertCircle, Leaf, Drumstick, Save, Star,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── Types ────────────────────────────────────────────────────────────────────

type DbItem = {
  id: string;
  cafe_slug: string;
  name: string;
  price: number;
  description: string;
  category: string;
  is_veg: boolean;
  emoji: string;
  badges: string[];
  is_available: boolean;
  sort_order: number;
};

type ItemForm = {
  name: string;
  price: string;
  description: string;
  category: string;
  is_veg: boolean;
  emoji: string;
};

type ExtractedItem = {
  name: string;
  price: number;
  description: string;
  category: string;
  isVeg: boolean;
  selected: boolean;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "cafe-bites", label: "Cafe Bites", emoji: "🥪" },
  { id: "sides", label: "Sides", emoji: "🍟" },
  { id: "hot-drinks", label: "Hot Drinks", emoji: "☕" },
  { id: "cold-drinks", label: "Cold Drinks", emoji: "🥤" },
  { id: "desserts", label: "Desserts", emoji: "🍰" },
  { id: "other", label: "Other", emoji: "🍽️" },
];

const EMOJI_QUICK = [
  "🍔","🌶️","🥪","🍟","☕","🥤","🍰","🍫","🥗","🍗",
  "🌯","🧋","🍦","🍵","🍋","🥭","🍓","🧇","🍄","🥬",
  "🍕","🌮","🧅","🍞","🥙","🍮","🌿","🧀",
];

const BLANK_FORM: ItemForm = {
  name: "",
  price: "",
  description: "",
  category: "burgers",
  is_veg: true,
  emoji: "🍔",
};

const catEmoji = (cat: string) =>
  CATEGORIES.find((c) => c.id === cat)?.emoji ?? "🍽️";

type Tab = "items" | "add" | "extract" | "feedback";

type FeedbackRow = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
};

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  cafeSlugs: string[];
}

export default function MenuManager({ cafeSlugs }: Props) {
  const [tab, setTab] = useState<Tab>("items");
  const [slug, setSlug] = useState(cafeSlugs[0] ?? "suriyansh-burgers");
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ItemForm>(BLANK_FORM);
  const [addForm, setAddForm] = useState<ItemForm>(BLANK_FORM);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [todaySpecialId, setTodaySpecialId] = useState<string>("");
  const [views, setViews] = useState<{ today: number; week: number } | null>(null);
  const [feedbackList, setFeedbackList] = useState<FeedbackRow[]>([]);

  // extract tab
  const [preview, setPreview] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedItem[]>([]);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [savingExtracted, setSavingExtracted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const loadItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("cafe_slug", slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setItems(data ?? []);
    setLoading(false);
  }, [slug]);

  const loadSettings = useCallback(async () => {
    const { data } = await supabase
      .from("cafe_settings")
      .select("today_special_id")
      .eq("cafe_slug", slug)
      .single();
    setTodaySpecialId(data?.today_special_id ?? "");
  }, [slug]);

  const loadViews = useCallback(async () => {
    const res = await fetch(`/api/track-view?slug=${slug}`);
    if (res.ok) setViews(await res.json());
  }, [slug]);

  const loadFeedback = useCallback(async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .eq("cafe_slug", slug)
      .order("created_at", { ascending: false })
      .limit(50);
    setFeedbackList(data ?? []);
  }, [slug]);

  useEffect(() => {
    setEditingId(null);
    setExtracted([]);
    setPreview(null);
    loadItems();
    loadSettings();
    loadViews();
    loadFeedback();
  }, [loadItems, loadSettings, loadViews, loadFeedback]);

  const toggleAvailable = async (id: string, current: boolean) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: !current })
      .eq("id", id);
    if (error) { flash("Failed to update", false); return; }
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, is_available: !current } : i));
    flash(current ? "Marked as sold out" : "Back to available");
  };

  const updateTodaySpecial = async (itemId: string) => {
    const { error } = await supabase
      .from("cafe_settings")
      .upsert({ cafe_slug: slug, today_special_id: itemId || null });
    if (error) { flash("Failed to update", false); return; }
    setTodaySpecialId(itemId);
    flash(itemId ? "Today's Special updated!" : "Today's Special removed");
  };

  const grouped = CATEGORIES.reduce<Record<string, DbItem[]>>((acc, cat) => {
    const list = items.filter((i) => i.category === cat.id);
    if (list.length) acc[cat.id] = list;
    return acc;
  }, {});

  // ── CRUD ───────────────────────────────────────────────────────────────────

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error) { flash("Delete failed", false); return; }
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    flash("Item deleted");
  };

  const deleteSelected = async () => {
    if (!selectedIds.size) return;
    const ids = [...selectedIds];
    const { error } = await supabase.from("menu_items").delete().in("id", ids);
    if (error) { flash("Delete failed", false); return; }
    setItems((prev) => prev.filter((i) => !selectedIds.has(i.id)));
    setSelectedIds(new Set());
    flash(`${ids.length} items deleted`);
  };

  const deleteAll = async () => {
    const { error } = await supabase.from("menu_items").delete().eq("cafe_slug", slug);
    if (error) { flash("Delete failed", false); return; }
    setItems([]);
    setSelectedIds(new Set());
    setConfirmDeleteAll(false);
    flash("All items deleted");
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((i) => i.id)));
  };

  const startEdit = (item: DbItem) => {
    setEditingId(item.id);
    setEditForm({
      name: item.name,
      price: String(item.price),
      description: item.description,
      category: item.category,
      is_veg: item.is_veg,
      emoji: item.emoji,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editForm.name,
        price: Number(editForm.price),
        description: editForm.description,
        category: editForm.category,
        is_veg: editForm.is_veg,
        emoji: editForm.emoji,
      })
      .eq("id", editingId);
    setSaving(false);
    if (error) { flash("Save failed", false); return; }
    setEditingId(null);
    flash("Saved!");
    loadItems();
  };

  const addItem = async () => {
    if (!addForm.name.trim() || !addForm.price) {
      flash("Name and price are required", false);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("menu_items").insert({
      cafe_slug: slug,
      name: addForm.name.trim(),
      price: Number(addForm.price),
      description: addForm.description.trim(),
      category: addForm.category,
      is_veg: addForm.is_veg,
      emoji: addForm.emoji,
      badges: [],
      is_available: true,
      sort_order: items.length,
    });
    setSaving(false);
    if (error) { flash("Failed to add item", false); return; }
    setAddForm(BLANK_FORM);
    flash("Item added to menu!");
    loadItems();
    setTab("items");
  };

  // ── Extract from photo ─────────────────────────────────────────────────────

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setExtractError("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      setExtracting(true);
      setExtractError(null);
      setExtracted([]);

      try {
        const res = await fetch("/api/extract-menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: dataUrl.split(",")[1],
            mediaType: file.type,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Extraction failed");
        setExtracted(data.items.map((item: Omit<ExtractedItem, "selected">) => ({ ...item, selected: true })));
      } catch (err) {
        setExtractError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const saveExtracted = async () => {
    const toSave = extracted.filter((i) => i.selected);
    if (!toSave.length) { flash("No items selected", false); return; }
    setSavingExtracted(true);
    const { error } = await supabase.from("menu_items").insert(
      toSave.map((item, i) => ({
        cafe_slug: slug,
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
        is_veg: item.isVeg,
        emoji: catEmoji(item.category),
        badges: [],
        is_available: true,
        sort_order: items.length + i,
      }))
    );
    setSavingExtracted(false);
    if (error) { flash("Failed to save", false); return; }
    flash(`${toSave.length} items added to menu!`);
    setExtracted([]);
    setPreview(null);
    loadItems();
    setTab("items");
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Menu Manager</h1>
          <p className="text-zinc-500 text-sm mt-1">Add, edit and manage items — no code needed</p>
        </div>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-2xl px-4 py-2.5 outline-none cursor-pointer"
        >
          {cafeSlugs.map((s) => (
            <option key={s} value={s} className="bg-zinc-900">{s}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Total Items", value: items.length, color: "text-white", icon: "🍽️" },
          { label: "Veg Items", value: items.filter((i) => i.is_veg).length, color: "text-green-400", icon: "🌿" },
          { label: "Views Today", value: views?.today ?? "—", color: "text-violet-400", icon: "👁️" },
          { label: "Views This Week", value: views?.week ?? "—", color: "text-blue-400", icon: "📊" },
        ].map((s) => (
          <div key={s.label} className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
            <p className="text-lg mb-1">{s.icon}</p>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:flex gap-1 bg-white/4 border border-white/8 p-1 rounded-2xl mb-6 sm:w-fit">
        {(
          [
            { id: "items", label: "📋 Menu Items" },
            { id: "add", label: "+ Add Item" },
            { id: "extract", label: "📷 Extract Photo" },
            { id: "feedback", label: `⭐ Feedback${feedbackList.length ? ` (${feedbackList.length})` : ""}` },
          ] as { id: Tab; label: string }[]
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === t.id
                ? "bg-amber-400 text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {/* ── Items tab ── */}
        {tab === "items" && (
          <motion.div
            key="items"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <p className="text-zinc-500 text-sm">{items.length} items</p>
                {items.length > 0 && (
                  <button
                    onClick={toggleSelectAll}
                    className="text-xs text-zinc-500 hover:text-white transition-colors underline underline-offset-2"
                  >
                    {selectedIds.size === items.length ? "Deselect all" : "Select all"}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { loadItems(); loadSettings(); }}
                  className="text-zinc-500 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={12} /> Refresh
                </button>
                {items.length > 0 && (
                  <button
                    onClick={() => setConfirmDeleteAll(true)}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <Trash2 size={11} /> Delete all
                  </button>
                )}
              </div>
            </div>

            {/* Bulk action bar */}
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 mb-4"
                >
                  <p className="text-red-400 text-sm font-semibold">
                    {selectedIds.size} item{selectedIds.size > 1 ? "s" : ""} selected
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteSelected}
                      className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                    >
                      <Trash2 size={12} /> Delete selected
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Today's Special picker */}
            {items.length > 0 && (
              <div className="mb-5 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Star size={11} /> Today&apos;s Special
                </p>
                <select
                  value={todaySpecialId}
                  onChange={(e) => updateTodaySpecial(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 outline-none cursor-pointer"
                >
                  <option value="" className="bg-zinc-900">— None —</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id} className="bg-zinc-900">
                      {item.emoji} {item.name} — ₹{item.price}
                    </option>
                  ))}
                </select>
                {todaySpecialId && (
                  <p className="text-amber-400/60 text-[11px] mt-2">
                    Showing as featured banner on the menu
                  </p>
                )}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-24">
                <Loader size={28} className="text-amber-400 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-24 text-zinc-600">
                <p className="text-5xl mb-4">🍽️</p>
                <p className="font-semibold text-zinc-500">No items yet</p>
                <p className="text-sm mt-1">Use &ldquo;Add Item&rdquo; or &ldquo;Extract from Photo&rdquo; to get started</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(grouped).map(([catId, catItems]) => {
                  const cat = CATEGORIES.find((c) => c.id === catId);
                  return (
                    <div key={catId}>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                        {cat?.emoji} {cat?.label ?? catId} · {catItems.length}
                      </p>
                      <div className="space-y-2">
                        {catItems.map((item) =>
                          editingId === item.id ? (
                            <EditRow
                              key={item.id}
                              form={editForm}
                              onChange={setEditForm}
                              onSave={saveEdit}
                              onCancel={() => setEditingId(null)}
                              saving={saving}
                            />
                          ) : (
                            <ItemRow
                              key={item.id}
                              item={item}
                              selected={selectedIds.has(item.id)}
                              onSelect={() => toggleSelect(item.id)}
                              onEdit={() => startEdit(item)}
                              onDelete={() => deleteItem(item.id)}
                              onToggleAvailable={() => toggleAvailable(item.id, item.is_available)}
                            />
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Add tab ── */}
        {tab === "add" && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className="bg-white/4 border border-white/8 rounded-3xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Add New Item</h2>
              <FormFields form={addForm} onChange={setAddForm} />
              <button
                onClick={addItem}
                disabled={saving}
                className="mt-6 w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
                {saving ? "Adding..." : "Add to Menu"}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Extract tab ── */}
        {tab === "extract" && (
          <motion.div
            key="extract"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Left — upload */}
            <div>
              <div
                onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl cursor-pointer overflow-hidden transition-all ${
                  preview ? "border-amber-400/40" : "border-white/15 hover:border-white/30"
                }`}
                style={{ minHeight: 280 }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={preview} alt="Menu" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-3 p-10 h-full text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                      <ImagePlus size={24} className="text-amber-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Drop a menu photo here</p>
                      <p className="text-zinc-500 text-xs mt-1">or click to browse · JPG, PNG, WEBP</p>
                    </div>
                  </div>
                )}
                {extracting && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                    <Loader size={28} className="text-amber-400 animate-spin" />
                    <p className="text-white text-sm font-semibold">Reading menu...</p>
                    <p className="text-zinc-400 text-xs">Claude Vision is scanning the image</p>
                  </div>
                )}
              </div>

              {preview && !extracting && (
                <button
                  onClick={() => { setPreview(null); setExtracted([]); setExtractError(null); if (fileRef.current) fileRef.current.value = ""; }}
                  className="mt-3 w-full py-2.5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white text-sm transition-colors"
                >
                  Upload different photo
                </button>
              )}

              {extractError && (
                <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle size={14} />
                  {extractError}
                </div>
              )}
            </div>

            {/* Right — extracted items */}
            <div>
              {extracted.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white font-bold">{extracted.filter((i) => i.selected).length} / {extracted.length} selected</p>
                    <button
                      onClick={() => setExtracted((prev) => prev.map((i) => ({ ...i, selected: !prev.every((x) => x.selected) })))}
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      {extracted.every((i) => i.selected) ? "Deselect all" : "Select all"}
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 mb-4">
                    {extracted.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => setExtracted((prev) => prev.map((x, j) => j === i ? { ...x, selected: !x.selected } : x))}
                        className={`flex items-start gap-3 border rounded-2xl p-3 cursor-pointer transition-all ${
                          item.selected
                            ? "bg-amber-400/8 border-amber-400/30"
                            : "bg-white/2 border-white/6 opacity-50"
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          item.selected ? "bg-amber-400 border-amber-400" : "border-white/20"
                        }`}>
                          {item.selected && <Check size={10} className="text-black" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-semibold">{item.name}</p>
                          {item.description && (
                            <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-amber-400 text-xs font-bold">₹{item.price || "—"}</span>
                            <span className="text-zinc-600 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{item.category}</span>
                          </div>
                        </div>
                        {item.isVeg
                          ? <Leaf size={13} className="text-green-500 shrink-0 mt-1" />
                          : <Drumstick size={13} className="text-red-500 shrink-0 mt-1" />}
                      </motion.div>
                    ))}
                  </div>

                  <button
                    onClick={saveExtracted}
                    disabled={savingExtracted || !extracted.some((i) => i.selected)}
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingExtracted ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                    {savingExtracted
                      ? "Saving..."
                      : `Save ${extracted.filter((i) => i.selected).length} Items to Menu`}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center text-zinc-600">
                  <p className="text-5xl mb-3">📷</p>
                  <p className="text-sm">Upload a menu photo to extract items</p>
                  <p className="text-xs mt-1 text-zinc-700">AI reads the photo and lists all items — then you pick which ones to save</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Feedback tab ── */}
        {tab === "feedback" && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {feedbackList.length === 0 ? (
              <div className="text-center py-20 text-zinc-600">
                <p className="text-5xl mb-3">⭐</p>
                <p className="font-semibold text-zinc-500">No feedback yet</p>
                <p className="text-sm mt-1">Share the menu with customers — feedback will appear here</p>
              </div>
            ) : (
              <div>
                {/* Average rating */}
                <div className="flex items-center gap-4 bg-amber-500/8 border border-amber-500/20 rounded-2xl p-5 mb-5">
                  <div className="text-center">
                    <p className="text-4xl font-black text-amber-400">
                      {(feedbackList.reduce((s, f) => s + f.rating, 0) / feedbackList.length).toFixed(1)}
                    </p>
                    <p className="text-zinc-500 text-xs mt-1">avg rating</p>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = feedbackList.filter((f) => f.rating === star).length;
                      const pct = (count / feedbackList.length) * 100;
                      return (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-zinc-500 w-3">{star}</span>
                          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-zinc-600 w-4">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-white">{feedbackList.length}</p>
                    <p className="text-zinc-500 text-xs mt-1">reviews</p>
                  </div>
                </div>

                {/* List */}
                <div className="space-y-3">
                  {feedbackList.map((f) => (
                    <div key={f.id} className="bg-white/4 border border-white/8 rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((s) => (
                            <span key={s} className={`text-sm ${s <= f.rating ? "text-amber-400" : "text-zinc-700"}`}>★</span>
                          ))}
                        </div>
                        <span className="text-zinc-600 text-[10px]">
                          {new Date(f.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      {f.comment && (
                        <p className="text-zinc-300 text-sm leading-relaxed">{f.comment}</p>
                      )}
                      {!f.comment && (
                        <p className="text-zinc-600 text-xs italic">No comment</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete All Warning Modal */}
      <AnimatePresence>
        {confirmDeleteAll && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteAll(false)}
              className="fixed inset-0 bg-black/70 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              className="fixed z-50 inset-0 flex items-center justify-center px-6 pointer-events-none"
            >
              <div className="bg-[#1a1a1a] border border-red-500/30 rounded-3xl p-7 w-full max-w-sm pointer-events-auto shadow-2xl">
                {/* Icon */}
                <div className="w-14 h-14 bg-red-500/15 border border-red-500/25 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Trash2 size={24} className="text-red-400" />
                </div>

                {/* Text */}
                <h3 className="text-white font-black text-xl text-center mb-2">Delete All Items?</h3>
                <p className="text-zinc-400 text-sm text-center leading-relaxed mb-1">
                  This will permanently delete all <span className="text-white font-bold">{items.length} items</span> from <span className="text-white font-bold">{slug}</span>.
                </p>
                <p className="text-red-400 text-xs text-center font-semibold mb-6">
                  ⚠️ This cannot be undone.
                </p>

                {/* Actions */}
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={deleteAll}
                    className="w-full py-3.5 rounded-2xl bg-red-500 hover:bg-red-400 text-white font-black text-sm transition-colors"
                  >
                    Yes, delete all {items.length} items
                  </button>
                  <button
                    onClick={() => setConfirmDeleteAll(false)}
                    className="w-full py-3.5 rounded-2xl bg-white/6 hover:bg-white/10 text-zinc-300 font-bold text-sm transition-colors"
                  >
                    Cancel — keep my items
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2 shadow-xl ${
              toast.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {toast.ok ? <Check size={14} /> : <AlertCircle size={14} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ItemRow({
  item,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAvailable,
}: {
  item: DbItem;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleAvailable: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-colors ${
      selected
        ? "bg-red-500/5 border-red-500/20"
        : item.is_available
        ? "bg-white/4 border-white/8"
        : "bg-red-500/5 border-red-500/15"
    }`}>
      {/* Checkbox */}
      <button
        onClick={onSelect}
        className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
          selected ? "border-red-400 bg-red-400" : "border-white/20 hover:border-white/40"
        }`}
      >
        {selected && <Check size={11} className="text-white" strokeWidth={3} />}
      </button>
      <span className={`text-xl shrink-0 ${!item.is_available ? "opacity-40" : ""}`}>{item.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={`text-sm font-semibold truncate ${item.is_available ? "text-white" : "text-zinc-500 line-through"}`}>
            {item.name}
          </p>
          {item.is_veg
            ? <Leaf size={11} className="text-green-500 shrink-0" />
            : <Drumstick size={11} className="text-red-500 shrink-0" />}
        </div>
        {item.description && (
          <p className="text-zinc-600 text-xs truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <span className="text-amber-400 text-sm font-bold shrink-0">₹{item.price}</span>
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Sold out toggle */}
        <button
          onClick={onToggleAvailable}
          className={`text-[10px] font-black px-2.5 py-1.5 rounded-xl border transition-all ${
            item.is_available
              ? "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400"
              : "bg-red-500/15 border-red-500/25 text-red-400 hover:bg-green-500/10 hover:border-green-500/20 hover:text-green-400"
          }`}
        >
          {item.is_available ? "Available" : "Sold Out"}
        </button>

        <button
          onClick={onEdit}
          className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Edit3 size={13} />
        </button>
        {confirming ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { onDelete(); setConfirming(false); }}
              className="px-2.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-semibold transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="w-7 h-7 flex items-center justify-center rounded-xl bg-white/5 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function EditRow({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  form: ItemForm;
  onChange: (f: ItemForm) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  return (
    <div className="bg-amber-400/6 border border-amber-400/20 rounded-2xl p-4">
      <FormFields form={form} onChange={onChange} compact />
      <div className="flex gap-2 mt-4">
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader size={13} className="animate-spin" /> : <Check size={13} />}
          {saving ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 border border-white/10 text-zinc-400 hover:text-white rounded-xl text-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FormFields({
  form,
  onChange,
  compact = false,
}: {
  form: ItemForm;
  onChange: (f: ItemForm) => void;
  compact?: boolean;
}) {
  const set = (key: keyof ItemForm, val: string | boolean) =>
    onChange({ ...form, [key]: val });

  return (
    <div className={`grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`}>
      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="text-xs text-zinc-500 mb-1.5 block">Item Name *</label>
        <input
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="e.g. Classic Smash Burger"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 mb-1.5 block">Price (₹) *</label>
        <input
          type="number"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          placeholder="199"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 mb-1.5 block">Category</label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 transition-colors cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id} className="bg-zinc-900">
              {c.emoji} {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className={compact ? "" : "sm:col-span-2"}>
        <label className="text-xs text-zinc-500 mb-1.5 block">Description (optional)</label>
        <input
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description of the item"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-amber-400/50 transition-colors"
        />
      </div>

      <div>
        <label className="text-xs text-zinc-500 mb-1.5 block">Emoji</label>
        <input
          value={form.emoji}
          onChange={(e) => set("emoji", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-amber-400/50 transition-colors"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {EMOJI_QUICK.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => set("emoji", e)}
              className={`text-base w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                form.emoji === e ? "bg-amber-400/20 border border-amber-400/40" : "hover:bg-white/8"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-zinc-500 mb-1.5 block">Type</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => set("is_veg", true)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors ${
              form.is_veg
                ? "bg-green-500/15 border-green-500/40 text-green-400"
                : "border-white/8 text-zinc-500 hover:border-white/15"
            }`}
          >
            <Leaf size={14} /> Veg
          </button>
          <button
            type="button"
            onClick={() => set("is_veg", false)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-colors ${
              !form.is_veg
                ? "bg-red-500/15 border-red-500/40 text-red-400"
                : "border-white/8 text-zinc-500 hover:border-white/15"
            }`}
          >
            <Drumstick size={14} /> Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
}
