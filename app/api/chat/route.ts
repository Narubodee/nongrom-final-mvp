import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { chatRequestSchema } from "@/lib/gemini/schemas";
import { GEMINI_MODEL, GeminiConfigurationError, GeminiRequestError, composeWeatherResponse, interpretWeatherQuery } from "@/lib/gemini/client";
import { PROMPT_VERSION } from "@/lib/gemini/prompts/v3";
import { emptyConversationContext, mergeConversationContext } from "@/lib/conversation/context";
import { validateResolvedContext } from "@/lib/conversation/resolver";
import { resolveDate, timeRangeLabels } from "@/lib/date-time/resolver";
import { AmbiguousLocationError, GeocodingServiceError, LocationNotFoundError, geocodeLocation } from "@/lib/weather/geocoding";
import { WeatherServiceError, fetchWeather } from "@/lib/weather/openMeteo";
import { ForecastUnavailableError, normalizeWeather } from "@/lib/weather/normalize";
import { compareWeather, makeRecommendation } from "@/lib/recommendations/rules";
import { buildFallbackResponse } from "@/lib/response/fallback";
import { buildVerifiedComparisonResponse, cleanupResponseFormatting, prefersEnglishResponse, responseViolatesUserLanguage } from "@/lib/response/hardening";
import type { GeocodedLocation, WeatherRecommendation } from "@/types/weather";

export const runtime = "nodejs";

function errorResponse(message: string, status: number, errorCode: string) {
  return NextResponse.json(
    {
      message,
      errorCode,
      meta: { model: GEMINI_MODEL, promptVersion: PROMPT_VERSION },
    },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    const body = chatRequestSchema.parse(await request.json());
    const previousContext = body.context ?? emptyConversationContext;

    const parsed = await interpretWeatherQuery(body.message, previousContext);
    const context = mergeConversationContext(previousContext, parsed);
    const validation = validateResolvedContext(context);

    if (!validation.ok) {
      return NextResponse.json({
        message: validation.message,
        context,
        meta: { model: GEMINI_MODEL, promptVersion: PROMPT_VERSION },
      });
    }

    let locations: GeocodedLocation[];
    try {
      locations = await Promise.all(context.locations.map((location) => geocodeLocation(location)));
    } catch (error) {
      if (error instanceof AmbiguousLocationError) {
        return errorResponse(
          `ชื่อสถานที่นี้อาจหมายถึงหลายแห่งค่ะ ลองระบุเพิ่ม เช่น จังหวัดหรือประเทศ: ${error.options.join(" / ")}`,
          422,
          "LOCATION_AMBIGUOUS",
        );
      }
      if (error instanceof LocationNotFoundError) {
        return errorResponse(`น้องร่มค้นหาสถานที่ “${error.message}” ไม่พบค่ะ ลองพิมพ์ชื่อเมืองหรือจังหวัดอีกครั้ง`, 404, "LOCATION_NOT_FOUND");
      }
      if (error instanceof GeocodingServiceError) {
        return errorResponse("ตอนนี้ค้นหาพิกัดจาก Open-Meteo ไม่สำเร็จค่ะ ลองใหม่อีกครั้งนะคะ", 502, "GEOCODING_UNAVAILABLE");
      }
      throw error;
    }

    const targetDate = resolveDate(context.dateReference, context.exactDate, locations[0].timezone);
    const rawWeather = await Promise.all(locations.map((location) => fetchWeather(location)));
    const weather = rawWeather.map((raw, index) => normalizeWeather(locations[index], raw, targetDate, context.timeRange));

    let recommendation: WeatherRecommendation | undefined;
    if (context.lastIntent === "umbrella" || context.lastIntent === "laundry" || context.lastIntent === "running") {
      recommendation = makeRecommendation(context.lastIntent, weather[0]);
    }

    const comparison = context.lastIntent === "compare"
      ? compareWeather(weather, context.comparisonMetric)
      : undefined;

    const verifiedFacts = {
      source: "Open-Meteo",
      requestedDate: targetDate,
      requestedTimeRange: context.timeRange,
      requestedTimeRangeLabelThai: timeRangeLabels[context.timeRange],
      intent: context.lastIntent,
      weather,
      recommendation,
      comparison,
    };

    let message: string;
    if (comparison) {
      // Comparison facts and canonical location names are already deterministic.
      // Keep the final comparison at application level so verified entity names cannot
      // be shortened or mutated by response generation.
      message = buildVerifiedComparisonResponse(comparison, body.message);
    } else {
      try {
        message = await composeWeatherResponse(body.message, verifiedFacts);
        if (responseViolatesUserLanguage(body.message, message)) {
          message = buildFallbackResponse(
            { weather, recommendation, comparison, intent: context.lastIntent },
            "en",
          );
        }
      } catch (error) {
        if (error instanceof GeminiRequestError && error.code !== "MODEL_UNAVAILABLE") {
          message = buildFallbackResponse(
            { weather, recommendation, comparison, intent: context.lastIntent },
            prefersEnglishResponse(body.message) ? "en" : "th",
          );
        } else {
          throw error;
        }
      }
    }

    message = cleanupResponseFormatting(message);

    return NextResponse.json({
      message,
      context,
      meta: {
        model: GEMINI_MODEL,
        promptVersion: PROMPT_VERSION,
        weatherSource: "Open-Meteo",
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("รูปแบบคำขอไม่ถูกต้องค่ะ ลองพิมพ์คำถามใหม่อีกครั้งนะคะ", 400, "BAD_REQUEST");
    }
    if (error instanceof GeminiConfigurationError) {
      return errorResponse(error.message, 500, "MISSING_API_KEY");
    }
    if (error instanceof GeminiRequestError) {
      const status = error.code === "QUOTA" ? 429 : error.code === "MODEL_UNAVAILABLE" ? 503 : 502;
      return errorResponse(error.message, status, `GEMINI_${error.code}`);
    }
    if (error instanceof ForecastUnavailableError) {
      return errorResponse("น้องร่มยังไม่มีข้อมูลพยากรณ์สำหรับวันหรือช่วงเวลานั้นค่ะ ลองเลือกวันที่ใกล้ขึ้นนะคะ", 422, "FORECAST_UNAVAILABLE");
    }
    if (error instanceof WeatherServiceError) {
      return errorResponse("ตอนนี้ดึงข้อมูลอากาศจาก Open-Meteo ไม่สำเร็จค่ะ ลองใหม่อีกครั้งนะคะ", 502, "WEATHER_UNAVAILABLE");
    }

    console.error("Unhandled /api/chat error", error);
    return errorResponse("เกิดข้อผิดพลาดภายในระบบค่ะ ลองใหม่อีกครั้งนะคะ", 500, "INTERNAL_ERROR");
  }
}
