"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw } from "lucide-react";

type Segment = { label: string; sub: string; color: string; special?: boolean };

const SEGMENTS: Segment[] = [
  { label: "Split evenly", sub: "Fair and square 🤝", color: "#10B981" },
  { label: "Youngest pays", sub: "Age has a price 🎂", color: "#3B82F6" },
  { label: "Rock Paper Scissors", sub: "Best of 3 ✂️", color: "#8B5CF6" },
  { label: "Whoever ordered most", sub: "You ate it, you pay 💸", color: "#F59E0B" },
  { label: "Oldest pays", sub: "Seniority tax 👑", color: "#EF4444" },
  { label: "Arm wrestle", sub: "Winner eats free 💪", color: "#0891B2" },
  { label: "First to blink", sub: "Eyes on the prize 👁️", color: "#EC4899" },
  { label: "Cafe's treat!", sub: "Lucky you! Tell the waiter 🎉", color: "#F59E0B", special: true },
];

const N = SEGMENTS.length;
const SLICE = 360 / N;
const CX = 150;
const CY = 150;
const R = 138;

function polar(angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

function slicePath(i: number) {
  const start = polar(i * SLICE);
  const end = polar((i + 1) * SLICE);
  return `M${CX},${CY} L${start.x},${start.y} A${R},${R},0,0,1,${end.x},${end.y} Z`;
}

function labelPosition(i: number) {
  const mid = (i + 0.5) * SLICE;
  const rad = ((mid - 90) * Math.PI) / 180;
  const r = R * 0.62;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad), rotate: mid };
}

interface Props { onBack: () => void }

export default function SpinWheel({ onBack }: Props) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Segment | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (spinning) return;
    setResult(null);

    const extra = 1440 + Math.floor(Math.random() * 1440);
    const stopOffset = Math.random() * SLICE;
    const total = rotation + extra + stopOffset;

    setSpinning(true);
    setRotation(total);

    setTimeout(() => {
      const norm = ((total % 360) + 360) % 360;
      const idx = Math.floor(((360 - norm + SLICE / 2) % 360) / SLICE) % N;
      setResult(SEGMENTS[idx]);
      setSpinning(false);
    }, 4200);
  };

  const reset = () => {
    setResult(null);
    setRotation(0);
  };

  return (
    <div className="max-w-lg mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm mb-6 transition-colors font-semibold" style={{ color: "#a78bfa" }}>
        <ArrowLeft size={15} /> Back to games
      </button>

      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-full mb-3">
          <span className="text-lg">🎡</span>
          <span className="text-violet-400 font-black text-sm uppercase tracking-widest">Spin the Wheel</span>
        </div>
        <p className="text-zinc-400 text-sm">Fate decides who pays — no arguments allowed.</p>
      </div>

      {/* Wheel + pointer */}
      <div className="relative flex justify-center items-center mb-6">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 w-0 h-0"
          style={{ borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "22px solid white" }}
        />

        {/* Wheel */}
        <div
          ref={wheelRef}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17,0.67,0.08,0.99)" : "none",
            borderRadius: "50%",
            boxShadow: "0 0 40px rgba(0,0,0,0.6)",
          }}
        >
          <svg viewBox="0 0 300 300" width={300} height={300}>
            {SEGMENTS.map((seg, i) => (
              <g key={i}>
                <path d={slicePath(i)} fill={seg.color} opacity={seg.special ? 1 : 0.85} />
                <path d={slicePath(i)} fill="none" stroke="#0a0a0a" strokeWidth={1.5} />
                <text
                  x={labelPosition(i).x}
                  y={labelPosition(i).y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${labelPosition(i).rotate}, ${labelPosition(i).x}, ${labelPosition(i).y})`}
                  fill="white"
                  fontSize={seg.special ? "9" : "8.5"}
                  fontWeight="700"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                >
                  {seg.label}
                </text>
              </g>
            ))}
            {/* Center cap */}
            <circle cx={CX} cy={CY} r={18} fill="#0a0a0a" />
            <circle cx={CX} cy={CY} r={14} fill="#1a1a1a" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.6)" fontSize="9">SPIN</text>
          </svg>
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={spin}
        disabled={spinning}
        className="w-full py-4 rounded-2xl font-black text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
        style={{ background: "#7c3aed", boxShadow: spinning ? "none" : "0 8px 30px rgba(124,58,237,0.5)" }}
      >
        {spinning ? "Spinning... 🎡" : "Spin the Wheel! 🎡"}
      </button>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", damping: 18, stiffness: 250 }}
            className="mt-5 rounded-3xl p-6 text-center border"
            style={{
              background: `${result.color}18`,
              borderColor: `${result.color}40`,
            }}
          >
            {result.special && <p className="text-2xl mb-1">🎉</p>}
            <h3 className="text-2xl font-black text-white mb-1">{result.label}!</h3>
            <p className="text-zinc-400 text-sm">{result.sub}</p>
            <button onClick={reset} className="mt-4 flex items-center gap-1.5 mx-auto text-zinc-500 hover:text-white text-xs transition-colors">
              <RotateCcw size={12} /> Spin again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
