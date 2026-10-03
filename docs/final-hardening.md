# NongRom — Final Application Hardening

Status: **CLOSED — accepted into Final MVP**

Prompt Experiment V1 → V2 → V3 is closed. This hardening phase does **not** create Prompt V4 and does not rewrite historical Actual Output evidence.

## Frozen prompt-experiment artifacts

These prompt/evidence files remain unchanged from the closed V3 experiment:

- `docs/v1-real-results.md`
- `docs/v2-real-results.md`
- `docs/v3-real-results.md`
- `lib/gemini/prompts/v1.ts`
- `lib/gemini/prompts/v2.ts`
- `lib/gemini/prompts/v3.ts`

Prompt hashes:

- V1: `51b1bf0f162e1d30f285c059cb6eaffd4e71d7d9c4e8c8fc4c41ebeb03985cc3`
- V2: `2e5d8467fcb23f2a8edb81ea0a38af2fac56774e163cacc6ee71cf3e49a140d1`
- V3: `14159f1a36663b29b1d2f7b7d6cc878e7afeb369160b82f11a9d286083bbde9d`

The separately frozen evidence ZIP remains unchanged:

- `nongrom-v3-evidence-closed.zip`
- SHA-256: `f775d6355e4ca2d0265a790eeca9099b186c90d014670a612dde0cd7b9c9a972`

## Fixes after V3

### 1. P0 comparison canonical-location protection

V3 real evidence exposed a response-generation regression where resolved `เชียงใหม่` was shortened to `เชียง` in one comparison phrase.

Final behavior:

- Open-Meteo geocoding / normalized weather summaries remain the source of verified location names.
- Comparison facts are computed deterministically by application code.
- The final comparison sentence is also built at application level from `WeatherComparison.values[].location`.
- Gemini does not get authority to rewrite canonical location names in the final comparison response.

Real Final Regression result: **3/3 comparison runs passed**, preserving `กรุงเทพมหานคร` and `เชียงใหม่` every time.

### 2. Presentation-only unit spacing cleanup

`cleanupResponseFormatting(...)` inserts missing whitespace between protected units and Thai particles, such as:

- `0.1 มม.ค่ะ` → `0.1 มม. ค่ะ`
- `35.2°Cค่ะ` → `35.2°C ค่ะ`

This cleanup does not alter measurements, entities, recommendations, dates, or weather semantics.

### 3. T11 English-language application guard

Final Regression initially exposed an English-input/Thai-output regression on T11. This was treated as application hardening, not Prompt V4, because Prompt V3 already contains a language-matching rule and had passed the same behavior in closed V3 evidence.

Final behavior:

- `prefersEnglishResponse(...)` conservatively detects English latest-message input.
- `responseViolatesUserLanguage(...)` catches Thai output for that English request.
- A mismatched composed answer is discarded and rebuilt in English from the same verified weather/recommendation facts.
- The English deterministic fallback is also used for retryable/non-model-unavailable response-generation failures.
- Prompt V3 remains byte-for-byte unchanged.

Real Final Regression result: pre-patch T11 failure is preserved in evidence, and the post-patch T11 rerun **passed**.

## Final hardening acceptance

- Core Test Set T01–T12: **12/12 Pass after targeted T11 fix**.
- Comparison canonical-name verification: **3/3 Pass**.
- Context follow-ups: **Pass**.
- Missing-location slot filling: **Pass**.
- Location-not-found and forecast-range errors: **Pass**.
- English language preservation after patch: **Pass**.
- Prompt V3: **unchanged**.
- Prompt V4: **not created**.
