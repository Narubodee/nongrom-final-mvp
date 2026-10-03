import type { WeatherComparison } from "@/types/weather";

function isThaiMessage(message: string): boolean {
  return /[\u0E00-\u0E7F]/u.test(message);
}

export function prefersEnglishResponse(message: string): boolean {
  return !isThaiMessage(message) && /[A-Za-z]/u.test(message);
}

export function responseViolatesUserLanguage(userMessage: string, response: string): boolean {
  return prefersEnglishResponse(userMessage) && isThaiMessage(response);
}

function formatNumber(value: number | null): string {
  return value === null ? "—" : String(value);
}

function temperatureComparisonResponse(comparison: WeatherComparison, thai: boolean): string {
  const [first, second] = comparison.values;
  if (!first || !second) {
    return thai
      ? "ข้อมูลอุณหภูมิไม่เพียงพอสำหรับเปรียบเทียบค่ะ"
      : "There is not enough temperature data to compare these locations.";
  }

  const a = first.temperatureMaxC;
  const b = second.temperatureMaxC;

  if (a === null || b === null) {
    return thai
      ? `ข้อมูลอุณหภูมิของ ${first.location} และ ${second.location} ยังไม่เพียงพอสำหรับเปรียบเทียบค่ะ`
      : `There is not enough temperature data to compare ${first.location} and ${second.location}.`;
  }

  if (a === b) {
    return thai
      ? `${first.location} และ ${second.location} มีอุณหภูมิสูงสุดเท่ากันที่ ${formatNumber(a)}°C ค่ะ 🌡️`
      : `${first.location} and ${second.location} have the same maximum temperature at ${formatNumber(a)}°C. 🌡️`;
  }

  const warmer = a > b ? first : second;
  const cooler = a > b ? second : first;

  return thai
    ? `${warmer.location}ร้อนกว่าค่ะ โดยมีอุณหภูมิสูงสุด ${formatNumber(warmer.temperatureMaxC)}°C ส่วน${cooler.location}มีอุณหภูมิสูงสุด ${formatNumber(cooler.temperatureMaxC)}°C 🌡️`
    : `${warmer.location} is hotter, with a maximum temperature of ${formatNumber(warmer.temperatureMaxC)}°C versus ${formatNumber(cooler.temperatureMaxC)}°C in ${cooler.location}. 🌡️`;
}

function rainComparisonResponse(comparison: WeatherComparison, thai: boolean): string {
  const [first, second] = comparison.values;
  if (!first || !second) {
    return thai
      ? "ข้อมูลฝนไม่เพียงพอสำหรับเปรียบเทียบค่ะ"
      : "There is not enough rain data to compare these locations.";
  }

  const a = first.precipitationProbabilityPercent;
  const b = second.precipitationProbabilityPercent;

  if (a === null || b === null) {
    return thai
      ? `ข้อมูลโอกาสฝนของ ${first.location} และ ${second.location} ยังไม่เพียงพอสำหรับเปรียบเทียบค่ะ`
      : `There is not enough rain-probability data to compare ${first.location} and ${second.location}.`;
  }

  if (a === b) {
    return thai
      ? `${first.location} และ ${second.location} มีโอกาสฝนเท่ากันที่ ${formatNumber(a)}% ค่ะ 🌧️`
      : `${first.location} and ${second.location} have the same chance of rain at ${formatNumber(a)}%. 🌧️`;
  }

  const wetter = a > b ? first : second;
  const drier = a > b ? second : first;

  return thai
    ? `${wetter.location}มีโอกาสฝนสูงกว่าค่ะ โดยอยู่ที่ ${formatNumber(wetter.precipitationProbabilityPercent)}% ส่วน${drier.location}อยู่ที่ ${formatNumber(drier.precipitationProbabilityPercent)}% 🌧️`
    : `${wetter.location} has a higher chance of rain at ${formatNumber(wetter.precipitationProbabilityPercent)}%, versus ${formatNumber(drier.precipitationProbabilityPercent)}% in ${drier.location}. 🌧️`;
}

/**
 * Comparison output is hardened at application level because the comparison result
 * and canonical location names have already been resolved and verified before this point.
 * This prevents the response composer from shortening or mutating a verified entity name
 * (for example, "เชียงใหม่" -> "เชียง").
 */
export function buildVerifiedComparisonResponse(
  comparison: WeatherComparison,
  userMessage: string,
): string {
  const thai = isThaiMessage(userMessage);

  if (comparison.metric === "temperature") {
    return temperatureComparisonResponse(comparison, thai);
  }

  if (comparison.metric === "rain") {
    return rainComparisonResponse(comparison, thai);
  }

  const [first, second] = comparison.values;
  if (!first || !second) {
    return thai
      ? "ข้อมูลอากาศยังไม่เพียงพอสำหรับเปรียบเทียบค่ะ"
      : "There is not enough weather data to compare these locations.";
  }

  return thai
    ? `ข้อมูลเปรียบเทียบของ ${first.location} และ ${second.location}: อุณหภูมิสูงสุด ${formatNumber(first.temperatureMaxC)}°C เทียบกับ ${formatNumber(second.temperatureMaxC)}°C และโอกาสฝน ${formatNumber(first.precipitationProbabilityPercent)}% เทียบกับ ${formatNumber(second.precipitationProbabilityPercent)}% ค่ะ`
    : `For ${first.location} versus ${second.location}, the maximum temperatures are ${formatNumber(first.temperatureMaxC)}°C and ${formatNumber(second.temperatureMaxC)}°C, with rain chances of ${formatNumber(first.precipitationProbabilityPercent)}% and ${formatNumber(second.precipitationProbabilityPercent)}%, respectively.`;
}

/**
 * Presentation-only cleanup. It must not alter facts, entity names, decisions, or units.
 */
export function cleanupResponseFormatting(message: string): string {
  return message
    .replace(/(มม\.|มิลลิเมตร|กม\.\/ชม\.|องศาเซลเซียส|°C|%)(?=(?:ค่ะ|คะ|ครับ|นะคะ))/gu, "$1 ")
    .replace(/[ \t]+\n/gu, "\n")
    .trim();
}
