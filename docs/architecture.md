# NongRom — Final MVP Architecture

## Runtime flow

```text
Browser Chat UI
   ↓ POST /api/chat
Next.js 16 App Router — Route Handler
   ↓
Gemini `gemini-3.5-flash-lite` — Prompt V3 Understanding
   ↓ structured JSON (Zod-validated)
Conversation Context Resolver
   ↓
Open-Meteo Geocoding
   ↓
Date / Time Resolver (location timezone)
   ↓
Open-Meteo Forecast API
   ↓
Weather Normalizer
   ↓
Deterministic Recommendation / Comparison Rules
   ↓ verified facts only
Response layer
   ├─ Comparison → deterministic application response using verified canonical location names
   └─ Other intents → Gemini Prompt V3 Response Composer
                         ↓
                 English-language guard / deterministic verified-facts fallback if needed
   ↓
Presentation-only formatting cleanup
   ↓
Browser Chat UI
```

## Trust boundary

Gemini is **not** the source of weather measurements or coordinates. Open-Meteo supplies geocoding and forecast data. Recommendation and comparison decisions are computed by application code before response composition.

The Response Composer receives verified facts; it must not invent weather values. Comparison output is application-generated to protect canonical resolved entity names. For conservative English-only latest messages, an application guard prevents a Thai-composed answer from being returned and falls back to an English deterministic response based on the same verified facts.

## Gemini behavior

- Model: `gemini-3.5-flash-lite`
- Prompt: V3
- Sampling/generation parameters such as temperature/top-p: **Default (not explicitly configured)**
- Understanding call additionally uses structured JSON response MIME/schema controls.
- Normal non-comparison weather requests use two Gemini calls: Understanding + Response Composer.
- Comparison requests use Gemini Understanding, then deterministic application-level comparison response composition.
- Retry: transient HTTP 408 / 429 / 5xx only, maximum 3 attempts, exponential delay with jitter; **no model fallback**.

## Conversation state

The browser carries a compact context for the current page session:

- locations
- dateReference / exactDate
- timeRange
- lastIntent
- comparisonMetric

There is no database and no persistent chat history in the MVP. Refreshing/restarting the session can clear conversational context.

## Application time windows

- morning: 06:00–11:59 local time
- afternoon: 12:00–16:59 local time
- evening: 17:00–20:59 local time
- night: 21:00–23:59 local time
- all_day: all hourly samples for the selected local calendar date

Relative dates are resolved using the geocoded location timezone.
