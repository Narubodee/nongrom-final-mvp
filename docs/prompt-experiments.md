# Prompt Experiments — NongRom

## Shared runtime configuration

**Current model:** `gemini-3.5-flash-lite`

**SDK:** `@google/genai` 2.24.0

Generation parameters deliberately **not explicitly configured**:
- Thinking level: **Default (not explicitly configured)**
- Temperature: **Default (not explicitly configured)**
- Top P: **Default (not explicitly configured)**
- Top K: **Default (not explicitly configured)**
- Max output tokens: **Default (not explicitly configured)**

Retry policy remains:
- Maximum 3 attempts total per Gemini call
- Base delay 1500 ms
- Exponential backoff
- 0–300 ms jitter
- Retry 408, 429, and 5xx
- No automatic model fallback

## V1

**Status:** Closed after real testing.

Executable historical prompt: `lib/gemini/prompts/v1.ts`

V1 SHA-256:
`51b1bf0f162e1d30f285c059cb6eaffd4e71d7d9c4e8c8fc4c41ebeb03985cc3`

Historical runtime model started as `gemini-3.8-flash`. Repeated real 503/high-demand failures motivated an explicitly approved model-only switch to `gemini-3.5-flash-lite`; Prompt V1 remained unchanged.

Real 3.5 Flash-Lite test results are stored verbatim in `docs/v1-real-results.md`.

V1 findings that motivated V2:
- repeated greeting/self-introduction,
- Thai persona inconsistency,
- `น้องร่มจาก Open-Meteo` identity blending,
- awkward user-facing wording,
- unnecessary metrics,
- inconsistent date presentation.

## V2

**Status:** Closed after real testing.

Executable historical prompt: `lib/gemini/prompts/v2.ts`

V2 SHA-256:
`2e5d8467fcb23f2a8edb81ea0a38af2fac56774e163cacc6ee71cf3e49a140d1`

The V2 Understanding prompt is text-identical to V1. V2 changed only Response Composer instructions.

Real V2 outputs are preserved in `docs/v2-real-results.md`.

### V2 observed improvements

- Ordinary weather answers stopped repeatedly greeting/self-introducing.
- Gemini-composed Thai answers consistently used feminine polite particles in the tested cases.
- `น้องร่มจาก Open-Meteo` did not recur.
- Comparison wording became natural and concise.
- Recommendation answers became more direct and relevant.
- Context/date/time inheritance remained functional.

### V2 observed remaining issues

1. Drizzle terminology was systematic rather than isolated: `ฝนปรอยหนัก` and `ฝนปรอยค่อนข้างมาก` recurred.
2. One generation produced malformed temperature-unit wording: `อาซิลเซียส`.
3. A daily summary was expanded into `ตลอดทั้งวัน`, which can imply unsupported continuous duration.
4. `Will it rain in Bangkok tomorrow?` was understood correctly but answered in Thai rather than English.
5. Some rain answers still included more fields than necessary.
6. Deterministic application/UI copy still used hard-coded `ครับ`; this is not a Prompt V2 issue.

## V3

**Status:** Closed after real Product Owner testing.

Current executable prompt: `lib/gemini/prompts/v3.ts`

V3 SHA-256:
`14159f1a36663b29b1d2f7b7d6cc878e7afeb369160b82f11a9d286083bbde9d`

### Controlled prompt change

The V3 Understanding prompt remains text-identical to V2/V1. No understanding/context behavior is intentionally changed.

The V3 Response Composer adds targeted constraints based only on real V2 evidence:
- Explicitly match the language of the user's latest message; English input must receive English output unless the user requests otherwise.
- Treat daily/all-day weather as a summary, not evidence that a condition continues `ตลอดทั้งวัน`.
- Add controlled user-facing weather terminology keyed by supplied weather code.
- For drizzle codes 51/53/55, prefer neutral `มีฝนละออง` rather than awkward `ฝนปรอยหนัก`/`ฝนปรอยค่อนข้างมาก`.
- Protect user-facing units: `°C`/`องศาเซลเซียส`, `มม.`/`มิลลิเมตร`, `กม./ชม.`, `%`.
- Strengthen intent-relevance rules so the model does not dump available metrics unnecessarily.
- Preserve V2 persona, concise answer shape, grounding, recommendation, and comparison rules.

### Separate application persona patch

V3 also contains a **non-prompt application copy patch**. It changes deterministic UI/API/fallback Thai particles from masculine `ครับ` to feminine `ค่ะ/นะคะ`, including:
- initial chat greeting,
- missing-location clarification,
- ambiguous/unknown-location messages,
- forecast-unavailable message,
- request/service/internal error copy,
- deterministic fallback copy.

This patch is recorded separately so application-copy improvements are not falsely attributed to Prompt V3.

### Variables intentionally unchanged from V2

- Model: `gemini-3.5-flash-lite`
- Gemini generation parameters: default/not explicitly configured
- SDK/dependency versions
- Retry policy
- Structured understanding schema
- Open-Meteo integration
- Geocoding
- Conversation-context merge logic
- Date/time resolver
- Weather normalization labels/data
- Recommendation rules
- Comparison rules
- No automatic model fallback

### V3 Actual Output

Real V3 outputs are preserved verbatim in `docs/v3-real-results.md`.

Observed V3 closure:
- 15/15 planned requests: Functional Pass
- 14/15: Response Quality Pass
- 1/15: Response Quality Partial due to one entity-name truncation (`เชียงใหม่` → `เชียง`) in a comparison phrase
- English T11 answered in English
- Targeted `ฝนปรอยหนัก` / `อาซิลเซียส` / unsupported `ตลอดทั้งวัน` issues did not recur in the targeted V3 cases
- Deterministic feminine persona copy passed tested clarification/error paths; this is attributed to the separate Application Persona Patch

Final cross-version analysis: `docs/final-comparison.md`.

Prompt V3 is now closed. The recommended next stage is application-level Final MVP hardening rather than a broad Prompt V4.
