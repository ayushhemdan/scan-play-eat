"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Copy, Check, Loader, ImagePlus, Leaf, Drumstick } from "lucide-react";

type ExtractedItem = {
  name: string;
  price: number;
  description: string;
  category: string;
  isVeg: boolean;
};

export default function MenuExtractor() {
  const [preview, setPreview] = useState<string | null>(null);
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      const mediaType = file.type;

      setPreview(dataUrl);
      setLoading(true);
      setError(null);
      setItems([]);

      try {
        const res = await fetch("/api/extract-menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error ?? "Extraction failed");
        }

        setItems(data.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(items, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const reset = () => {
    setPreview(null);
    setItems([]);
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white mb-2">Photo → Menu Extractor</h1>
        <p className="text-zinc-400 text-sm">
          Upload a photo of any physical menu — AI reads it and extracts all items instantly.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left — upload */}
        <div>
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-3xl transition-all cursor-pointer overflow-hidden ${
              preview ? "border-amber-400/40" : "border-white/15 hover:border-white/30"
            }`}
            style={{ minHeight: 300 }}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            />

            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Menu" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 p-10 h-full text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
                  <ImagePlus size={28} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">Drop a menu photo here</p>
                  <p className="text-zinc-500 text-xs mt-1">or click to browse · JPG, PNG, WEBP</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                <Loader size={28} className="text-amber-400 animate-spin" />
                <p className="text-white text-sm font-semibold">Reading your menu...</p>
                <p className="text-zinc-400 text-xs">Claude Vision is scanning the image</p>
              </div>
            )}
          </div>

          {preview && !loading && (
            <button
              onClick={reset}
              className="mt-3 w-full py-2.5 rounded-2xl border border-white/10 text-zinc-400 hover:text-white text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Upload size={14} /> Upload different photo
            </button>
          )}

          {error && (
            <div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right — extracted items */}
        <div>
          <AnimatePresence>
            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-bold">
                    {items.length} items extracted
                  </p>
                  <button
                    onClick={copyJson}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-zinc-300 hover:text-white transition-colors"
                  >
                    {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                    {copied ? "Copied!" : "Copy JSON"}
                  </button>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {items.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 bg-white/4 border border-white/8 rounded-2xl p-3"
                    >
                      <span className={`mt-0.5 w-4 h-4 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.isVeg ? "border-green-500" : "border-red-500"}`}>
                        <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-green-500" : "bg-red-500"}`} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold leading-snug">{item.name}</p>
                        {item.description && (
                          <p className="text-zinc-500 text-xs mt-0.5 line-clamp-1">{item.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-amber-400 text-xs font-bold">₹{item.price || "—"}</span>
                          <span className="text-zinc-600 text-[10px] bg-white/5 px-2 py-0.5 rounded-full">{item.category}</span>
                        </div>
                      </div>
                      {item.isVeg ? <Leaf size={13} className="text-green-500 shrink-0 mt-0.5" /> : <Drumstick size={13} className="text-red-500 shrink-0 mt-0.5" />}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-2xl border border-amber-400/20 bg-amber-400/5">
                  <p className="text-amber-400 text-xs font-bold mb-1">Next step</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    Copy the JSON and paste it into the cafe config file
                    (<code className="text-amber-400">src/lib/cafes/[cafe].ts</code>) to make the menu live.
                    Update prices, descriptions, and emojis as needed.
                  </p>
                </div>
              </motion.div>
            )}

            {!items.length && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full py-16 text-center text-zinc-600">
                <p className="text-5xl mb-3">🍽️</p>
                <p className="text-sm">Extracted items will appear here</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
