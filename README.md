# NongRom (น้องร่ม) — Final MVP

AI Weather Chatbot Web Application สำหรับถามสภาพอากาศด้วยภาษาธรรมชาติ รองรับภาษาไทยเป็นหลักและคำถามภาษาอังกฤษ โดยแยกแหล่งข้อมูลอากาศจริงออกจาก AI response generation อย่างชัดเจน

## Final release status

Final Regression ผ่าน **T01–T12 = 12/12** หลัง targeted T11 application fix และ P0 comparison canonical-name protection ผ่าน **3/3 real runs**.

Prompt Experiment ปิดที่ **Prompt V3** และไม่มี Prompt V4.

## Stack

- Next.js **16.3.8** App Router
- React **19.3.0**
- TypeScript
- Tailwind CSS **4.3.3**
- `@google/genai` **2.24.0**
- Zod **4.6.5**
- Open-Meteo Forecast + Geocoding
- Gemini model: **`gemini-3.5-flash-lite`**
- Gemini sampling/generation config: **Default (not explicitly configured)**
- No database in MVP

## Architecture

```text
Browser Chat UI
  → /api/chat
  → Gemini Prompt V3 Understanding
  → Context Resolver
  → Open-Meteo Geocoding
  → Date/Time Resolver
  → Open-Meteo Forecast
  → Normalization
  → Deterministic Recommendation / Comparison
  → Response layer
       • comparison: deterministic verified canonical-name response
       • other intents: Gemini Prompt V3 Response Composer
  → English language guard / verified-facts fallback if needed
  → formatting cleanup
  → UI
```

Gemini does not supply weather measurements. Weather/geocoding facts come from Open-Meteo, and application logic computes recommendations/comparisons before final response composition.

## Requirements

- Node.js **20.9+**
- npm
- Gemini API Key that can access `gemini-3.5-flash-lite`

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and set:

```env
GEMINI_API_KEY=YOUR_KEY_HERE
```

3. Start development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Validation commands

```bash
npm run typecheck
npm run build
```

## Security

- Gemini API key is read server-side only.
- No `NEXT_PUBLIC_` Gemini key is used.
- `.env.local` is ignored by Git.
- Release ZIP intentionally excludes `.env.local`, `node_modules`, and `.next`.

## Final hardening after V3

- P0 comparison names are generated from verified/resolved canonical locations at application level.
- Unit-spacing cleanup is presentation-only.
- An English-output guard prevents the observed English-input/Thai-output regression and falls back to the same verified weather facts.
- Prompt V3 remains unchanged.

## Evidence and documentation

- `docs/final-release-summary.md`
- `docs/final-validation.md`
- `docs/final-regression-results.md`
- `docs/final-hardening.md`
- `docs/architecture.md`
- `docs/v1-real-results.md`
- `docs/v2-real-results.md`
- `docs/v3-real-results.md`
- `docs/final-comparison.md`
