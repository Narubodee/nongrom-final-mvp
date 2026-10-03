import { Type } from "@google/genai";
import { z } from "zod";

export const intentValues = [
  "current_weather",
  "forecast",
  "rain",
  "umbrella",
  "laundry",
  "running",
  "compare",
  "unknown",
] as const;

export const dateReferenceValues = ["today", "tomorrow", "exact", "unspecified"] as const;
export const timeRangeValues = ["current", "all_day", "morning", "afternoon", "evening", "night", "unspecified"] as const;
export const comparisonMetricValues = ["temperature", "rain", "general", "none"] as const;

export const understandingSchema = z.object({
  intent: z.enum(intentValues),
  locations: z.array(z.string().trim().min(1)).max(2),
  dateReference: z.enum(dateReferenceValues),
  exactDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  timeRange: z.enum(timeRangeValues),
  comparisonMetric: z.enum(comparisonMetricValues),
  isFollowUp: z.boolean(),
});

export const conversationContextSchema = z.object({
  locations: z.array(z.string().trim().min(1)).max(2).default([]),
  dateReference: z.enum(dateReferenceValues).default("unspecified"),
  exactDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().default(null),
  timeRange: z.enum(timeRangeValues).default("unspecified"),
  lastIntent: z.enum(intentValues).default("unknown"),
  comparisonMetric: z.enum(comparisonMetricValues).default("none"),
});

export const chatRequestSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  context: conversationContextSchema.optional(),
});

export const understandingResponseSchema = {
  type: Type.OBJECT,
  properties: {
    intent: { type: Type.STRING, enum: [...intentValues] },
    locations: { type: Type.ARRAY, items: { type: Type.STRING } },
    dateReference: { type: Type.STRING, enum: [...dateReferenceValues] },
    exactDate: { type: Type.STRING, nullable: true },
    timeRange: { type: Type.STRING, enum: [...timeRangeValues] },
    comparisonMetric: { type: Type.STRING, enum: [...comparisonMetricValues] },
    isFollowUp: { type: Type.BOOLEAN },
  },
  required: [
    "intent",
    "locations",
    "dateReference",
    "exactDate",
    "timeRange",
    "comparisonMetric",
    "isFollowUp",
  ],
};
