import type { TimeRange } from "@/types/chat";
import type { GeocodedLocation, WeatherApiResponse, WeatherSummary } from "@/types/weather";
import { hourIsInRange } from "@/lib/date-time/resolver";

export class ForecastUnavailableError extends Error {}

const weatherDescriptions: Record<number, string> = {
  0: "ท้องฟ้าแจ่มใส",
  1: "ท้องฟ้าส่วนใหญ่แจ่มใส",
  2: "มีเมฆบางส่วน",
  3: "มีเมฆมาก",
  45: "มีหมอก",
  48: "มีหมอกน้ำค้างแข็ง",
  51: "ฝนปรอยเบา",
  53: "ฝนปรอยปานกลาง",
  55: "ฝนปรอยหนัก",
  56: "ฝนปรอยเยือกแข็งเบา",
  57: "ฝนปรอยเยือกแข็งหนัก",
  61: "ฝนเบา",
  63: "ฝนปานกลาง",
  65: "ฝนหนัก",
  66: "ฝนเยือกแข็งเบา",
  67: "ฝนเยือกแข็งหนัก",
  71: "หิมะเบา",
  73: "หิมะปานกลาง",
  75: "หิมะหนัก",
  77: "เกล็ดหิมะ",
  80: "ฝนซู่เบา",
  81: "ฝนซู่ปานกลาง",
  82: "ฝนซู่หนัก",
  85: "หิมะซู่เบา",
  86: "หิมะซู่หนัก",
  95: "พายุฝนฟ้าคะนอง",
  96: "พายุฝนฟ้าคะนองและลูกเห็บเล็กน้อย",
  99: "พายุฝนฟ้าคะนองและลูกเห็บหนัก",
};

function round(value: number | null, digits = 1): number | null {
  if (value === null || !Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function max(values: number[]): number | null {
  return values.length ? Math.max(...values) : null;
}

function sum(values: number[]): number | null {
  return values.length ? values.reduce((total, value) => total + value, 0) : null;
}

function conditionSeverity(code: number): number {
  if (code >= 95) return 5;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 86)) return 4;
  if (code >= 51 && code <= 57) return 3;
  if (code === 45 || code === 48) return 2;
  if (code === 3) return 1;
  return 0;
}

function pickConditionCode(codes: number[], precipProbabilities: number[]): number {
  if (codes.length === 0) return 0;
  let selected = 0;
  for (let index = 1; index < codes.length; index += 1) {
    const candidateProbability = precipProbabilities[index] ?? 0;
    const selectedProbability = precipProbabilities[selected] ?? 0;
    if (
      candidateProbability > selectedProbability ||
      (candidateProbability === selectedProbability && conditionSeverity(codes[index] ?? 0) > conditionSeverity(codes[selected] ?? 0))
    ) {
      selected = index;
    }
  }
  return codes[selected] ?? codes[0] ?? 0;
}

export function weatherCodeDescription(code: number): string {
  return weatherDescriptions[code] ?? `รหัสสภาพอากาศ ${code}`;
}

export function normalizeWeather(
  location: GeocodedLocation,
  raw: WeatherApiResponse,
  date: string,
  timeRange: TimeRange,
): WeatherSummary {
  const dailyIndex = raw.daily.time.findIndex((item) => item === date);
  if (dailyIndex < 0) {
    throw new ForecastUnavailableError(date);
  }

  const currentDate = raw.current?.time.slice(0, 10);
  const useCurrent = timeRange === "current" && currentDate === date && raw.current;

  if (useCurrent && raw.current) {
    return {
      location: { name: location.name, admin1: location.admin1, country: location.country },
      date,
      timeRange,
      condition: weatherCodeDescription(raw.current.weather_code),
      weatherCode: raw.current.weather_code,
      temperatureC: round(raw.current.temperature_2m),
      temperatureMinC: null,
      temperatureMaxC: null,
      apparentTemperatureC: round(raw.current.apparent_temperature),
      humidityPercent: round(raw.current.relative_humidity_2m, 0),
      precipitationProbabilityPercent: null,
      precipitationMm: round(raw.current.precipitation),
      windSpeedKmh: round(raw.current.wind_speed_10m),
      observedAt: raw.current.time,
    };
  }

  const hourlyIndexes = raw.hourly.time
    .map((timestamp, index) => ({ timestamp, index }))
    .filter(({ timestamp }) => timestamp.startsWith(`${date}T`))
    .filter(({ timestamp }) => {
      if (timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current") return true;
      const hour = Number(timestamp.slice(11, 13));
      return hourIsInRange(hour, timeRange);
    })
    .map(({ index }) => index);

  if (hourlyIndexes.length === 0) throw new ForecastUnavailableError(`${date}:${timeRange}`);

  const values = <T>(items: T[]) => hourlyIndexes.map((index) => items[index]).filter((item): item is T => item !== undefined);
  const temperatures = values(raw.hourly.temperature_2m);
  const apparent = values(raw.hourly.apparent_temperature);
  const humidity = values(raw.hourly.relative_humidity_2m);
  const probability = values(raw.hourly.precipitation_probability);
  const precipitation = values(raw.hourly.precipitation);
  const wind = values(raw.hourly.wind_speed_10m);
  const codes = values(raw.hourly.weather_code);

  const conditionCode = timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
    ? raw.daily.weather_code[dailyIndex]
    : pickConditionCode(codes, probability);

  return {
    location: { name: location.name, admin1: location.admin1, country: location.country },
    date,
    timeRange,
    condition: weatherCodeDescription(conditionCode),
    weatherCode: conditionCode,
    temperatureC: round(average(temperatures)),
    temperatureMinC: round(
      timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
        ? raw.daily.temperature_2m_min[dailyIndex]
        : temperatures.length
          ? Math.min(...temperatures)
          : null,
    ),
    temperatureMaxC: round(
      timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
        ? raw.daily.temperature_2m_max[dailyIndex]
        : max(temperatures),
    ),
    apparentTemperatureC: round(
      timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
        ? raw.daily.apparent_temperature_max[dailyIndex]
        : max(apparent),
    ),
    humidityPercent: round(average(humidity), 0),
    precipitationProbabilityPercent: round(
      timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
        ? raw.daily.precipitation_probability_max[dailyIndex]
        : max(probability),
      0,
    ),
    precipitationMm: round(
      timeRange === "all_day" || timeRange === "unspecified" || timeRange === "current"
        ? raw.daily.precipitation_sum[dailyIndex]
        : sum(precipitation),
    ),
    windSpeedKmh: round(average(wind)),
  };
}
