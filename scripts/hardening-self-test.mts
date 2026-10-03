import assert from "node:assert/strict";
import { buildVerifiedComparisonResponse, cleanupResponseFormatting, prefersEnglishResponse, responseViolatesUserLanguage } from "../lib/response/hardening.ts";
import { buildFallbackResponse } from "../lib/response/fallback.ts";

const temperatureComparison = {
  metric: "temperature" as const,
  summary: "กรุงเทพมหานคร มีอุณหภูมิตัวแทนสูงกว่า เชียงใหม่ (33.9°C เทียบกับ 30.6°C)",
  values: [
    {
      location: "กรุงเทพมหานคร",
      temperatureMaxC: 33.9,
      precipitationProbabilityPercent: 85,
      precipitationMm: 2.3,
    },
    {
      location: "เชียงใหม่",
      temperatureMaxC: 30.6,
      precipitationProbabilityPercent: 69,
      precipitationMm: 5.2,
    },
  ],
};

for (let round = 1; round <= 3; round += 1) {
  const output = buildVerifiedComparisonResponse(
    temperatureComparison,
    "กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า",
  );
  assert.match(output, /กรุงเทพมหานคร/u, `round ${round}: Bangkok name missing`);
  assert.match(output, /เชียงใหม่/u, `round ${round}: Chiang Mai name missing`);
  assert.doesNotMatch(output, /ร้อนกว่าเชียงค่ะ/u, `round ${round}: truncated Chiang Mai regression`);
  assert.match(output, /33\.9°C/u, `round ${round}: Bangkok temperature missing`);
  assert.match(output, /30\.6°C/u, `round ${round}: Chiang Mai temperature missing`);
}

assert.equal(
  cleanupResponseFormatting("ปริมาณฝนประมาณ 0.1 มม.ค่ะ"),
  "ปริมาณฝนประมาณ 0.1 มม. ค่ะ",
);
assert.equal(
  cleanupResponseFormatting("อุณหภูมิ 35.2°Cค่ะ และโอกาสฝน 78%ค่ะ"),
  "อุณหภูมิ 35.2°C ค่ะ และโอกาสฝน 78% ค่ะ",
);
assert.equal(
  cleanupResponseFormatting("ข้อความเดิมไม่มีจุดที่ต้องแก้"),
  "ข้อความเดิมไม่มีจุดที่ต้องแก้",
);

assert.equal(prefersEnglishResponse("Will it rain in Bangkok tomorrow?"), true);
assert.equal(prefersEnglishResponse("พรุ่งนี้กรุงเทพฝนตกไหม"), false);
assert.equal(
  responseViolatesUserLanguage(
    "Will it rain in Bangkok tomorrow?",
    "ใช่ค่ะ พรุ่งนี้ที่กรุงเทพมหานครมีโอกาสฝน 90% ค่ะ",
  ),
  true,
);
assert.equal(
  responseViolatesUserLanguage(
    "Will it rain in Bangkok tomorrow?",
    "Yes, there is a 90% chance of rain in Bangkok tomorrow.",
  ),
  false,
);

const englishRainFallback = buildFallbackResponse(
  {
    intent: "rain",
    weather: [
      {
        location: { name: "Bangkok", country: "Thailand" },
        date: "2026-10-04",
        timeRange: "unspecified",
        condition: "ฝนซู่ปานกลาง",
        weatherCode: 81,
        temperatureC: 28.7,
        temperatureMinC: 25.9,
        temperatureMaxC: 33.4,
        apparentTemperatureC: 40.6,
        humidityPercent: 77,
        precipitationProbabilityPercent: 90,
        precipitationMm: 3,
        windSpeedKmh: 8.2,
      },
    ],
  },
  "en",
);
assert.doesNotMatch(englishRainFallback, /[\u0E00-\u0E7F]/u, "English fallback must not contain Thai text");
assert.match(englishRainFallback, /Bangkok/u);
assert.match(englishRainFallback, /90%/u);
assert.match(englishRainFallback, /3 mm/u);
assert.match(englishRainFallback, /4 Oct 2026/u);

console.log("Hardening self-test: PASS");
console.log(buildVerifiedComparisonResponse(temperatureComparison, "กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า"));
console.log(cleanupResponseFormatting("ควรพกร่มค่ะ 🌂 ปริมาณฝนประมาณ 0.1 มม.ค่ะ"));
