# NongRom — Current Experiment Baseline Evidence

Updated: 2026-10-03

## Versions intentionally pinned

| Component | Version / Choice |
|---|---|
| Next.js | 16.3.8 |
| React | 19.3.0 |
| React DOM | 19.3.0 |
| TypeScript | 5.9.3 |
| Tailwind CSS | 4.3.3 |
| @google/genai | 2.24.0 |
| Zod | 4.6.5 |
| Gemini model | `gemini-3.5-flash-lite` |
| Weather / Geocoding | Open-Meteo |
| Current prompt | V3 |

## Model history

The original V1 runtime used `gemini-3.8-flash`. Real tests produced recurring `503 UNAVAILABLE` / high-demand errors, including after restart and with bounded retry logic. The Product Owner explicitly approved switching the runtime model to `gemini-3.5-flash-lite` while keeping Prompt V1 unchanged.

Real tests on `gemini-3.5-flash-lite` then completed the tested V1 and V2 flows without observed 503 errors in those sequences. This is evidence for the observed tests only; it is not a guarantee that transient service errors can never occur.

## Gemini configuration evidence

No thinking level, temperature, top-p, top-k, or max-output-token value is explicitly configured. Evidence label: **Default (not explicitly configured)**.

Understanding call additionally sets:
- `responseMimeType = application/json`
- `responseSchema = understandingResponseSchema`

## Prompt experiment baseline

- V1 retained unchanged: `lib/gemini/prompts/v1.ts`
- V1 SHA-256: `51b1bf0f162e1d30f285c059cb6eaffd4e71d7d9c4e8c8fc4c41ebeb03985cc3`
- V2 retained unchanged: `lib/gemini/prompts/v2.ts`
- V2 SHA-256: `2e5d8467fcb23f2a8edb81ea0a38af2fac56774e163cacc6ee71cf3e49a140d1`
- V3 added: `lib/gemini/prompts/v3.ts`
- V3 SHA-256: `14159f1a36663b29b1d2f7b7d6cc878e7afeb369160b82f11a9d286083bbde9d`
- V3 Understanding text is intentionally identical to V2/V1.
- V3 changes Response Composer instructions based only on real V2 findings.
- V1 real outputs: `docs/v1-real-results.md`
- V2 real outputs: `docs/v2-real-results.md`
- V3 real output status at ZIP creation: **Not Tested Yet**

## V2 evidence motivating V3

Repeated real V2 findings:
- `ฝนปรอยหนัก` / `ฝนปรอยค่อนข้างมาก`
- malformed unit wording `อาซิลเซียส` in one generation
- unsupported duration wording `ตลอดทั้งวัน`
- English question understood but answered in Thai
- occasional over-inclusion of weather metrics

Application-copy finding kept separate from prompt evidence:
- deterministic messages still used hard-coded `ครับ`

## Secrets

- `.env.example` contains an empty `GEMINI_API_KEY=` placeholder.
- `.env.local` is not part of the distribution.
- `.gitignore` excludes environment secrets.
- `node_modules` and `.next` are not included.

## Controlled variables from V2 to V3

Unchanged:
- Gemini model
- Dependency versions
- Retry/error-handling policy
- Structured output schema
- Open-Meteo API usage
- Geocoding
- Conversation-context merge logic
- Date/time resolver
- Weather normalization
- Recommendation rules
- Comparison rules
- No automatic model fallback

Prompt experiment change:
- Active Response Composer from V2 to V3
- Prompt metadata from `V2` to `V3`
- V3 adds controlled terminology/unit/language/duration/relevance constraints

Separate application change:
- deterministic user-facing Thai persona copy normalized from `ครับ` to `ค่ะ/นะคะ`

## Historical infrastructure note

The bounded Gemini retry wrapper remains an infrastructure reliability measure, not a prompt change:
- retry 408, 429, 5xx
- up to 3 total attempts
- 1500 ms base delay with exponential backoff
- 0–300 ms jitter
- no automatic model fallback
