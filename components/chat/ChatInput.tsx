"use client";

import { FormEvent, KeyboardEvent, useState } from "react";

interface ChatInputProps {
  disabled: boolean;
  onSend: (message: string) => Promise<void>;
}

export function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const message = value.trim();
    if (!message || disabled) return;
    setValue("");
    await onSend(message);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await submit();
  };

  const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await submit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-sky-100 bg-white/80 p-3 backdrop-blur sm:p-4">
      <div className="flex items-end gap-2 rounded-2xl border border-sky-100 bg-white p-2 shadow-sm focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100/70">
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          rows={1}
          maxLength={1000}
          placeholder="ถามน้องร่ม เช่น พรุ่งนี้กรุงเทพฝนตกไหม"
          className="max-h-28 min-h-11 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:text-[15px]"
          aria-label="ข้อความถึงน้องร่ม"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          ส่ง
        </button>
      </div>
      <p className="mt-2 px-1 text-[11px] text-slate-400">
        ข้อมูลอากาศโดย Open-Meteo · น้องร่มอาจขอชื่อสถานที่เพิ่มเติมเมื่อข้อมูลไม่พอ
      </p>
    </form>
  );
}
