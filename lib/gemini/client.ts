import { GoogleGenAI } from "@google/genai";
import type { ConversationContext, ParsedUnderstanding } from "@/types/chat";
import { understandingResponseSchema, understandingSchema } from "./schemas";
import { RESPONSE_SYSTEM_PROMPT_V3, UNDERSTANDING_SYSTEM_PROMPT_V3 } from "./prompts/v3";

export const GEMINI_MODEL = "gemini-3.5-flash-lite" as const;

export class GeminiConfigurationError extends Error {}
export class GeminiRequestError extends Error {
  constructor(
    message: string,
    public readonly code: "MODEL_UNAVAILABLE" | "QUOTA" | "UNAVAILABLE",
  ) {
    super(message);
  }
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiConfigurationError("ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน .env.local");
  }
  return new GoogleGenAI({ apiKey });
}

const GEMINI_RETRY_MAX_ATTEMPTS = 3;
const GEMINI_RETRY_BASE_DELAY_MS = 1500;

function getGeminiHttpStatus(error: unknown): number | null {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if (typeof status === "number") return status;
  }

  const raw = error instanceof Error ? error.message : String(error);
  const jsonCode = raw.match(/"code"\s*:\s*(\d{3})/);
  if (jsonCode) return Number(jsonCode[1]);

  const plainCode = raw.match(/\b(408|429|5\d{2})\b/);
  return plainCode ? Number(plainCode[1]) : null;
}

function isRetryableGeminiStatus(status: number | null): boolean {
  return status === 408 || status === 429 || (status !== null && status >= 500 && status <= 599);
}

async function withGeminiRetry<T>(operation: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= GEMINI_RETRY_MAX_ATTEMPTS; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const status = getGeminiHttpStatus(error);

      if (!isRetryableGeminiStatus(status) || attempt === GEMINI_RETRY_MAX_ATTEMPTS) {
        throw error;
      }

      const exponentialDelay = GEMINI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1);
      const jitterMs = Math.floor(Math.random() * 301);
      const delayMs = exponentialDelay + jitterMs;

      console.warn("Gemini transient error; retrying", {
        model: GEMINI_MODEL,
        status,
        attempt,
        maxAttempts: GEMINI_RETRY_MAX_ATTEMPTS,
        delayMs,
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

function classifyGeminiError(error: unknown): GeminiRequestError {
  const raw = error instanceof Error ? error.message : String(error);
  console.error("Gemini API request failed", {
    model: GEMINI_MODEL,
    errorName: error instanceof Error ? error.name : typeof error,
    errorMessage: raw,
    cause: error instanceof Error && "cause" in error ? error.cause : undefined,
  });
  const message = raw.toLowerCase();

  if (message.includes("429") || message.includes("quota") || message.includes("resource_exhausted")) {
    return new GeminiRequestError("Gemini API ถึงโควตาหรือ Rate Limit ของบัญชีในขณะนี้", "QUOTA");
  }

  if (
    message.includes("404") ||
    message.includes("model not found") ||
    message.includes("not found for api version") ||
    message.includes("permission") ||
    message.includes("not available")
  ) {
    return new GeminiRequestError(
      `API Key นี้ไม่สามารถเรียกโมเดล ${GEMINI_MODEL} ได้ในขณะนี้ ระบบไม่ได้เปลี่ยนไปใช้โมเดลอื่นอัตโนมัติ`,
      "MODEL_UNAVAILABLE",
    );
  }

  return new GeminiRequestError("ไม่สามารถติดต่อ Gemini API ได้ในขณะนี้", "UNAVAILABLE");
}

export async function interpretWeatherQuery(
  userMessage: string,
  context: ConversationContext,
): Promise<ParsedUnderstanding> {
  try {
    const ai = getGeminiClient();
    const response = await withGeminiRetry(() => ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `PREVIOUS_CONTEXT:\n${JSON.stringify(context)}\n\nLATEST_USER_MESSAGE:\n${userMessage}`,
      config: {
        systemInstruction: UNDERSTANDING_SYSTEM_PROMPT_V3,
        responseMimeType: "application/json",
        responseSchema: understandingResponseSchema,
      },
    }));

    if (!response.text) throw new Error("Gemini returned an empty structured response");
    return understandingSchema.parse(JSON.parse(response.text));
  } catch (error) {
    if (error instanceof GeminiConfigurationError || error instanceof GeminiRequestError) throw error;
    if (error instanceof SyntaxError || (error instanceof Error && error.name === "ZodError")) {
      throw new GeminiRequestError("Gemini ส่ง Structured Output ที่ตรวจสอบไม่ผ่าน", "UNAVAILABLE");
    }
    throw classifyGeminiError(error);
  }
}

export async function composeWeatherResponse(
  userMessage: string,
  verifiedFacts: unknown,
): Promise<string> {
  try {
    const ai = getGeminiClient();
    const response = await withGeminiRetry(() => ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `USER_MESSAGE:\n${userMessage}\n\nVERIFIED_WEATHER_FACTS:\n${JSON.stringify(verifiedFacts, null, 2)}`,
      config: {
        systemInstruction: RESPONSE_SYSTEM_PROMPT_V3,
      },
    }));

    if (!response.text?.trim()) throw new Error("Gemini returned an empty response");
    return response.text.trim();
  } catch (error) {
    if (error instanceof GeminiConfigurationError || error instanceof GeminiRequestError) throw error;
    throw classifyGeminiError(error);
  }
}
