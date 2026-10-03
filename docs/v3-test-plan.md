# NongRom — Prompt V3 Real Test Plan

**Completion:** Closed. All 15 planned requests were run by the Product Owner. Exact evidence is in `v3-real-results.md`; final cross-version analysis is in `final-comparison.md`.

## Experiment rule

Prompt V3 must be tested with real application runs. Do not invent or rewrite Actual Output.

Controlled variables:
- Model remains `gemini-3.5-flash-lite`.
- Gemini generation parameters remain Default (not explicitly configured).
- Retry policy remains unchanged.
- Open-Meteo/geocoding remain unchanged.
- Context/date/time/recommendation/comparison logic remains unchanged.
- Weather normalization remains unchanged.
- Understanding prompt text remains identical to V1/V2.
- Response Composer changes from V2 to V3.
- Deterministic feminine-persona copy patch is tracked separately from the prompt experiment.

## Primary V3 regression sequence

Use the same real inputs as V2 to preserve comparability.

| Order | Input | What to verify |
|---|---|---|
| 1 | `วันนี้กรุงเทพฝนตกไหม` | Direct rain answer; no greeting; no repeated `มีโอกาส`; grounded facts |
| 2 | Same chat → `แล้วพรุ่งนี้ล่ะ` | Inherit Bangkok + tomorrow; no `อาซิลเซียส`; drizzle wording natural |
| 3 | Same chat → `แล้วช่วงเย็นล่ะ` | Inherit Bangkok + tomorrow + evening; no `ฝนปรอยหนัก` |
| 4 | Refresh → `วันนี้ตากผ้าได้ไหมที่กรุงเทพ` | Recommendation first; 1–2 strongest reasons |
| 5 | Refresh → `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ` | Recommendation preserved; no provider-identity blending |
| 6 | Refresh → `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า` | Correct winner/values; no internal `อุณหภูมิตัวแทน` wording |
| 7 | Refresh → `พรุ่งนี้ฝนตกไหม` | App-generated clarification now uses feminine persona; still does not guess location |
| 8 | Same chat → `เชียงใหม่` | Preserve tomorrow date; answer stays relevant instead of dumping all metrics |
| 9 | Refresh → `พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง` | No fabrication; deterministic error copy uses feminine persona |
| 10 | Refresh → `กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง` | No fabricated forecast; deterministic error copy uses feminine persona |
| 11 | Refresh → `Will it rain in Bangkok tomorrow?` | **Must answer in English**; no unsupported `all day` duration; natural drizzle wording |
| 12 | Refresh → `พรุ่งนี้กรุงเทพอากาศเป็นยังไง` | General forecast; no `ฝนปรอยหนัก`; correct temperature units |
| 13 | Refresh → `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง` | General Chiang Mai forecast regression |
| 14 | Same chat → `แล้วช่วงเย็นล่ะ` | Preserve Chiang Mai + date; update time only |
| 15 | Refresh → `เย็นนี้ควรพกร่มไหมที่กรุงเทพ` | Direct umbrella decision + strongest rain evidence |

## V3-specific failure watchlist

Record a problem if any real output contains:
- `ฝนปรอยหนัก`
- `ฝนปรอยค่อนข้างมาก`
- `ฝนปรอยหนักตลอดทั้งวัน`
- unsupported `ตลอดทั้งวัน` / `all day`
- `อาซิลเซียส` or another invented unit
- `น้องร่มจาก Open-Meteo`
- unnecessary greeting/self-introduction
- masculine `ครับ` in Thai application/Gemini output
- Thai response to the English T11 input
- numeric/date/location/recommendation/comparison changes relative to verified facts
- excessive metric dumping unrelated to intent

## Evidence to capture per request

Record:
1. Exact input.
2. Exact Actual Output.
3. Exact terminal line `POST /api/chat ...`.
4. Any `Gemini transient error; retrying` or `Gemini API request failed` log.
5. Functional result: Pass / Partial / Fail.
6. Response-quality result separately when needed.
7. Whether the response was Gemini-composed or deterministic application copy.

Do not create Prompt V4 until enough V3 real outputs have been collected and compared with V1/V2.
