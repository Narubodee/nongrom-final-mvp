import type { TimeRange } from "./chat";

export interface GeocodedLocation {
  query: string;
  name: string;
  admin1?: string;
  country: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface WeatherApiResponse {
  timezone: string;
  current?: {
    time: string;
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    apparent_temperature: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    wind_speed_10m: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
  };
}

export interface WeatherSummary {
  location: {
    name: string;
    admin1?: string;
    country: string;
  };
  date: string;
  timeRange: TimeRange;
  condition: string;
  weatherCode: number;
  temperatureC: number | null;
  temperatureMinC: number | null;
  temperatureMaxC: number | null;
  apparentTemperatureC: number | null;
  humidityPercent: number | null;
  precipitationProbabilityPercent: number | null;
  precipitationMm: number | null;
  windSpeedKmh: number | null;
  observedAt?: string;
}

export type RecommendationKind = "umbrella" | "laundry" | "running";
export type RecommendationDecision = "recommended" | "consider" | "not_recommended" | "suitable" | "not_needed";

export interface WeatherRecommendation {
  kind: RecommendationKind;
  decision: RecommendationDecision;
  reasons: string[];
}

export interface WeatherComparison {
  metric: "temperature" | "rain" | "general";
  summary: string;
  values: Array<{
    location: string;
    temperatureMaxC: number | null;
    precipitationProbabilityPercent: number | null;
    precipitationMm: number | null;
  }>;
}
