export type Intent =
  | "current_weather"
  | "forecast"
  | "rain"
  | "umbrella"
  | "laundry"
  | "running"
  | "compare"
  | "unknown";

export type DateReference = "today" | "tomorrow" | "exact" | "unspecified";
export type TimeRange = "current" | "all_day" | "morning" | "afternoon" | "evening" | "night" | "unspecified";
export type ComparisonMetric = "temperature" | "rain" | "general" | "none";

export interface ConversationContext {
  locations: string[];
  dateReference: DateReference;
  exactDate: string | null;
  timeRange: TimeRange;
  lastIntent: Intent;
  comparisonMetric: ComparisonMetric;
}

export interface ParsedUnderstanding {
  intent: Intent;
  locations: string[];
  dateReference: DateReference;
  exactDate: string | null;
  timeRange: TimeRange;
  comparisonMetric: ComparisonMetric;
  isFollowUp: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface ChatApiResponse {
  message: string;
  context?: ConversationContext;
  errorCode?: string;
  meta?: {
    model: string;
    promptVersion: "V1" | "V2";
    weatherSource?: "Open-Meteo";
  };
}
