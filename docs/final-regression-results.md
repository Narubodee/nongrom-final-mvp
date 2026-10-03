# NongRom — Final Regression Results

Status: **CLOSED — FINAL MVP GATE PASSED**

This evidence is separate from the frozen Prompt V1 → V2 → V3 experiment evidence. Every Actual Output below was supplied from the user's real local run. Historical prompt-experiment Actual Outputs are not edited.

## Final acceptance result

- Core Test Set: **T01–T12 = 12/12 Pass** after the targeted T11 application fix.
- P0 comparison canonical-location protection: **3/3 real runs Pass**.
- Prompt version: **V3 unchanged**; no Prompt V4 was created.
- Gemini model: **`gemini-3.5-flash-lite`**.
- Gemini generation configuration: **Default (not explicitly configured)** beyond required system instruction / structured-output schema controls.
- T11 has one preserved pre-patch failed run, followed by a successful targeted-patch rerun. The failed evidence remains visible below and was not rewritten.

## Rules used for this regression

- V1/V2/V3 prompt evidence remains frozen.
- Refresh before standalone cases unless the case explicitly tests conversational context.
- Weather values are evaluated against the verified values returned in that run; changing forecasts between runs are not themselves regressions.
- Actual Output is recorded only from the user's real application run.
- T06 comparison must preserve canonical resolved location names in at least 3 separate real runs.
- A failed case is fixed only at the affected layer and rerun before release acceptance.

## Real regression results

