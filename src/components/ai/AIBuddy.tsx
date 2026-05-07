"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Bot, AlertCircle } from "lucide-react";
import type { Cafe } from "@/types/cafe";

type Message = { role: "user" | "ai"; text: string };

const QUICK_PROMPTS = [
  "What's the bestseller? ⭐",
  "I'm starving 😤",
  "Veg options 🥬",
  "Something spicy 🌶️",
  "Build me a combo 🔥",
  "Date night pick 💑",
  "Under ₹150 💰",
  "Best cold drink?",
];

function renderText(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

interface Props { cafe: Cafe }

export default function AIBuddy({ cafe }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: `Hey! 👋 I'm **${cafe.aiName ?? "Cafe Buddy"}**, your personal guide to **${cafe.name}**. Ask me anything — I know the whole menu!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setInput("");
    setError(null);

    // Add user message + placeholder AI message
    const userMessage: Message = { role: "user", text: trimmed };
    const aiPlaceholder: Message = { role: "ai", text: "" };
    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);
    setStreaming(true);

    // Build messages array for the API (only user/assistant turns)
    const history = [...messages, userMessage]
      .filter((m) => m.text.length > 0)
      .map((m) => ({
        role: m.role === "user" ? "user" : ("assistant" as const),
        content: m.text,
      }));

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, cafeSlug: cafe.slug }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Chat unavailable. Try again.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });

        // Update the last AI message in real time
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "ai", text: accumulated };
          return updated;
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      // Remove the empty placeholder
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  };

  const handleClose = () => {
    abortRef.current?.abort();
    setOpen(false);
  };

  const aiName = cafe.aiName ?? "Cafe Buddy";

  return (
    <>
      {/* Floating trigger */}
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
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
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
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #4F46E5)" }}
                >
                  <Bot size={17} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">{aiName}</p>
                  <p className="text-[11px] flex items-center gap-1" style={{ color: streaming ? "#f59e0b" : "#4ade80" }}>
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: streaming ? "#f59e0b" : "#4ade80", animation: streaming ? "pulse 1s infinite" : "none" }}
                    />
                    {streaming ? "Thinking..." : "Knows your full menu"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/8 text-zinc-400 hover:text-white transition-colors"
                >
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
                    {msg.role === "ai" && msg.text === "" ? (
                      <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-2xl rounded-bl-sm">
                        <div className="flex gap-1 items-center h-4">
                          {[0, 1, 2].map((j) => (
                            <motion.span
                              key={j}
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.12 }}
                              className="w-1.5 h-1.5 bg-violet-400 rounded-full block"
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "text-white rounded-br-sm"
                            : "bg-white/5 border border-white/8 text-zinc-100 rounded-bl-sm"
                        }`}
                        style={msg.role === "user" ? { background: "rgb(var(--brand-rgb))" } : undefined}
                        dangerouslySetInnerHTML={{ __html: renderText(msg.text) }}
                      />
                    )}
                  </motion.div>
                ))}

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                    <AlertCircle size={13} />
                    {error}
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
                    disabled={streaming}
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
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
                  placeholder="Ask anything about the menu..."
                  disabled={streaming}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-violet-500/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || streaming}
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
