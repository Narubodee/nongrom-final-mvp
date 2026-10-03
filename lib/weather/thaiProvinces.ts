export interface ThaiProvinceGeocodingEntry {
  thaiName: string;
  geocodingName: string;
  aliases?: readonly string[];
}

/**
 * Canonical province names used only as a geocoding fallback.
 * No weather values, coordinates, or forecast data are stored here.
 */
export const THAI_PROVINCES: readonly ThaiProvinceGeocodingEntry[] = [
  { thaiName: "กรุงเทพมหานคร", geocodingName: "Bangkok", aliases: ["กรุงเทพ", "กรุงเทพฯ"] },
  { thaiName: "กระบี่", geocodingName: "Krabi" },
  { thaiName: "กาญจนบุรี", geocodingName: "Kanchanaburi" },
  { thaiName: "กาฬสินธุ์", geocodingName: "Kalasin" },
  { thaiName: "กำแพงเพชร", geocodingName: "Kamphaeng Phet" },
  { thaiName: "ขอนแก่น", geocodingName: "Khon Kaen" },
  { thaiName: "จันทบุรี", geocodingName: "Chanthaburi" },
  { thaiName: "ฉะเชิงเทรา", geocodingName: "Chachoengsao" },
  { thaiName: "ชลบุรี", geocodingName: "Chon Buri" },
  { thaiName: "ชัยนาท", geocodingName: "Chai Nat" },
  { thaiName: "ชัยภูมิ", geocodingName: "Chaiyaphum" },
  { thaiName: "ชุมพร", geocodingName: "Chumphon" },
  { thaiName: "เชียงราย", geocodingName: "Chiang Rai" },
  { thaiName: "เชียงใหม่", geocodingName: "Chiang Mai" },
  { thaiName: "ตรัง", geocodingName: "Trang" },
  { thaiName: "ตราด", geocodingName: "Trat" },
  { thaiName: "ตาก", geocodingName: "Tak" },
  { thaiName: "นครนายก", geocodingName: "Nakhon Nayok" },
  { thaiName: "นครปฐม", geocodingName: "Nakhon Pathom" },
  { thaiName: "นครพนม", geocodingName: "Nakhon Phanom" },
  { thaiName: "นครราชสีมา", geocodingName: "Nakhon Ratchasima" },
  { thaiName: "นครศรีธรรมราช", geocodingName: "Nakhon Si Thammarat" },
  { thaiName: "นครสวรรค์", geocodingName: "Nakhon Sawan" },
  { thaiName: "นนทบุรี", geocodingName: "Nonthaburi" },
  { thaiName: "นราธิวาส", geocodingName: "Narathiwat" },
  { thaiName: "น่าน", geocodingName: "Nan" },
  { thaiName: "บึงกาฬ", geocodingName: "Bueng Kan" },
  { thaiName: "บุรีรัมย์", geocodingName: "Buriram" },
  { thaiName: "ปทุมธานี", geocodingName: "Pathum Thani" },
  { thaiName: "ประจวบคีรีขันธ์", geocodingName: "Prachuap Khiri Khan" },
  { thaiName: "ปราจีนบุรี", geocodingName: "Prachin Buri" },
  { thaiName: "ปัตตานี", geocodingName: "Pattani" },
  { thaiName: "พระนครศรีอยุธยา", geocodingName: "Phra Nakhon Si Ayutthaya", aliases: ["อยุธยา"] },
  { thaiName: "พะเยา", geocodingName: "Phayao" },
  { thaiName: "พังงา", geocodingName: "Phang Nga" },
  { thaiName: "พัทลุง", geocodingName: "Phatthalung" },
  { thaiName: "พิจิตร", geocodingName: "Phichit" },
  { thaiName: "พิษณุโลก", geocodingName: "Phitsanulok" },
  { thaiName: "เพชรบุรี", geocodingName: "Phetchaburi" },
  { thaiName: "เพชรบูรณ์", geocodingName: "Phetchabun" },
  { thaiName: "แพร่", geocodingName: "Phrae" },
  { thaiName: "ภูเก็ต", geocodingName: "Phuket" },
  { thaiName: "มหาสารคาม", geocodingName: "Maha Sarakham" },
  { thaiName: "มุกดาหาร", geocodingName: "Mukdahan" },
  { thaiName: "แม่ฮ่องสอน", geocodingName: "Mae Hong Son" },
  { thaiName: "ยโสธร", geocodingName: "Yasothon" },
  { thaiName: "ยะลา", geocodingName: "Yala" },
  { thaiName: "ร้อยเอ็ด", geocodingName: "Roi Et" },
  { thaiName: "ระนอง", geocodingName: "Ranong" },
  { thaiName: "ระยอง", geocodingName: "Rayong" },
  { thaiName: "ราชบุรี", geocodingName: "Ratchaburi" },
  { thaiName: "ลพบุรี", geocodingName: "Lop Buri" },
  { thaiName: "ลำปาง", geocodingName: "Lampang" },
  { thaiName: "ลำพูน", geocodingName: "Lamphun" },
  { thaiName: "เลย", geocodingName: "Loei" },
  { thaiName: "ศรีสะเกษ", geocodingName: "Sisaket" },
  { thaiName: "สกลนคร", geocodingName: "Sakon Nakhon" },
  { thaiName: "สงขลา", geocodingName: "Songkhla" },
  { thaiName: "สตูล", geocodingName: "Satun" },
  { thaiName: "สมุทรปราการ", geocodingName: "Samut Prakan" },
  { thaiName: "สมุทรสงคราม", geocodingName: "Samut Songkhram" },
  { thaiName: "สมุทรสาคร", geocodingName: "Samut Sakhon" },
  { thaiName: "สระแก้ว", geocodingName: "Sa Kaeo" },
  { thaiName: "สระบุรี", geocodingName: "Saraburi" },
  { thaiName: "สิงห์บุรี", geocodingName: "Sing Buri" },
  { thaiName: "สุโขทัย", geocodingName: "Sukhothai" },
  { thaiName: "สุพรรณบุรี", geocodingName: "Suphan Buri" },
  { thaiName: "สุราษฎร์ธานี", geocodingName: "Surat Thani" },
  { thaiName: "สุรินทร์", geocodingName: "Surin" },
  { thaiName: "หนองคาย", geocodingName: "Nong Khai" },
  { thaiName: "หนองบัวลำภู", geocodingName: "Nong Bua Lamphu" },
  { thaiName: "อ่างทอง", geocodingName: "Ang Thong" },
  { thaiName: "อำนาจเจริญ", geocodingName: "Amnat Charoen" },
  { thaiName: "อุดรธานี", geocodingName: "Udon Thani" },
  { thaiName: "อุตรดิตถ์", geocodingName: "Uttaradit" },
  { thaiName: "อุทัยธานี", geocodingName: "Uthai Thani" },
  { thaiName: "อุบลราชธานี", geocodingName: "Ubon Ratchathani" },
] as const;

