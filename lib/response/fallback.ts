import type { Intent } from "@/types/chat";
import type { WeatherComparison, WeatherRecommendation, WeatherSummary } from "@/types/weather";

interface FallbackFacts {
  weather: WeatherSummary[];
  recommendation?: WeatherRecommendation;
  comparison?: WeatherComparison;
  intent?: Intent;
}

type FallbackLanguage = "th" | "en";

function formatEnglishDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function englishWeatherCondition(code: number): string {
  if (code === 0) return "clear skies";
  if (code === 1) return "mainly clear skies";
  if (code === 2) return "partly cloudy conditions";
  if (code === 3) return "overcast conditions";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code === 56 || code === 57) return "freezing drizzle";
  if (code === 61) return "light rain";
  if (code === 63) return "moderate rain";
  if (code === 65) return "heavy rain";
  if (code === 66 || code === 67) return "freezing rain";
  if (code >= 71 && code <= 75) return "snow";
  if (code === 77) return "snow grains";
  if (code >= 80 && code <= 82) return "rain showers";
  if (code === 85 || code === 86) return "snow showers";
  if (code === 95) return "thunderstorms";
  if (code === 96 || code === 99) return "thunderstorms with hail";
  return "weather conditions";
}

function isRainCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
}

function buildEnglishFallbackResponse(facts: FallbackFacts): string {
  if (facts.comparison) {
    const [first, second] = facts.comparison.values;
    if (!first || !second) return "There is not enough weather data to compare these locations.";
    return `For ${first.location} versus ${second.location}, the maximum temperatures are ${first.temperatureMaxC ?? "—"}°C and ${second.temperatureMaxC ?? "—"}°C, with rain chances of ${first.precipitationProbabilityPercent ?? "—"}% and ${second.precipitationProbabilityPercent ?? "—"}%, respectively.`;
  }

  const weather = facts.weather[0];
  if (!weather) return "I do not have enough verified weather data to answer that yet. ☂️";

  const location = weather.location.name;
  const date = formatEnglishDate(weather.date);
  const rainProbability = weather.precipitationProbabilityPercent;
  const precipitation = weather.precipitationMm;
  const condition = englishWeatherCondition(weather.weatherCode);

  if (facts.intent === "rain") {
    const rainExpected = isRainCode(weather.weatherCode) || (rainProbability ?? 0) >= 50 || (precipitation ?? 0) > 0;
    const probabilityText = rainProbability === null ? "" : ` a ${rainProbability}% chance of rain`;
    const precipitationText = precipitation === null ? "" : `, with expected precipitation of ${precipitation} mm`;
    if (rainExpected) {
      return `Yes, there is${probabilityText || " rain expected"} in ${location} on ${date}${precipitationText}. 🌧️`;
    }
    return `Rain is not expected to be significant in ${location} on ${date}${probabilityText ? `; the chance of rain is ${rainProbability}%` : ""}${precipitationText}.`;
  }

  if (facts.recommendation) {
    const decisionText: Record<WeatherRecommendation["decision"], string> = {
      recommended: "Recommended",
      consider: "Consider it based on your plans",
      not_recommended: "Not recommended",
      suitable: "Generally suitable",
      not_needed: "Probably not needed",
    };
    const details = [
      rainProbability === null ? null : `rain chance ${rainProbability}%`,
      precipitation === null ? null : `precipitation ${precipitation} mm`,
      weather.apparentTemperatureC === null ? null : `feels like ${weather.apparentTemperatureC}°C`,
      weather.windSpeedKmh === null ? null : `wind ${weather.windSpeedKmh} km/h`,
    ].filter((item): item is string => Boolean(item)).slice(0, 2);
    return `${decisionText[facts.recommendation.decision]} for ${location} on ${date}${details.length ? `: ${details.join(", ")}` : ""}. ☂️`;
  }

  const details = [
    weather.temperatureMinC === null ? null : `low ${weather.temperatureMinC}°C`,
    weather.temperatureMaxC === null ? null : `high ${weather.temperatureMaxC}°C`,
    rainProbability === null ? null : `rain chance ${rainProbability}%`,
    precipitation === null ? null : `precipitation ${precipitation} mm`,
  ].filter((item): item is string => Boolean(item));

  return `${location} on ${date}: ${condition}${details.length ? `, with ${details.join(", ")}` : ""}. ☂️`;
}

export function buildFallbackResponse(facts: FallbackFacts, language: FallbackLanguage = "th"): string {
  if (language === "en") return buildEnglishFallbackResponse(facts);

  if (facts.comparison) {
    return `${facts.comparison.summary} ☂️`;
  }

  const weather = facts.weather[0];
  if (!weather) return "น้องร่มได้รับข้อมูลไม่ครบค่ะ ลองถามใหม่อีกครั้งได้เลยนะคะ ☂️";

  const location = weather.location.name;
  const temp = weather.temperatureC ?? weather.temperatureMaxC;
  const tempText = temp === null ? "" : ` อุณหภูมิประมาณ ${temp}°C`;
  const rainText = weather.precipitationProbabilityPercent === null
    ? ""
    : ` โอกาสฝนสูงสุด ${weather.precipitationProbabilityPercent}%`;

  if (facts.recommendation) {
    const decisionMap = {
      recommended: "แนะนำ",
      consider: "ควรพิจารณาตามแผนของคุณ",
      not_recommended: "ยังไม่ค่อยแนะนำ",
      suitable: "ค่อนข้างเหมาะ",
      not_needed: "ยังไม่จำเป็นมาก",
    } as const;
    return `${location}: ${decisionMap[facts.recommendation.decision]}ค่ะ ☂️ ${facts.recommendation.reasons.join(" · ")}`;
  }

  return `${location}: ${weather.condition}.${tempText}${rainText} ☂️`;
}
