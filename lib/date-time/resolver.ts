import type { DateReference, TimeRange } from "@/types/chat";

function datePartsInTimeZone(timeZone: string): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(new Date());
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function toIsoDate(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function addDays(parts: { year: number; month: number; day: number }, amount: number): string {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + amount));
  return toIsoDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function resolveDate(
  reference: DateReference,
  exactDate: string | null,
  timeZone: string,
): string {
  const today = datePartsInTimeZone(timeZone);
  if (reference === "tomorrow") return addDays(today, 1);
  if (reference === "exact" && exactDate) return exactDate;
  return addDays(today, 0);
}

export function hourIsInRange(hour: number, range: TimeRange): boolean {
  switch (range) {
    case "morning":
      return hour >= 6 && hour < 12;
    case "afternoon":
      return hour >= 12 && hour < 17;
    case "evening":
      return hour >= 17 && hour < 21;
    case "night":
      return hour >= 21 && hour <= 23;
    case "all_day":
    case "unspecified":
      return true;
    case "current":
      return false;
  }
}

export const timeRangeLabels: Record<TimeRange, string> = {
  current: "ตอนนี้",
  all_day: "ทั้งวัน",
  morning: "ช่วงเช้า",
  afternoon: "ช่วงบ่าย",
  evening: "ช่วงเย็น",
  night: "ช่วงกลางคืน",
  unspecified: "ทั้งวัน",
};
