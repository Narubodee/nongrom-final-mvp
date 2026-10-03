# NongRom — Final Package Validation

## Real application acceptance

The user's real local application runs are the release acceptance source for runtime behavior.

- Core Test Set T01–T12: **12/12 Pass after targeted T11 fix**.
- P0 comparison canonical-location protection: **3/3 Pass**.
- T11 pre-patch language failure is preserved; post-patch rerun passed.
- T12 missing-location + slot filling passed.

See `docs/final-regression-results.md` for exact Actual Output and terminal lines.

## Package integrity checks

- Prompt V1/V2/V3 files are byte-for-byte identical to the frozen V3 evidence package.
- V1 prompt SHA-256: `51b1bf0f162e1d30f285c059cb6eaffd4e71d7d9c4e8c8fc4c41ebeb03985cc3`
- V2 prompt SHA-256: `2e5d8467fcb23f2a8edb81ea0a38af2fac56774e163cacc6ee71cf3e49a140d1`
- V3 prompt SHA-256: `14159f1a36663b29b1d2f7b7d6cc878e7afeb369160b82f11a9d286083bbde9d`
- Frozen V3 evidence ZIP SHA-256: `f775d6355e4ca2d0265a790eeca9099b186c90d014670a612dde0cd7b9c9a972`
- V1/V2/V3 real-result evidence files are byte-for-byte identical to the frozen V3 evidence package.
- Release excludes `.env.local`, `node_modules`, and `.next`.
- Source syntax transpilation check: **PASS** for 25 `.ts` / `.tsx` / `.mts` source files (declaration file excluded).
- Focused hardening helper self-test: **PASS** for 3-round canonical comparison names, unit spacing, English request detection, English/Thai mismatch detection, and verified-facts English fallback.

## Environment limitation

`npm install` in the assistant build environment timed out before dependencies were installed. Therefore a fresh full `npm run typecheck` and `npm run build` could not be completed in this environment. The attempted typecheck failed only because required installed modules/types (`next`, `react`, `zod`, `@google/genai`, etc.) were unavailable after the install timeout.

This environment limitation is recorded rather than hidden. The release runtime behavior was separately exercised through the user's real local application during Final Regression.

## Local Production Build Validation — added after package release

The earlier assistant-environment limitation above is intentionally preserved as historical evidence and has not been rewritten or removed.

On **2026-10-03**, the user performed a fresh Production Build Validation on the real local machine using the released `nongrom-final-mvp` source and reported the following results:

### `npm install`

- **PASS**
- added 88 packages
- audited 89 packages
- found 0 vulnerabilities
- warning: `node-domexception@1.0.0 deprecated`
- no installation error

### `npm run build`

- **PASS**
- Next.js 16.3.8 (Turbopack)
- Compiled successfully
- TypeScript completed successfully
- Collecting page data completed successfully
- Static page generation 4/4 completed successfully
- Finalizing page optimization completed successfully

### Built routes reported by the user

- `/` — Static
- `/api/chat` — Dynamic
- `/_not-found` — Static

### Validation conclusion

**Local Production Build Validation = PASS ✅**

This real-machine validation compensates for the assistant build environment's inability to complete a fresh dependency installation and full production build. The historical assistant-environment limitation remains part of the evidence trail; this section is appended rather than replacing it.

## Production Deployment and Public Demo Validation — 2026-10-03

After the local Production Build Validation, the user deployed the accepted Final MVP to Vercel Production and supplied real production evidence.

- Production deployment returned `Ready` and aliased the application to `https://nongrom-final-mvp.vercel.app`.
- Production Smoke Test: **5/5 Pass** covering page load, conversational context, missing-location slot filling, English language preservation, and canonical comparison location names.
- Error-level production log query for the smoke-test window returned `No logs found`.
- Initial Vercel Authentication protection was confirmed by `vercel curl`, which required a deployment-protection bypass token.
- The user changed Deployment Protection to **Standard Protection** without changing the application code or Prompt V3.
- An Incognito/InPrivate browser session not logged in to Vercel opened the canonical Production URL directly.
- The same public Incognito/InPrivate session successfully sent `วันนี้กรุงเทพฝนตกไหม` and received a real NongRom weather response.

### Validation conclusion

**Public Demo Access = PASS ✅**

**Deployment Evidence = CLOSED ✅**

See `docs/deployment-evidence.md` for the exact user-observed deployment, smoke-test, runtime-log, and public-access evidence.