function normalizeProvinceKey(value: string): string {
  return value
    .trim()
    .replace(/^จังหวัด\s*/u, "")
    .replace(/^จ\.?\s*/u, "")
    .replace(/\s+/gu, " ")
    .replace(/[.。]+$/u, "");
}

const provinceLookup = new Map<string, ThaiProvinceGeocodingEntry>();

for (const province of THAI_PROVINCES) {
  provinceLookup.set(normalizeProvinceKey(province.thaiName), province);
  for (const alias of province.aliases ?? []) {
    provinceLookup.set(normalizeProvinceKey(alias), province);
  }
}

export function resolveThaiProvince(value: string): ThaiProvinceGeocodingEntry | undefined {
  return provinceLookup.get(normalizeProvinceKey(value));
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^$()|[\]\\]/g, "\\$&");
}

const locationRecoveryCandidates = THAI_PROVINCES
  .flatMap((province) => [province.thaiName, ...(province.aliases ?? [])].map((name) => ({ name, province })))
  .sort((a, b) => b.name.length - a.name.length);

const recoveryTimeSignal =
  "(?:วันนี้|พรุ่งนี้|มะรืน(?:นี้)?|ตอนนี้|เช้านี้|ช่วงเช้า|บ่ายนี้|ช่วงบ่าย|เย็นนี้|ช่วงเย็น|คืนนี้|ช่วงกลางคืน)";
const recoveryWeatherSignal =
  "(?:ฝน|อากาศ|อุณหภูมิ|ร้อน|หนาว|พายุ|ลม|ชื้น|แดด|ฟ้า|พกร่ม|วิ่ง|เป็นยังไง|เป็นอย่างไร|เป็นไง)";

function isExplicitProvinceMention(message: string, provinceName: string): boolean {
  const name = escapeRegExp(provinceName);
  const exactProvince = new RegExp(`^(?:จังหวัด\\s*|จ\\.?\\s*)?${name}$`, "u");
  const explicitLocation = new RegExp(
    `(?:จังหวัด|จ\\.?|ที่|ใน|แถว|บริเวณ)\\s*${name}(?=$|[\\s,]|${recoveryTimeSignal}|${recoveryWeatherSignal})`,
    "u",
  );
  const timeThenProvince = new RegExp(
    `(?:^|[\\s,])${recoveryTimeSignal}\\s*(?:ที่|ใน)?\\s*${name}\\s*(?=${recoveryWeatherSignal}|$)`,
    "u",
  );
  const provinceThenWeather = new RegExp(
    `^${name}\\s*(?=${recoveryTimeSignal}|${recoveryWeatherSignal}|$)`,
    "u",
  );

  return exactProvince.test(message) || explicitLocation.test(message) || timeThenProvince.test(message) || provinceThenWeather.test(message);
}

/**
 * Recovers explicit Thai province mentions only when the upstream understanding
 * step failed to extract any location. Callers must enforce that guard.
 *
 * The patterns intentionally require clear location context so ordinary Thai
 * words that are also province names (for example "ตาก" or "เลย") are not
 * inferred from unrelated phrases such as "วันนี้ตากผ้าได้ไหม" or "ได้เลย".
 */
export function recoverThaiProvinceLocations(message: string): string[] {
  const normalizedMessage = message.trim().replace(/\s+/gu, " ");
  if (!normalizedMessage) return [];

  const recovered: string[] = [];
  for (const candidate of locationRecoveryCandidates) {
    if (!isExplicitProvinceMention(normalizedMessage, candidate.name)) continue;
    if (!recovered.includes(candidate.province.thaiName)) {
      recovered.push(candidate.province.thaiName);
    }
    if (recovered.length === 2) break;
  }

  return recovered;
}
