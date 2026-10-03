# NongRom — V1 vs V2 vs V3 Final Prompt Experiment Comparison

## Scope

This comparison summarizes only behavior observed in real Product Owner runs. It does not invent missing Actual Output and does not claim universal model reliability.

Shared final runtime for the controlled V1/V2/V3 comparison:
- Model: `gemini-3.5-flash-lite`
- Generation parameters: Default (not explicitly configured)
- Open-Meteo and geocoding: unchanged
- Retry policy: unchanged
- Context/date-time/recommendation/comparison logic: unchanged across V2→V3

Historical note: V1 initially ran on `gemini-3.8-flash`; repeated 503/high-demand failures led to an explicitly approved model-only switch to `gemini-3.5-flash-lite` while keeping Prompt V1 unchanged.

## High-level comparison

| Dimension | V1 | V2 | V3 |
|---|---|---|---|
| Core weather grounding | Functional in tested 3.5 sequence | Retained | Retained |
| Context follow-up | Passed tested Bangkok chain | Retained | Retained for Bangkok and Chiang Mai chains |
| Repeated greeting/self-intro | Present repeatedly | Removed in tested cases | Remained removed |
| Persona consistency | Mixed `ครับ/ค่ะ` | Gemini responses improved; deterministic app copy still masculine | Gemini responses consistent; deterministic app copy patched separately to feminine |
| Provider identity blending | `น้องร่มจาก Open-Meteo` appeared | Removed | Remained removed |
| Drizzle wording | Awkward forms appeared | `ฝนปรอยหนัก` / `ฝนปรอยค่อนข้างมาก` remained systematic | Targeted cases used `ฝนละออง` / `drizzle` |
| Unit wording | Mostly usable | One `อาซิลเซียส` generation | No malformed unit observed in V3 sequence |
| Unsupported duration wording | Could be verbose/awkward | `ตลอดทั้งวัน` appeared in daily rain answer | Did not recur in targeted cases |
| English query language | Not part of closed V1 evidence set | English query answered in Thai | English query answered in English |
| Recommendation relevance | Functional but verbose/identity issues | More direct | Retained; concise in tested laundry/running/umbrella cases |
| Comparison quality | Correct but verbose | Natural and concise | Numeric logic correct; one entity-name truncation regression |
| Error/clarification persona | Masculine deterministic copy | Masculine deterministic copy | Feminine deterministic copy via separate application patch |
| Observed 503/high-demand issue on final 3.5 sequence | Not observed after model switch | Not observed | Not observed |

## Representative evolution

### Bangkok tomorrow terminology and units

V2 produced wording including:
- `ฝนปรอยค่อนข้างมาก`
- `อาซิลเซียส`

V3 real follow-up produced:

> สำหรับกรุงเทพมหานครในวันที่ 4 ต.ค. 2026 มีฝนละออง โดยมีอุณหภูมิต่ำสุด 26 องศาเซลเซียส และสูงสุด 33.9 องศาเซลเซียส (อุณหภูมิที่รู้สึกได้สูงสุดถึง 40.6 องศาเซลเซียส) พร้อมโอกาสฝน 85% และปริมาณฝน 2.3 มม. ค่ะ 🌧️

Observed result: terminology and unit protection improved without breaking context inheritance.

### English language preservation

V2 input `Will it rain in Bangkok tomorrow?` was understood but answered in Thai and included `ฝนปรอยหนักตลอดทั้งวัน`.

V3 produced:

> Yes, there is an 85% chance of drizzle in Bangkok tomorrow (4 Oct 2026), with expected precipitation of 2.3 mm. 🌧️

Observed result: language matching and unsupported-duration protection both improved.

### Persona

V1/V2 deterministic missing-location copy used masculine `ครับ`.

V3 application persona patch produced:

> อยากเช็กสภาพอากาศที่ไหนคะ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️

This is intentionally attributed to an **application code patch**, not to Prompt V3.

### New V3 regression

V3 comparison output contained:

> พรุ่งนี้กรุงเทพมหานครร้อนกว่าเชียงค่ะ ... ส่วนเชียงใหม่อุณหภูมิสูงสุด 30.6°C ค่ะ ☀️

The comparison numbers were correct, but one phrase truncated `เชียงใหม่` to `เชียง`. This did not occur in the V2 comparison output and is therefore preserved as a real V3 response-quality regression.

## V3 scorecard from the planned real sequence

- Planned real requests completed: **15**
- Functional Pass: **15/15**
- Response Quality Pass: **14/15**
- Response Quality Partial: **1/15**
- Response Quality Fail: **0/15**
- Reported 503/retry events in this V3 sequence: **0**

These counts describe only the captured test sequence.

## Decision after V3

**Do not create a broad Prompt V4 merely to fix the single entity-name regression.** V3 already meets the prompt-level objectives demonstrated by the evidence.

For Final MVP hardening, exact location/entity names should be protected using **application-level validation/fallback**, because location names are trusted structured data and correctness should not depend solely on free-text generation.

Recommended guard:
1. Keep Prompt V3 unchanged as the closed prompt experiment.
2. After Gemini composes a comparison answer, validate that both canonical comparison location names are represented correctly.
3. If validation fails, use a deterministic comparison response assembled from trusted comparison facts instead of trying another creative rewrite.
4. Keep the existing Gemini retry policy for transient API errors separate from this semantic validation.

Why application-level protection is preferred here:
- It guarantees critical entity correctness more reliably than another wording instruction.
- It does not destabilize the V3 prompt behavior that already passed the terminology/language/context tests.
- It keeps the experiment history clean: V1 → V2 → V3 remains immutable and evidence-based.

## Final MVP hardening backlog

Priority order:

1. **P0 — Comparison entity-name guard:** validate canonical names; deterministic fallback on mismatch.
2. **P1 — Output formatting cleanup:** normalize spacing around units/polite particles, e.g. `มม.ค่ะ` → `มม. ค่ะ`, without altering numerical facts.
3. **P1 — Final regression suite:** rerun T01–T12 plus the multi-turn context chains after the hardening patch.
4. **P2 — Response relevance tuning only if new real evidence requires it.** Do not create Prompt V4 pre-emptively.
5. **P2 — Performance observation:** collect more repeated runs before deciding whether latency optimization is necessary.

## Experiment closure

- Prompt V1: **Closed**
- Prompt V2: **Closed**
- Prompt V3: **Closed**
- Recommended next engineering stage: **Final MVP application hardening**, not Prompt V4 at this time.
