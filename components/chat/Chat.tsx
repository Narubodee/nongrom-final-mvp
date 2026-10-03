"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { ChatApiResponse, ChatMessage as ChatMessageType, ConversationContext } from "@/types/chat";

const initialContext: ConversationContext = {
  locations: [],
  dateReference: "unspecified",
  exactDate: null,
  timeRange: "unspecified",
  lastIntent: "unknown",
  comparisonMetric: "none",
};

const welcomeMessage: ChatMessageType = {
  id: "welcome",
  role: "assistant",
  content: "สวัสดีค่ะ! ☂️ อยากเช็กสภาพอากาศ ฝน หรือวางแผนออกไปข้างนอกที่ไหน บอกน้องร่มได้เลยนะคะ",
};

const suggestions = [
  "วันนี้กรุงเทพฝนตกไหม",
  "พรุ่งนี้เชียงใหม่อากาศเป็นยังไง",
  "เย็นนี้กรุงเทพควรพกร่มไหม",
  "กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า",
];

export function Chat() {
  const [messages, setMessages] = useState<ChatMessageType[]>([welcomeMessage]);
  const [context, setContext] = useState<ConversationContext>(initialContext);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (content: string) => {
    if (loading) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((current) => [...current, userMessage]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, context }),
      });

      const data = (await response.json()) as ChatApiResponse;

      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดจากเซิร์ฟเวอร์");
      }

      if (data.context) setContext(data.context);

      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `ขออภัยค่ะ ☂️ ${message}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    setMessages([welcomeMessage]);
    setContext(initialContext);
  };

  return (
    <section className="mx-auto flex h-[calc(100vh-3rem)] min-h-[620px] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/70 shadow-[0_24px_80px_rgba(32,91,128,0.16)] backdrop-blur-xl lg:h-[calc(100vh-5rem)]">
      <header className="flex items-center justify-between border-b border-sky-100 bg-white/85 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-2xl shadow-inner">☂️</div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">NongRom</h1>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Prompt V3</span>
            </div>
            <p className="text-xs text-slate-500">น้องร่ม · AI Weather Chatbot</p>
          </div>
        </div>
        <button
          type="button"
          onClick={resetConversation}
          disabled={loading}
          className="rounded-xl border border-sky-100 bg-white px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-sky-50 disabled:opacity-50"
        >
          เริ่มแชทใหม่
        </button>
      </header>

      <div className="border-b border-sky-100/80 bg-sky-50/45 px-4 py-3 sm:px-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={loading}
              onClick={() => void sendMessage(suggestion)}
              className="shrink-0 rounded-full border border-sky-100 bg-white px-3 py-1.5 text-xs text-slate-600 shadow-sm transition hover:border-sky-200 hover:bg-sky-50 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <div className="chat-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ChatInput disabled={loading} onSend={sendMessage} />
    </section>
  );
}
