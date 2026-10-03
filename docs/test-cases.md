# NongRom — Core Test Cases

Actual Output must come from a real run. Nothing in the V3 column is pre-filled as a fabricated output.

| ID | Core Test Input | V1 | V2 | V3 |
|---|---|---|---|---|
| T01 | `วันนี้กรุงเทพฝนตกไหม` | Pass, wording findings | Pass | Not Tested Yet |
| T02 | `พรุ่งนี้กรุงเทพอากาศเป็นยังไง` | Exact standalone not tested | Functional Pass / Language Partial (`ฝนปรอยหนัก`) | Not Tested Yet |
| T03 | `เย็นนี้ควรพกร่มไหม` / tested with `ที่กรุงเทพ` | Exact core wording not tested | Pass with Bangkok specified | Not Tested Yet |
| T04 | `วันนี้ตากผ้าได้ไหม` / tested with `ที่กรุงเทพ` | Pass | Pass | Not Tested Yet |
| T05 | `เย็นนี้เหมาะกับการวิ่งไหม` / tested with `ที่กรุงเทพ` | Pass, provider-persona issue | Pass | Not Tested Yet |
| T06 | `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า` | Pass, awkward comparison wording | Pass | Not Tested Yet |
| T07 | `วันนี้กรุงเทพฝนตกไหม` → `แล้วพรุ่งนี้ล่ะ` | Pass | Pass context; V2 response quality partial | Not Tested Yet |
| T08 | `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง` → `แล้วช่วงเย็นล่ะ` | Equivalent Bangkok context test passed | Pass | Not Tested Yet |
| T09 | Unknown location | Pass | Pass | Not Tested Yet |
| T10 | Date outside forecast range | Pass | Pass | Not Tested Yet |
| T11 | `Will it rain in Bangkok tomorrow?` | Not tested | Functional Pass; response language/wording partial | Not Tested Yet |
| T12 | `พรุ่งนี้ฝนตกไหม` fresh chat | Pass | Pass | Not Tested Yet |

Additional real V2 recovery:
- `พรุ่งนี้ฝนตกไหม` → application asks for location → `เชียงใหม่` → **Pass**, tomorrow date inherited.

Exact V1 outputs: `docs/v1-real-results.md`.

Exact V2 outputs: `docs/v2-real-results.md`.

V3 regression order and failure watchlist: `docs/v3-test-plan.md`.

## Experiment rule

Reuse the same core tests across V1, V2, and V3 so comparisons remain meaningful. Do not create Prompt V4 until enough real V3 outputs have been collected and analyzed.
