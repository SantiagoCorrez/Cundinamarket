"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { Send, Star } from "lucide-react";
import { BackBar } from "@/components/nav";
import { askBot, type BotResult } from "@/lib/actions/bot";

type Msg = { from: "bot" | "user"; text: string; results?: BotResult[] };

const quick = ["Buscar restaurantes", "Comercios verificados", "Promociones", "Servicios técnicos"];

export default function ChatbotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "¡Hola! 👋 Soy CundiBot, tu asistente. ¿En qué puedo ayudarte hoy?" },
  ]);
  const [input, setInput] = useState("");
  const [pending, start] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, pending]);

  function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    start(async () => {
      const res = await askBot(t);
      setMsgs((m) => [...m, { from: "bot", text: res.reply, results: res.results }]);
    });
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-4.75rem)]">
      <BackBar title="Asistente CundiBot" />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={
                m.from === "user"
                  ? "max-w-[80%] bg-ink text-white rounded-2xl rounded-br-md px-4 py-2.5 text-[15px]"
                  : "max-w-[85%] bg-surface border border-line rounded-2xl rounded-bl-md px-4 py-2.5 text-[15px] shadow-card"
              }
            >
              <p>{m.text}</p>
              {m.results && m.results.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {m.results.map((r) => (
                    <Link
                      key={r.id + r.name}
                      href={r.href}
                      className="flex items-center justify-between gap-2 bg-bg rounded-xl px-3 py-2 text-sm"
                    >
                      <span className="font-medium truncate">{r.name}</span>
                      {r.rating > 0 && (
                        <span className="inline-flex items-center gap-0.5 text-[#f5a623] text-xs shrink-0">
                          <Star size={12} className="fill-current" /> {r.rating.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <div className="flex justify-start">
            <div className="bg-surface border border-line rounded-2xl px-4 py-3 shadow-card">
              <span className="flex gap-1">
                <span className="h-2 w-2 rounded-full bg-ink-faint animate-pulse-soft" />
                <span className="h-2 w-2 rounded-full bg-ink-faint animate-pulse-soft" style={{ animationDelay: ".2s" }} />
                <span className="h-2 w-2 rounded-full bg-ink-faint animate-pulse-soft" style={{ animationDelay: ".4s" }} />
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
        {quick.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="shrink-0 bg-brand/15 text-brand-ink rounded-full px-3 py-1.5 text-sm font-medium"
          >
            {q}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-line bg-surface flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje…"
          className="flex-1 h-11 bg-bg rounded-2xl px-4 outline-none text-[15px]"
        />
        <button
          type="submit"
          className="h-11 w-11 rounded-full bg-brand grid place-items-center text-brand-ink active:scale-95 transition"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
