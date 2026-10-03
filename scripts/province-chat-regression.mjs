const baseUrl = (process.env.NONGROM_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const delayMs = Number(process.env.NONGROM_TEST_DELAY_MS ?? "3000");
const quotaCooldownMs = Number(process.env.NONGROM_QUOTA_COOLDOWN_MS ?? "15000");

const allProvinces = [
  "กรุงเทพมหานคร", "กระบี่", "กาญจนบุรี", "กาฬสินธุ์", "กำแพงเพชร", "ขอนแก่น", "จันทบุรี", "ฉะเชิงเทรา",
  "ชลบุรี", "ชัยนาท", "ชัยภูมิ", "ชุมพร", "เชียงราย", "เชียงใหม่", "ตรัง", "ตราด", "ตาก", "นครนายก",
  "นครปฐม", "นครพนม", "นครราชสีมา", "นครศรีธรรมราช", "นครสวรรค์", "นนทบุรี", "นราธิวาส", "น่าน", "บึงกาฬ",
  "บุรีรัมย์", "ปทุมธานี", "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา", "พังงา",
  "พัทลุง", "พิจิตร", "พิษณุโลก", "เพชรบุรี", "เพชรบูรณ์", "แพร่", "ภูเก็ต", "มหาสารคาม", "มุกดาหาร",
  "แม่ฮ่องสอน", "ยโสธร", "ยะลา", "ร้อยเอ็ด", "ระนอง", "ระยอง", "ราชบุรี", "ลพบุรี", "ลำปาง", "ลำพูน", "เลย",
  "ศรีสะเกษ", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ", "สมุทรสงคราม", "สมุทรสาคร", "สระแก้ว", "สระบุรี",
  "สิงห์บุรี", "สุโขทัย", "สุพรรณบุรี", "สุราษฎร์ธานี", "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง",
  "อำนาจเจริญ", "อุดรธานี", "อุตรดิตถ์", "อุทัยธานี", "อุบลราชธานี",
];

const previouslyFailed = new Set([
  "ฉะเชิงเทรา", "ตราด", "นนทบุรี", "พะเยา", "เพชรบุรี", "สระบุรี", "หนองคาย", "อุบลราชธานี",
]);

// Unresolved cases from the first 77-province run on 2026-10-04:
// 24 were blocked by GEMINI_QUOTA and "เลย" was a false-positive HTTP 200
// because the response asked for a location instead of answering weather.
// This is regression-test metadata only; it is not used by application code.
const retryAfterFirst77Run = new Set([
  "ตาก", "นครนายก", "นครปฐม", "นครพนม", "นครราชสีมา",
  "ประจวบคีรีขันธ์", "ปราจีนบุรี", "ปัตตานี", "พระนครศรีอยุธยา", "พะเยา",
  "มหาสารคาม", "มุกดาหาร", "แม่ฮ่องสอน", "ยโสธร", "ยะลา",
  "เลย", "สกลนคร", "สงขลา", "สตูล", "สมุทรปราการ",
  "สุรินทร์", "หนองคาย", "หนองบัวลำภู", "อ่างทอง", "อำนาจเจริญ",
]);

if (allProvinces.length !== 77 || new Set(allProvinces).size !== 77) {
  throw new Error(`Province test list must contain 77 unique provinces; got ${allProvinces.length}`);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseCustomCases() {
  const raw = process.env.NONGROM_TEST_PROVINCES?.trim();
  if (!raw) return null;

  const requested = raw.split(",").map((value) => value.trim()).filter(Boolean);
  const unknown = requested.filter((name) => !allProvinces.includes(name));
  if (unknown.length > 0) {
    throw new Error(`Unknown province(s) in NONGROM_TEST_PROVINCES: ${unknown.join(", ")}`);
  }
  return [...new Set(requested)];
}

const mode = process.argv[2] ?? "all";
const customCases = parseCustomCases();
let cases;
if (customCases) {
  cases = customCases;
} else if (mode === "failed") {
  cases = allProvinces.filter((name) => previouslyFailed.has(name));
} else if (mode === "retry") {
  cases = allProvinces.filter((name) => retryAfterFirst77Run.has(name));
} else if (mode === "all") {
  cases = allProvinces;
} else {
  throw new Error(`Unknown mode "${mode}". Use all, failed, retry, or NONGROM_TEST_PROVINCES.`);
}

const missingLocationPhrases = [
  "อยากเช็กสภาพอากาศที่ไหน",
  "บอกชื่อเมืองหรือจังหวัด",
  "ระบุชื่อเมืองหรือจังหวัด",
  "กรุณาระบุสถานที่",
  "ค้นหาสถานที่",
];

const weatherSignals = [
  "ฝน", "อุณหภูมิ", "°c", "องศา", "มม.", "มิลลิเมตร", "อากาศ", "พายุ", "เมฆ", "แดด", "ลม",
];

function mentionsProvinceAsLocation(message, province) {
  const text = message.toLowerCase();

  if (province === "กรุงเทพมหานคร") {
    return text.includes("กรุงเทพมหานคร") || text.includes("กรุงเทพฯ") || text.includes("กรุงเทพ");
  }

  // "เลย" is also a common Thai particle (e.g. "ได้เลย"), so a raw substring
  // check would reproduce the false-positive from the first 77-province run.
  if (province === "เลย") {
    return [
      "ที่เลย", "จังหวัดเลย", "สำหรับเลย", "เลยวันนี้", "เลยในวันนี้", "เลย:", "เลย (",
    ].some((pattern) => text.includes(pattern));
  }

  return text.includes(province.toLowerCase());
}

function classifyResponse(response, body, province) {
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const errorCode = typeof body?.errorCode === "string" ? body.errorCode : "";

  if (response.status === 429 || errorCode === "GEMINI_QUOTA") {
    return { kind: "BLOCKED", reason: "GEMINI_QUOTA", message, errorCode };
  }

  if (response.status !== 200 || errorCode) {
    return {
      kind: "FAIL",
      reason: `HTTP_OR_APP_ERROR${errorCode ? `:${errorCode}` : ""}`,
      message,
      errorCode,
    };
  }

  if (!message) {
    return { kind: "FAIL", reason: "EMPTY_MESSAGE", message, errorCode };
  }

  const lowered = message.toLowerCase();
  if (missingLocationPhrases.some((phrase) => lowered.includes(phrase.toLowerCase()))) {
    return { kind: "FAIL", reason: "MISSING_LOCATION_RESPONSE", message, errorCode };
  }

  if (!mentionsProvinceAsLocation(message, province)) {
    return { kind: "FAIL", reason: "PROVINCE_NOT_REFERENCED", message, errorCode };
  }

  if (!weatherSignals.some((signal) => lowered.includes(signal))) {
    return { kind: "FAIL", reason: "NO_WEATHER_SIGNAL", message, errorCode };
  }

  return { kind: "PASS", reason: "", message, errorCode };
}

let passed = 0;
let failed = 0;
let blocked = 0;

console.log(`CONFIG province-chat mode=${mode} cases=${cases.length} delayMs=${delayMs} quotaCooldownMs=${quotaCooldownMs}`);

for (const province of cases) {
  const message = `วันนี้${province}ฝนตกไหม`;
  let hitQuota = false;

  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ message }),
    });

    let body;
    try {
      body = await response.json();
    } catch {
      body = { message: "", errorCode: "INVALID_JSON_RESPONSE" };
    }

    const result = classifyResponse(response, body, province);
    if (result.kind === "PASS") passed += 1;
    else if (result.kind === "BLOCKED") {
      blocked += 1;
      hitQuota = true;
    } else failed += 1;

    console.log([
      result.kind,
      province,
      `status=${response.status}`,
      `errorCode=${result.errorCode}`,
      `reason=${result.reason}`,
      result.message,
    ].join(" | "));
  } catch (error) {
    blocked += 1;
    console.log(`BLOCKED | ${province} | requestError=${error instanceof Error ? error.message : String(error)} | reason=REQUEST_ERROR`);
  }

  if (hitQuota && quotaCooldownMs > 0) {
    console.log(`COOLDOWN | GEMINI_QUOTA | ${quotaCooldownMs}ms`);
    await sleep(quotaCooldownMs);
  }
  if (delayMs > 0) await sleep(delayMs);
}

console.log(`SUMMARY province-chat ${mode}: ${passed}/${cases.length} PASS, ${failed} FAIL, ${blocked} BLOCKED`);

// Exit 0 only when every requested case has an actual functional PASS.
// Exit 1 means at least one functional failure. Exit 2 means no functional
// failure was observed, but at least one case was blocked/inconclusive.
process.exitCode = failed > 0 ? 1 : blocked > 0 ? 2 : 0;
