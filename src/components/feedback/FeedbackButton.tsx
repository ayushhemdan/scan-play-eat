"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, Check } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const LABELS = ["", "Poor", "Okay", "Good", "Great", "Amazing! 🔥"];

interface Props {
  cafeSlug: string;
  cafeName: string;
}

export default function FeedbackButton({ cafeSlug, cafeName }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!rating) return;
    setSubmitting(true);
    await supabase.from("feedback").insert({
      cafe_slug: cafeSlug,
      rating,
      comment: comment.trim(),
    });
    setSubmitting(false);
    setDone(true);
    setTimeout(() => {
      setOpen(false);
      setTimeout(() => { setDone(false); setRating(0); setComment(""); }, 400);
    }, 2000);
  };

  const active = hovered || rating;

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-32 md:bottom-6 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm shadow-xl border border-white/10 bg-[#1a1a1a] text-zinc-300 hover:text-white transition-colors"
        style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}
      >
        <Star size={14} className="text-amber-400" />
        Rate us
      </motion.button>

      {/* Sheet */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#111] border-t border-white/10 rounded-t-3xl p-6 max-w-lg mx-auto"
            >
              {/* Handle */}
              <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-5" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-black text-white text-xl">How was your experience?</h3>
                  <p className="text-zinc-500 text-sm mt-0.5">{cafeName}</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-green-500/15 border border-green-500/25 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={28} className="text-green-400" />
                    </div>
                    <p className="text-white font-black text-xl">Thank you! 🙏</p>
                    <p className="text-zinc-500 text-sm mt-1">Your feedback means a lot to us.</p>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    {/* Stars */}
                    <div className="flex justify-center gap-3 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <motion.button
                          key={s}
                          whileTap={{ scale: 0.85 }}
                          onMouseEnter={() => setHovered(s)}
                          onMouseLeave={() => setHovered(0)}
                          onClick={() => setRating(s)}
                          className="transition-transform"
                        >
                          <Star
                            size={40}
                            className="transition-all duration-150"
                            fill={s <= active ? "#f59e0b" : "transparent"}
                            stroke={s <= active ? "#f59e0b" : "#3f3f46"}
                            strokeWidth={1.5}
                          />
                        </motion.button>
                      ))}
                    </div>

                    {/* Label */}
                    <p className="text-center text-sm font-bold mb-5 h-5 transition-all"
                       style={{ color: active ? "#f59e0b" : "transparent" }}>
                      {LABELS[active]}
                    </p>

                    {/* Comment */}
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Anything specific? (optional)"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-white/20 transition-colors resize-none mb-4"
                    />

                    {/* Submit */}
                    <button
                      onClick={submit}
                      disabled={!rating || submitting}
                      className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{
                        background: rating ? "#f59e0b" : "rgba(255,255,255,0.06)",
                        color: rating ? "#0a0a0a" : "#71717a",
                      }}
                    >
                      <Send size={15} />
                      {submitting ? "Sending..." : "Send Feedback"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
