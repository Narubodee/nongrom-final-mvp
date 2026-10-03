import type { ChatMessage as ChatMessageType } from "@/types/chat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[88%] items-end gap-2 sm:max-w-[78%] ${isUser ? "flex-row-reverse" : ""}`}>
        {!isUser && (
          <div className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-100 bg-white text-lg shadow-sm">
            ☂️
          </div>
        )}
        <div
          className={[
            "whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:text-[15px]",
            isUser
              ? "rounded-br-md bg-sky-600 text-white"
              : "rounded-bl-md border border-sky-100 bg-white/95 text-slate-700",
          ].join(" ")}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
