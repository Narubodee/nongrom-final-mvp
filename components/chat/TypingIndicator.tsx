export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-end gap-2">
        <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-full border border-sky-100 bg-white text-lg shadow-sm">
          ☂️
        </div>
        <div className="rounded-2xl rounded-bl-md border border-sky-100 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
          น้องร่มกำลังเช็กอากาศ... <span className="inline-block animate-pulse">☁️</span>
        </div>
      </div>
    </div>
  );
}
