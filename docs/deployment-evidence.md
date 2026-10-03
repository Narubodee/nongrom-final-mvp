# NongRom — Deployment Evidence

## Status

**CLOSED — Production deployment, Production Smoke Test, runtime error check, and public demo access were validated with real user-observed evidence on 2026-10-03.**

This evidence log was opened after Final MVP acceptance and the successful local Production Build Validation. All deployment and production results below were appended from actual user-observed outputs; no outcome was pre-filled.

## Pre-deployment validation

On **2026-10-03**, the user reported:

- `npm install`: PASS — 88 packages added, 89 audited, 0 vulnerabilities; `node-domexception@1.0.0 deprecated` warning only.
- `npm run build`: PASS — Next.js 16.3.8 (Turbopack), successful compile, successful TypeScript, successful page-data collection, static generation 4/4, successful page optimization.
- Routes: `/` Static, `/api/chat` Dynamic, `/_not-found` Static.

## Vercel project setup

Real CLI evidence reported by the user:

```text
vercel whoami
Vercel CLI 62.2.0 (Node.js 22.18.0)
> Logged in as s6604022620408-8216
> Active team: s6604022620408-8216 (s6604022620408-8216's projects)
> Active team plan: Hobby
```

```text
vercel --version
Vercel CLI 62.2.0
62.2.0
```

`vercel link` detected Next.js with the default Next.js build/output settings, created project `s6604022620408-8216/nongrom-final-mvp`, and linked the local directory successfully.

The user's `git check-ignore .vercel/project.json` command returned:

```text
fatal: not a git repository (or any of the parent directories): .git
```

This was a local Git-repository state only and did not block Vercel project linking or deployment.

## Production environment secret

The user added the Gemini API key directly through the Vercel CLI without exposing the value in chat:

```text
vercel env add GEMINI_API_KEY production --sensitive
✓ Added           GEMINI_API_KEY
  Project         s6604022620408-8216/nongrom-final-mvp
  Environments    Production
  Type            Secret
```

Verification:

```text
vercel env ls production
 name               value     type      environments        created
 GEMINI_API_KEY     Hidden    Secret    Production          2m ago
```

Security constraints remained unchanged:

- `GEMINI_API_KEY` remains server-side in Vercel Environment Variables.
- The key value was not included in source, evidence, screenshots, or this release ZIP.
- `.env.local` is excluded from the release package and is not required for the deployed public demo.
- Prompt V3 was not changed.

## Production deployment

Command:

```text
vercel --prod
```

Actual result reported by the user:

```text
Vercel CLI 62.2.0 (Node.js 22.18.0)
  Inspect         https://vercel.com/s6604022620408-8216/nongrom-final-mvp/4PLn2fbp6qoB2g1ESDGcbxCBtWEt
  Production      https://nongrom-final-9z5bidwwz-s6604022620408-8216.vercel.app
▲ Aliased         https://nongrom-final-mvp.vercel.app

✓ Ready in 34s

! Deployment Protection is on for this project (Vercel Authentication). Use `vercel curl` to access it.
```

Deployment result: **PASS ✅**

Canonical production demo URL:

`https://nongrom-final-mvp.vercel.app`

## Initial protected-access verification

Before public-access configuration was changed, the user ran:

```text
vercel curl / --deployment https://nongrom-final-mvp.vercel.app
```

Vercel reported:

```text
> You require a deployment protection bypass token to access this deployment... Generating one now...
> Successfully generated deployment protection bypass token for project prj_6ANDnOvq8dUIYMYnKN9ivgJAwrnz
```

The request then returned the real NongRom HTML, including:

```text
<title>NongRom — AI Weather Chatbot</title>
<meta name="description" content="น้องร่ม AI Weather Chatbot สำหรับถามสภาพอากาศด้วยภาษาธรรมชาติ"/>
```

This confirmed the deployed app itself was healthy while Vercel Authentication was still protecting public browser access.

## Production Smoke Test

All smoke tests below were executed against the deployed Production application using real user-observed outputs.

### S01 — Production page load

**PASS ✅**

The production root returned NongRom HTML through authenticated `vercel curl` and showed the expected page title/description.

### S02 — Thai weather + conversational context

Input 1:

```text
วันนี้กรุงเทพฝนตกไหม
```

Actual output:

```text
สำหรับกรุงเทพมหานครในวันนี้ (3 ต.ค. 2026) มีฝนละอองค่ะ โดยมีโอกาสเกิดฝน 79% และปริมาณฝน 2.7 มม. ค่ะ 🌧️
```

Follow-up without refresh:

