import type { ComparisonMetric } from "@/types/chat";
import type { WeatherComparison, WeatherRecommendation, WeatherSummary } from "@/types/weather";

function isRainyCode(code: number): boolean {
  return (code >= 51 && code <= 67) || (code >= 80 && code <= 82) || code >= 95;
}

function isThunderstorm(code: number): boolean {
  return code >= 95;
}

export function makeRecommendation(
  kind: "umbrella" | "laundry" | "running",
  weather: WeatherSummary,
): WeatherRecommendation {
  const rainProbability = weather.precipitationProbabilityPercent ?? 0;
  const rainMm = weather.precipitationMm ?? 0;
  const apparent = weather.apparentTemperatureC ?? weather.temperatureMaxC ?? weather.temperatureC ?? 0;
  const humidity = weather.humidityPercent ?? 0;
  const wind = weather.windSpeedKmh ?? 0;
  const rainy = isRainyCode(weather.weatherCode) || rainMm >= 0.5;

  if (kind === "umbrella") {
    if (rainProbability >= 50 || rainy) {
      return {
        kind,
        decision: "recommended",
        reasons: [
          `โอกาสฝนสูงสุด ${rainProbability}%`,
          `ปริมาณฝนประมาณ ${rainMm} มม. ในช่วงที่เลือก`,
        ],
      };
    }
    if (rainProbability >= 30) {
      return {
        kind,
        decision: "consider",
        reasons: [`โอกาสฝนสูงสุด ${rainProbability}% ยังมีความไม่แน่นอน`],
      };
    }
    return {
      kind,
      decision: "not_needed",
      reasons: [`โอกาสฝนสูงสุด ${rainProbability}% และไม่พบสัญญาณฝนเด่นจากข้อมูลที่เลือก`],
    };
  }

  if (kind === "laundry") {
    if (rainProbability >= 50 || rainy) {
      return {
        kind,
        decision: "not_recommended",
        reasons: [`โอกาสฝนสูงสุด ${rainProbability}%`, `ปริมาณฝนประมาณ ${rainMm} มม.`],
      };
    }
    if (rainProbability >= 30 || humidity >= 80) {
      return {
        kind,
        decision: "consider",
        reasons: [`โอกาสฝนสูงสุด ${rainProbability}%`, `ความชื้นเฉลี่ยประมาณ ${humidity}%`],
      };
    }
    return {
      kind,
      decision: "suitable",
      reasons: [`โอกาสฝนสูงสุด ${rainProbability}%`, `ความชื้นเฉลี่ยประมาณ ${humidity}%`],
    };
  }

  if (isThunderstorm(weather.weatherCode) || rainProbability >= 60 || apparent >= 38 || wind >= 45) {
    return {
      kind,
      decision: "not_recommended",
      reasons: [
        `โอกาสฝนสูงสุด ${rainProbability}%`,
        `อุณหภูมิที่รู้สึกได้สูงสุด/ตัวแทนประมาณ ${apparent}°C`,
        `ลมเฉลี่ยประมาณ ${wind} กม./ชม.`,
      ],
    };
  }

  if (rainProbability >= 30 || apparent >= 32 || wind >= 25) {
    return {
      kind,
      decision: "consider",
      reasons: [
        `โอกาสฝนสูงสุด ${rainProbability}%`,
        `อุณหภูมิที่รู้สึกได้สูงสุด/ตัวแทนประมาณ ${apparent}°C`,
        `ลมเฉลี่ยประมาณ ${wind} กม./ชม.`,
      ],
    };
  }

  return {
    kind,
    decision: "suitable",
    reasons: [
      `โอกาสฝนสูงสุด ${rainProbability}%`,
      `อุณหภูมิที่รู้สึกได้สูงสุด/ตัวแทนประมาณ ${apparent}°C`,
      `ลมเฉลี่ยประมาณ ${wind} กม./ชม.`,
    ],
  };
}

function representativeTemperature(weather: WeatherSummary): number | null {
  return weather.temperatureMaxC ?? weather.temperatureC;
}

export function compareWeather(
  weather: WeatherSummary[],
  metric: ComparisonMetric,
): WeatherComparison {
  const [first, second] = weather;
  const normalizedMetric = metric === "none" ? "general" : metric;
  const firstName = first.location.name;
  const secondName = second.location.name;

  let summary: string;
  if (normalizedMetric === "temperature") {
    const a = representativeTemperature(first);
    const b = representativeTemperature(second);
    if (a === null || b === null) {
      summary = "ข้อมูลอุณหภูมิไม่เพียงพอสำหรับเปรียบเทียบ";
    } else if (a === b) {
      summary = `${firstName} และ ${secondName} มีอุณหภูมิตัวแทนเท่ากันที่ ${a}°C`;
    } else {
      summary = a > b
        ? `${firstName} มีอุณหภูมิตัวแทนสูงกว่า ${secondName} (${a}°C เทียบกับ ${b}°C)`
        : `${secondName} มีอุณหภูมิตัวแทนสูงกว่า ${firstName} (${b}°C เทียบกับ ${a}°C)`;
    }
  } else if (normalizedMetric === "rain") {
    const a = first.precipitationProbabilityPercent ?? 0;
    const b = second.precipitationProbabilityPercent ?? 0;
    if (a === b) {
      summary = `${firstName} และ ${secondName} มีโอกาสฝนสูงสุดเท่ากันที่ ${a}%`;
    } else {
      summary = a > b
        ? `${firstName} มีโอกาสฝนสูงสุดมากกว่า ${secondName} (${a}% เทียบกับ ${b}%)`
        : `${secondName} มีโอกาสฝนสูงสุดมากกว่า ${firstName} (${b}% เทียบกับ ${a}%)`;
    }
  } else {
    summary = `เปรียบเทียบข้อมูลอากาศของ ${firstName} และ ${secondName} ในวันและช่วงเวลาเดียวกัน`;
  }

  return {
    metric: normalizedMetric,
    summary,
    values: weather.map((item) => ({
      location: item.location.name,
      temperatureMaxC: item.temperatureMaxC ?? item.temperatureC,
      precipitationProbabilityPercent: item.precipitationProbabilityPercent,
      precipitationMm: item.precipitationMm,
    })),
  };
}
