import type { ConversationContext, ParsedUnderstanding, TimeRange } from "@/types/chat";

export const emptyConversationContext: ConversationContext = {
  locations: [],
  dateReference: "unspecified",
  exactDate: null,
  timeRange: "unspecified",
  lastIntent: "unknown",
  comparisonMetric: "none",
};

function defaultTimeRange(intent: ConversationContext["lastIntent"]): TimeRange {
  if (intent === "current_weather") return "current";
  return "all_day";
}

export function mergeConversationContext(
  previous: ConversationContext,
  parsed: ParsedUnderstanding,
): ConversationContext {
  const followUp = parsed.isFollowUp;

  const locations = parsed.locations.length > 0
    ? parsed.locations
    : followUp
      ? previous.locations
      : [];

  let lastIntent = parsed.intent !== "unknown"
    ? parsed.intent
    : followUp
      ? previous.lastIntent
      : "unknown";

  const dateReference = parsed.dateReference !== "unspecified"
    ? parsed.dateReference
    : followUp && previous.dateReference !== "unspecified"
      ? previous.dateReference
      : "today";

  const exactDate = dateReference === "exact"
    ? parsed.exactDate ?? (followUp ? previous.exactDate : null)
    : null;

  const dateChangedToFuture = parsed.dateReference === "tomorrow" || parsed.dateReference === "exact";
  if (followUp && parsed.intent === "unknown" && previous.lastIntent === "current_weather" && dateChangedToFuture) {
    lastIntent = "forecast";
  }

  const inheritedTime = followUp && previous.timeRange !== "unspecified" ? previous.timeRange : defaultTimeRange(lastIntent);
  const timeRange = parsed.timeRange !== "unspecified"
    ? parsed.timeRange
    : dateChangedToFuture && inheritedTime === "current"
      ? "all_day"
      : inheritedTime;

  const comparisonMetric = parsed.comparisonMetric !== "none"
    ? parsed.comparisonMetric
    : followUp && previous.comparisonMetric !== "none"
      ? previous.comparisonMetric
      : lastIntent === "compare"
        ? "general"
        : "none";

  return {
    locations,
    dateReference,
    exactDate,
    timeRange,
    lastIntent,
    comparisonMetric,
  };
}