```text
แล้วพรุ่งนี้ล่ะ
```

Actual output:

```text
สำหรับพรุ่งนี้ (4 ต.ค. 2026) ที่กรุงเทพมหานคร มีฝนเป็นช่วง ๆ โดยมีอุณหภูมิต่ำสุด 26.4 องศาเซลเซียส และสูงสุด 33.5 องศาเซลเซียส (อุณหภูมิที่รู้สึกได้สูงสุดถึง 40.2 องศาเซลเซียส) พร้อมโอกาสฝน 88% ค่ะ 🌧️
```

Result: **PASS ✅** — Bangkok context was preserved across the follow-up and the date advanced correctly.

### S03 — Missing location + slot filling

Input 1:

```text
พรุ่งนี้ฝนตกไหม
```

Actual output:

```text
อยากเช็กสภาพอากาศที่ไหนคะ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️
```

Follow-up:

```text
เชียงใหม่
```

Actual output:

```text
สำหรับเชียงใหม่ในวันที่ 4 ต.ค. 2026 มีพายุฝนฟ้าคะนองค่ะ โดยมีโอกาสเกิดฝน 86% และปริมาณฝน 12.4 มิลลิเมตร อุณหภูมิอยู่ระหว่าง 24 ถึง 30.7 °C ⛈️
```

Result: **PASS ✅** — the application requested the missing location instead of inventing one, then reused the pending intent/date with Chiang Mai.

### S04 — English language preservation

Input:

```text
Will it rain in Bangkok tomorrow?
```

Actual output:

```text
Yes, there is a chance of rain in Bangkok tomorrow, October 4, 2026. The forecast indicates light rain showers with an 88% chance of rain and an expected precipitation of 2.7 mm. 🌧️
```

Result: **PASS ✅** — response remained fully in English and used the resolved Bangkok/tomorrow weather facts.

### S05 — Comparison + canonical location name

Input:

```text
กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า
```

Actual output:

```text
กรุงเทพมหานครร้อนกว่าค่ะ โดยมีอุณหภูมิสูงสุด 33.5°C ส่วนเชียงใหม่มีอุณหภูมิสูงสุด 30.7°C 🌡️
```

Result: **PASS ✅** — canonical `เชียงใหม่` was preserved; the historical `เชียงใหม่ → เชียง` regression did not recur.

### Production Smoke Test conclusion

**5/5 Pass ✅**

Forecast values in this production run differ from earlier Final Regression evidence because live forecast data can change; this is expected and is not treated as a regression.

## Production runtime error check

After the Smoke Test, the user ran:

```text
vercel logs --environment production --level error --since 30m
```

Actual output:

```text
Vercel CLI 62.2.0 (Node.js 22.18.0)
No logs found for s6604022620408-8216/nongrom-final-mvp
```

Result: **PASS ✅** — no error-level production logs were returned for the checked 30-minute window.

## Public demo access configuration and validation

The original production deployment was protected by Vercel Authentication. The user changed the Vercel Deployment Protection configuration to **Standard Protection** so the canonical Production domain could be accessed publicly while keeping the project on the Vercel Hobby plan.

No application source, Prompt V3, Gemini configuration, environment-variable value, or runtime behavior was changed for this access configuration.

### Public browser access test

The user opened:

`https://nongrom-final-mvp.vercel.app`

in an Incognito/InPrivate browser session that was not logged in to Vercel and confirmed that the NongRom page opened directly without Vercel sign-in.

Browser access result: **PASS ✅**

### Public chat test from Incognito/InPrivate

Input:

```text
วันนี้กรุงเทพฝนตกไหม
```

Actual output:

```text
วันนี้กรุงเทพมหานครมีฝนละอองค่ะ โดยมีโอกาสเกิดฝน 79% และปริมาณฝน 2.7 มม. ค่ะ
```

Result: **PASS ✅**

This validates that a public user without a Vercel account can open the deployed website and use the production `/api/chat` path with server-side Gemini and weather services.

## Final deployment acceptance

- Production Deploy: **PASS ✅**
- Production URL: `https://nongrom-final-mvp.vercel.app`
- Production Smoke Test: **5/5 Pass ✅**
- Production runtime error check: **PASS ✅**
- Public browser access without Vercel login: **PASS ✅**
- Public chat from Incognito/InPrivate: **PASS ✅**
- **Public Demo Access = PASS ✅**

## Closure

**Deployment Evidence = CLOSED ✅ — 2026-10-03**

Closure occurred only after the user confirmed both public page access and a successful real chat request from an Incognito/InPrivate browser session without Vercel authentication.
