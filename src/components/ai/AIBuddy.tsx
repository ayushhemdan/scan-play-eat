"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Bot } from "lucide-react";
import type { Cafe } from "@/types/cafe";
import { getResponse } from "@/lib/ai/chatEngine";

type Message = { role: "user" | "ai"; text: string };

const QUICK_PROMPTS = [
  "What's the bestseller? ⭐",
  "I'm starving 😤",
  "Veg options 🥬",
  "Something spicy 🌶️",
  "Build me a combo 🔥",
  "Date night pick 💑",
  "Something under ₹150 💰",
  "Light snack only 😌",
];

function renderText(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
}

interface Props { cafe: Cafe }

export default function AIBuddy({ cafe }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `Hey! 👋 I'm **${cafe.aiName ?? "Cafe Buddy"}**, your personal guide to **${cafe.name}**. Ask me for recommendations, combos, or anything about the menu!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = getResponse(trimmed, cafe.menu, cafe.name, cafe.aiName ?? "Cafe Buddy");
      setMessages((prev) => [...prev, { role: "ai", text: reply }]);
      setTyping(false);
    }, 800 + Math.random() * 400);
  };

  const aiName = cafe.aiName ?? "Cafe Buddy";

  return (
    <>
      {/* Floating trigger — left side to avoid clashing with stamp card on right */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 md:bottom-6 left-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm text-white shadow-xl"
        style={{
          background: "linear-gradient(135deg, #7C3AED, #4F46E5)",
          boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
        }}
      >
        <Sparkles size={15} />
        <span className="hidden sm:inline">{aiName}</span>
        <span className="sm:hidden">AI</span>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop (mobile only) */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Panel — bottom drawer on mobile, floating widget on desktop */}
            <motion.div
              key="panel"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="
                fixed z-50 flex flex-col bg-[#111] border border-white/10
                bottom-0 left-0 right-0 rounded-t-3xl max-h-[88vh]
                md:bottom-6 md:left-4 md:right-auto md:w-[380px] md:rounded-3xl md:max-h-[560px]
              "
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-white/8 shrink-0">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}>
                  <Bot size={17} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{aiName}</p>
                  <p className="text-[11px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                    Knows your full menu
                  </p>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "text-white rounded-br-sm"
                          : "bg-white/5 border border-white/8 text-zinc-100 rounded-bl-sm"
                      }`}
                      style={msg.role === "user" ? { background: "rgb(var(--brand-rgb))" } : undefined}
                      dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                    />
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {typing && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ y: [0, -4, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.12 }}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick prompts */}
              <div className="px-4 py-2 border-t border-white/8 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    disabled={typing}
                    className="flex-shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-white/10 bg-white/4 text-zinc-400 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40"
                  >
                    {p}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 px-4 pb-5 pt-2 shrink-0">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send(input)}
                  placeholder="Ask anything about the menu..."
                  disabled={typing}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || typing}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity disabled:opacity-30"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                >
                  <Send size={15} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
