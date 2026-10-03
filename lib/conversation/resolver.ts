import type { ConversationContext } from "@/types/chat";

export interface ContextValidationResult {
  ok: boolean;
  message?: string;
}

export function validateResolvedContext(context: ConversationContext): ContextValidationResult {
  if (context.locations.length === 0) {
    return {
      ok: false,
      message: "อยากเช็กสภาพอากาศที่ไหนคะ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️",
    };
  }

  if (context.lastIntent === "compare" && context.locations.length < 2) {
    return {
      ok: false,
      message: "ถ้าจะเปรียบเทียบ รบกวนบอกสถานที่ให้ครบ 2 แห่งนะคะ ☂️",
    };
  }

  if (context.dateReference === "exact" && !context.exactDate) {
    return {
      ok: false,
      message: "น้องร่มยังไม่แน่ใจวันที่ที่ต้องการค่ะ ลองระบุวันที่อีกครั้งได้เลยนะคะ",
    };
  }

  return { ok: true };
}