| ID | Input / Sequence | Actual Output | Terminal | Result | Notes |
|---|---|---|---|---|---|
| T01 | `วันนี้กรุงเทพฝนตกไหม` | `วันนี้ที่กรุงเทพมหานครมีโอกาสเกิดพายุฝนฟ้าคะนองค่ะ โดยมีโอกาสฝน 86% และปริมาณฝน 6 มม. ⛈️` | `POST /api/chat 200 in 6.5s (next.js: 1868ms, application-code: 4.7s)` | Pass | Functional / quality / formatting / persona pass |
| T02 | `พรุ่งนี้กรุงเทพอากาศเป็นยังไง` | `สภาพอากาศที่กรุงเทพมหานครในวันที่ 4 ต.ค. 2026 มีฝนเป็นช่วง ๆ โดยมีอุณหภูมิต่ำสุด 25.9 องศาเซลเซียส และสูงสุด 33.4 องศาเซลเซียส (อุณหภูมิที่รู้สึกได้สูงสุดถึง 40.6 องศาเซลเซียส) พร้อมโอกาสเกิดฝน 90% และปริมาณฝน 3 มิลลิเมตร ค่ะ 🌧️` | `POST /api/chat 200 in 4.8s (next.js: 6ms, application-code: 4.8s)` | Pass | Minor stylistic spacing only; no semantic issue |
| T03 | `เย็นนี้ควรพกร่มไหมที่กรุงเทพ` | `ช่วงเย็นนี้ที่กรุงเทพฯ แนะนำให้พกร่มค่ะ เนื่องจากมีโอกาสฝนละออง 68% และมีปริมาณฝนประมาณ 1.4 มม. ☂️` | `POST /api/chat 200 in 4.1s (next.js: 3ms, application-code: 4.1s)` | Pass | Recommendation preserved |
| T04 | `วันนี้ตากผ้าได้ไหมที่กรุงเทพ` | `วันนี้ยังไม่แนะนำให้ตากผ้าที่กรุงเทพมหานครนะคะ เนื่องจากมีพายุฝนฟ้าคะนอง โดยมีโอกาสฝนสูงถึง 86% และมีปริมาณฝนประมาณ 6 มม. ค่ะ 🌧️` | `POST /api/chat 200 in 4.6s (next.js: 3ms, application-code: 4.6s)` | Pass | Laundry recommendation preserved |
| T05 | `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ` | `ช่วงเย็นนี้ที่กรุงเทพฯ ไม่เหมาะกับการวิ่งนะคะ เนื่องจากมีฝนละออง โอกาสฝนอยู่ที่ 68% และอุณหภูมิที่รู้สึกได้สูงถึง 34.4°C ค่ะ 🏃‍♀️` | `POST /api/chat 200 in 4.0s (next.js: 3ms, application-code: 4.0s)` | Pass | Running recommendation preserved |
| T06-R1 | `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า` | `กรุงเทพมหานครร้อนกว่าค่ะ โดยมีอุณหภูมิสูงสุด 33.4°C ส่วนเชียงใหม่มีอุณหภูมิสูงสุด 31°C 🌡️` | `POST /api/chat 200 in 3.3s (next.js: 3ms, application-code: 3.3s)` | Pass | Canonical names preserved |
| T06-R2 | Same comparison after Refresh | `กรุงเทพมหานครร้อนกว่าค่ะ โดยมีอุณหภูมิสูงสุด 33.4°C ส่วนเชียงใหม่มีอุณหภูมิสูงสุด 31°C 🌡️` | `POST /api/chat 200 in 3.2s (next.js: 3ms, application-code: 3.2s)` | Pass | Canonical names preserved |
| T06-R3 | Same comparison after Refresh | `กรุงเทพมหานครร้อนกว่าค่ะ โดยมีอุณหภูมิสูงสุด 33.4°C ส่วนเชียงใหม่มีอุณหภูมิสูงสุด 31°C 🌡️` | `POST /api/chat 200 in 3.0s (next.js: 3ms, application-code: 3.0s)` | Pass | P0 acceptance criterion 3/3 passed |
| T07-1 | `วันนี้กรุงเทพฝนตกไหม` | `วันนี้ที่กรุงเทพมหานครมีโอกาสเกิดพายุฝนฟ้าคะนองค่ะ โดยมีโอกาสฝน 86% และปริมาณฝน 6 มม. ⛈️` | `POST /api/chat 200 in 4.4s (next.js: 3ms, application-code: 4.4s)` | Pass | Do not refresh before T07-2 |
| T07-2 | `แล้วพรุ่งนี้ล่ะ` | `สำหรับพรุ่งนี้ (4 ต.ค. 2026) ในกรุงเทพมหานคร จะมีฝนเป็นช่วง ๆ โดยมีอุณหภูมิต่ำสุด 25.9 องศาเซลเซียส และสูงสุด 33.4 องศาเซลเซียส ค่ะ อุณหภูมิที่รู้สึกได้ค่อนข้างสูงถึง 40.6 องศาเซลเซียส และมีโอกาสฝน 90% (ปริมาณฝน 3 มม.) ☂️` | `POST /api/chat 200 in 4.1s (next.js: 3ms, application-code: 4.1s)` | Pass | Bangkok/date inheritance passed |
| T08-1 | `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง` | `สภาพอากาศที่เชียงใหม่ในวันพรุ่งนี้ (4 ต.ค. 2026) จะมีพายุฝนฟ้าคะนอง โดยมีอุณหภูมิต่ำสุด 23.7 องศาเซลเซียส และสูงสุด 31 องศาเซลเซียส อุณหภูมิที่รู้สึกได้สูงสุดถึง 39 องศาเซลเซียส และมีโอกาสเกิดฝน 78% (ปริมาณฝน 7 มม.) ค่ะ ⛈️` | `POST /api/chat 200 in 4.5s (next.js: 3ms, application-code: 4.5s)` | Pass | Do not refresh before T08-2 |
| T08-2 | `แล้วช่วงเย็นล่ะ` | `สำหรับช่วงเย็นที่เชียงใหม่ (4 ต.ค. 2026) มีฝนละอองค่ะ 🌧️ อุณหภูมิอยู่ที่ 26.3°C (รู้สึกเหมือน 33.4°C) โอกาสฝน 77% และมีปริมาณฝน 3.6 มม. ค่ะ` | `POST /api/chat 200 in 4.4s (next.js: 4ms, application-code: 4.4s)` | Pass | Chiang Mai/date/evening inheritance passed |
| T09 | `พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง` | `ขออภัยค่ะ ☂️ น้องร่มค้นหาสถานที่ “เมือง ABCXYZ999” ไม่พบค่ะ ลองพิมพ์ชื่อเมืองหรือจังหวัดอีกครั้ง` | `POST /api/chat 404 in 2.4s (next.js: 3ms, application-code: 2.4s)` | Pass | Expected application 404; no fabricated location/weather |
| T10 | `กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง` | `ขออภัยค่ะ ☂️ น้องร่มยังไม่มีข้อมูลพยากรณ์สำหรับวันหรือช่วงเวลานั้นค่ะ ลองเลือกวันที่ใกล้ขึ้นนะคะ` | `POST /api/chat 422 in 3.0s (next.js: 3ms, application-code: 3.0s)` | Pass | Expected application 422; no fabricated forecast |
| T11 — pre-patch | `Will it rain in Bangkok tomorrow?` | `ใช่ค่ะ พรุ่งนี้ (4 ต.ค. 2026) ที่กรุงเทพมหานครมีโอกาสฝน 90% และมีปริมาณฝน 3 มม. ค่ะ 🌧️` | `POST /api/chat 200 in 4.0s (next.js: 3ms, application-code: 4.0s)` | **Fail** | Weather grounding passed; English input received Thai output |
| T11 — post-patch rerun | `Will it rain in Bangkok tomorrow?` | `Yes, there is a chance of rain in Bangkok tomorrow, Oct 4, 2026. The chance of rain is 90% with light rain showers expected and a precipitation amount of 3 mm.` | `POST /api/chat 200 in 6.0s (next.js: 1726ms, application-code: 4.3s)` | **Pass** | English-language preservation restored after targeted application guard |
| T12 | `พรุ่งนี้ฝนตกไหม` | `อยากเช็กสภาพอากาศที่ไหนคะ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️` | `POST /api/chat 200 in 1114ms (next.js: 7ms, application-code: 1108ms)` | Pass | Missing location requested; application did not guess a location |
| T12b | Without refresh: `เชียงใหม่` | `สำหรับที่เชียงใหม่ในวันที่ 4 ต.ค. 2026 มีพายุฝนฟ้าคะนองค่ะ โดยมีโอกาสฝน 78% และปริมาณฝน 7 มม. อุณหภูมิอยู่ระหว่าง 23.7 ถึง 31 องศาเซลเซียส ค่ะ ⛈️` | `POST /api/chat 200 in 4.3s (next.js: 4ms, application-code: 4.3s)` | Pass | Slot filling preserved original tomorrow/rain intent and resolved Chiang Mai |

## T11 targeted application fix

The failed pre-patch T11 run did **not** create Prompt V4. Prompt V3 already requires latest-message language matching and the closed V3 evidence had previously shown a valid English response.

The application-level hardening added:

1. conservative detection of an English latest user message (Latin letters present, Thai characters absent);
2. a post-compose check for Thai characters in the response to that English message;
3. deterministic English fallback generation from the same verified weather/recommendation facts if a mismatch occurs;
4. the same English fallback for retryable/non-model-unavailable Gemini response-generation failures;
5. no changes to Prompt V3, weather normalization, recommendation decisions, comparison rules, context logic, model selection, or Gemini sampling configuration.

The real post-patch T11 rerun passed.

## Final gate

**PASSED.** The final source is eligible to be packaged as `nongrom-final-mvp.zip`.
