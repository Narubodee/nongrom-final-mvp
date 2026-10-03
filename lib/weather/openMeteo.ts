import type { GeocodedLocation, WeatherApiResponse } from "@/types/weather";

const CURRENT_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
].join(",");

const HOURLY_FIELDS = [
  "temperature_2m",
  "apparent_temperature",
  "relative_humidity_2m",
  "precipitation_probability",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
].join(",");

const DAILY_FIELDS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "precipitation_probability_max",
  "precipitation_sum",
].join(",");

export class WeatherServiceError extends Error {}

export async function fetchWeather(location: GeocodedLocation): Promise<WeatherApiResponse> {
  const params = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    timezone: "auto",
    forecast_days: "16",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, {
    signal: AbortSignal.timeout(10000),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new WeatherServiceError(`Open-Meteo forecast returned ${response.status}`);
  }

  return (await response.json()) as WeatherApiResponse;
}
