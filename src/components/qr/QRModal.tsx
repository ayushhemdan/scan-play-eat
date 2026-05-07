"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Copy, Check, ExternalLink } from "lucide-react";
import type { Cafe } from "@/types/cafe";

interface Props {
  cafe: Cafe;
  open: boolean;
  onClose: () => void;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

const TABLE_COUNT = 12;

function buildUrl(slug: string, table: number | null) {
  const base = `${BASE_URL}/${slug}`;
  return table ? `${base}?table=${table}` : base;
}

export default function QRModal({ cafe, open, onClose }: Props) {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [logoDUri, setLogoDUri] = useState<string>("");
  const qrRef = useRef<SVGSVGElement>(null);

  // Build emoji logo as data URI for QR center image
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 80;
    canvas.height = 80;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White circle background
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(40, 40, 40, 0, Math.PI * 2);
    ctx.fill();

    // Cafe emoji centered
    ctx.font = "44px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🍔", 40, 44);

    setLogoDUri(canvas.toDataURL("image/png"));
  }, []);

  const cafeUrl = buildUrl(cafe.slug, selectedTable);

  const copyLink = async () => {
    await navigator.clipboard.writeText(cafeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const size = 600;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      // Stamp "Scan to Order" text at bottom
      ctx.fillStyle = "#111111";
      ctx.font = `bold ${size * 0.04}px Arial`;
      ctx.textAlign = "center";
      ctx.fillText(
        selectedTable ? `Table ${selectedTable} · ${cafe.name}` : cafe.name,
        size / 2,
        size - size * 0.04
      );

      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = selectedTable
        ? `${cafe.slug}-table-${selectedTable}-qr.png`
        : `${cafe.slug}-qr.png`;
      a.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(xml)))}`;
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-5 pb-4">
                <div>
                  <h3 className="font-black text-white text-xl">QR Codes</h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    {selectedTable
                      ? `Showing QR for Table ${selectedTable}`
                      : "Showing QR for whole cafe"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Table selector */}
              <div className="px-5 mb-4">
                <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-2">
                  Select table
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* Whole cafe option */}
                  <button
                    onClick={() => setSelectedTable(null)}
                    className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                    style={
                      selectedTable === null
                        ? {
                            background: "rgb(var(--brand-rgb))",
                            borderColor: "rgb(var(--brand-rgb))",
                            color: "#0a0a0a",
                          }
                        : {
                            borderColor: "rgba(255,255,255,0.1)",
                            color: "#71717a",
                          }
                    }
                  >
                    All
                  </button>

                  {/* Individual tables */}
                  {Array.from({ length: TABLE_COUNT }, (_, i) => i + 1).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTable(t)}
                      className="w-9 h-9 rounded-full text-xs font-bold border transition-all"
                      style={
                        selectedTable === t
                          ? {
                              background: "rgb(var(--brand-rgb))",
                              borderColor: "rgb(var(--brand-rgb))",
                              color: "#0a0a0a",
                            }
                          : {
                              borderColor: "rgba(255,255,255,0.1)",
                              color: "#71717a",
                            }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center px-5 mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={cafeUrl}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="bg-white p-4 rounded-2xl shadow-xl"
                  >
                    <QRCodeSVG
                      ref={qrRef}
                      value={cafeUrl}
                      size={180}
                      fgColor={cafe.theme.primary}
                      bgColor="#ffffff"
                      level="H"
                      marginSize={1}
                      imageSettings={
                        logoDUri
                          ? { src: logoDUri, height: 36, width: 36, excavate: true }
                          : undefined
                      }
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Label */}
              <div className="text-center px-5 mb-5">
                <p className="font-bold text-white text-sm">{cafe.name}</p>
                {selectedTable && (
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "rgb(var(--brand-rgb))" }}
                  >
                    Table {selectedTable}
                  </p>
                )}
                <p className="text-zinc-600 text-[10px] mt-1 break-all">{cafeUrl}</p>
              </div>

              {/* Actions */}
              <div className="px-5 pb-5 space-y-2">
                <button
                  onClick={downloadQR}
                  className="w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-[#0a0a0a] hover:opacity-90 transition-opacity"
                  style={{ background: "rgb(var(--brand-rgb))" }}
                >
                  <Download size={15} />
                  Download{selectedTable ? ` Table ${selectedTable}` : ""} QR
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={copyLink}
                    className="py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border border-white/10 bg-white/4 text-zinc-300 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <Check size={13} className="text-green-400" />
                    ) : (
                      <Copy size={13} />
                    )}
                    {copied ? "Copied!" : "Copy Link"}
                  </button>

                  <a
                    href={cafeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-1.5 border border-white/10 bg-white/4 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ExternalLink size={13} />
                    Preview
                  </a>
                </div>
              </div>

              {/* Tip */}
              <div className="px-5 pb-5">
                <p className="text-center text-zinc-700 text-[10px] leading-relaxed">
                  Each table QR auto-fills the table number in the cart.
                  Download all 12, print, laminate, done.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
