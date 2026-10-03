# NongRom — Final MVP Release Summary

## Release status

**Final MVP accepted after real Final Regression.**

- Core Test Set: T01–T12 = 12/12 Pass after the targeted T11 application fix.
- P0 comparison canonical-name protection = 3/3 Pass.
- Prompt Experiment remains V1 → V2 → V3; Final Prompt = V3.
- No Prompt V4 was created.

## Final tech stack

- Next.js 16.3.8 — App Router
- React 19.3.0
- TypeScript 5.9.3 project dependency
- Tailwind CSS 4.3.3
- `@google/genai` 2.24.0
- Zod 4.6.5
- Open-Meteo Geocoding + Forecast APIs
- npm / Node.js 20.9+ target
- No database in MVP

## AI configuration

- Gemini model: `gemini-3.5-flash-lite`
- Prompt: V3
- Generation/sampling configuration: Default (not explicitly configured)
- Structured Understanding uses JSON MIME/schema validation.
- No automatic model fallback.

## Application hardening after V3

1. Deterministic comparison response from verified canonical location names.
2. Presentation-only spacing cleanup around protected units.
3. English latest-message language guard with verified-facts deterministic English fallback when composed output violates language preservation.

Prompt V3 itself is unchanged.

## Known limitations

- Conversation context is session/in-memory state only; no persistent account history or database.
- Forecast availability is limited to the dates exposed by Open-Meteo; unavailable dates return an application error instead of fabricated weather.
- External availability/rate limits of Gemini and Open-Meteo can affect responses.
- Ambiguous or unknown place names may require a more specific city/province/country.
- The English guard is intentionally conservative and is not a general multilingual language-identification system; mixed-language prompts can still rely on Prompt V3 behavior.
- Forecast values can legitimately change as Open-Meteo updates its forecasts.
- Out-of-scope future features are not included: login/register, favorites, persistent history, admin, voice, maps, notifications, and database-backed profiles.

## Evidence

See:

- `docs/final-regression-results.md`
- `docs/final-hardening.md`
- `docs/architecture.md`
- frozen V1/V2/V3 evidence files in `docs/`

## Post-release local production build validation

On **2026-10-03**, the user validated the final release on the real local machine:

- `npm install`: **PASS** — 88 packages added, 89 audited, 0 vulnerabilities; one `node-domexception@1.0.0 deprecated` warning and no installation error.
- `npm run build`: **PASS** — Next.js 16.3.8 (Turbopack) compiled successfully, TypeScript completed successfully, page-data collection succeeded, static page generation completed 4/4, and page optimization finalized successfully.
- Built routes: `/` Static, `/api/chat` Dynamic, `/_not-found` Static.

The earlier assistant-environment install/build limitation is retained in `docs/final-validation.md` as historical evidence and is not rewritten. The successful local Production Build Validation is appended as subsequent evidence.

## Final Post-Deployment Release — 2026-10-03

The Final MVP was deployed to Vercel Production and subsequently validated as a public demo.

- Production deployment: **PASS**
- Canonical public demo URL: `https://nongrom-final-mvp.vercel.app`
- Production Smoke Test: **5/5 Pass**
- Production error-level log check (30-minute window): **PASS — no logs found**
- Vercel public-access configuration: **Standard Protection**
- Incognito/InPrivate page access without Vercel login: **PASS**
- Incognito/InPrivate production chat request: **PASS**
- **Public Demo Access = PASS ✅**
- `docs/deployment-evidence.md`: **CLOSED**

This post-deployment release changes evidence/documentation only. Prompt V3 and Final MVP application runtime behavior remain unchanged. `GEMINI_API_KEY` remains a server-side Vercel Production secret and is not included in the release package.
