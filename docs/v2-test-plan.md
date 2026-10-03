# NongRom — Prompt V2 Real Test Plan

## Experiment rule

Prompt V2 must be tested with real application runs. Do not invent Actual Output.

Controlled variables:
- Model remains `gemini-3.5-flash-lite`.
- Gemini generation parameters remain default/not explicitly configured.
- Retry policy remains unchanged.
- Open-Meteo and geocoding remain unchanged.
- Context/date/time/recommendation/comparison application logic remains unchanged.
- Understanding prompt text remains identical to V1.
- Only the Response Composer prompt changes behaviorally.

## Primary V2 regression sequence

Use the same real test inputs used for V1 where possible.

| Order | Input | What to verify in V2 |
|---|---|---|
| 1 | `วันนี้กรุงเทพฝนตกไหม` | Direct rain answer; no unnecessary self-introduction; feminine Thai persona; no fabricated facts |
| 2 | `แล้วพรุ่งนี้ล่ะ` | Inherit Bangkok; tomorrow; concise follow-up; natural apparent-temperature wording if used |
| 3 | `แล้วช่วงเย็นล่ะ` | Inherit Bangkok + tomorrow; change only time to evening; avoid repeated greeting |
| 4 | Refresh → `วันนี้ตากผ้าได้ไหมที่กรุงเทพ` | Recommendation first; 1–2 strongest reasons; concise |
| 5 | Refresh → `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ` | Never say `น้องร่มจาก Open-Meteo`; recommendation remains application decision |
| 6 | Refresh → `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า` | Winner first; natural high-temperature wording; avoid `อุณหภูมิตัวแทน` |
| 7 | Refresh → `พรุ่งนี้ฝนตกไหม` | Missing-location behavior should remain functionally correct; note this response is app-generated |
| 8 | Same chat → `เชียงใหม่` | Restore pending location while preserving tomorrow date; Gemini response style follows V2 |
| 9 | Refresh → `พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง` | No fabricated location/weather; app-generated error remains correct |
| 10 | Refresh → `กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง` | No fabricated forecast; app-generated unavailable response remains correct |

## Additional core cases still not yet tested in V1

These remain useful after the V2 regression sequence:
- `พรุ่งนี้กรุงเทพอากาศเป็นยังไง`
- `เย็นนี้ควรพกร่มไหม` (fresh chat should request location)
- `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง` → `แล้วช่วงเย็นล่ะ`
- `Will it rain in Bangkok tomorrow?`

## Evidence to capture per request

Record:
1. Exact user input.
2. Exact Actual Output.
3. Terminal line `POST /api/chat ...`.
4. Any `Gemini transient error; retrying` or `Gemini API request failed` log.
5. Pass / Partial / Fail.
6. Wording/persona issues even when functional behavior passes.

Do not create Prompt V3 until V2 has real outputs and those outputs have been analyzed.
