# NongRom — Prompt V3 Real Results

## Experiment status

**Status:** Closed after real Product Owner testing on 2026-10-03 (Thailand, UTC+7).

Controlled variables remained unchanged from V2 unless explicitly noted:
- Model: `gemini-3.5-flash-lite`
- Gemini generation parameters: Default (not explicitly configured)
- Retry policy: unchanged
- Open-Meteo/geocoding: unchanged
- Structured understanding schema: unchanged
- Conversation context/date-time resolver: unchanged
- Weather normalization: unchanged
- Recommendation/comparison rules: unchanged
- Understanding prompt: text-identical to V1/V2
- Response Composer: V3
- Deterministic feminine-persona copy patch: separate application patch, not a Prompt V3 improvement

All Actual Output and terminal lines below are copied verbatim from real user runs. They are not reconstructed or corrected.

---

## 1. T01 — Bangkok rain today

Input: `วันนี้กรุงเทพฝนตกไหม`

Actual Output:

> วันนี้กรุงเทพมหานครมีโอกาสฝนตกค่ะ โดยมีพายุฝนฟ้าคะนอง และโอกาสฝนสูงถึง 95% พร้อมปริมาณฝน 2.3 มม. 🌧️

Terminal:

```text
POST /api/chat 200 in 5.9s (next.js: 1601ms, application-code: 4.3s)
```

Result:
- Functional: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: no greeting/self-introduction/provider identity; facts preserved. Minor semantic repetition around rain probability was accepted.

---

## 2. T07 turn 2 — Follow-up tomorrow

Input in same chat: `แล้วพรุ่งนี้ล่ะ`

Actual Output:

> สำหรับกรุงเทพมหานครในวันที่ 4 ต.ค. 2026 มีฝนละออง โดยมีอุณหภูมิต่ำสุด 26 องศาเซลเซียส และสูงสุด 33.9 องศาเซลเซียส (อุณหภูมิที่รู้สึกได้สูงสุดถึง 40.6 องศาเซลเซียส) พร้อมโอกาสฝน 85% และปริมาณฝน 2.3 มม. ค่ะ 🌧️

Terminal:

```text
POST /api/chat 200 in 4.1s (next.js: 13ms, application-code: 4.1s)
```

Result:
- Functional/context: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: Bangkok and tomorrow were inherited correctly. V2 issues `ฝนปรอยค่อนข้างมาก` and `อาซิลเซียส` did not recur; no unsupported `ตลอดทั้งวัน` claim.

---

## 3. T07 turn 3 — Follow-up evening

Input in same chat: `แล้วช่วงเย็นล่ะ`

Actual Output:

> สำหรับช่วงเย็นของวันที่ 4 ต.ค. 2026 ในกรุงเทพมหานคร จะมีฝนละอองค่ะ โดยมีอุณหภูมิ 28.1°C (อุณหภูมิที่รู้สึกได้ 34.4°C) และมีโอกาสฝน 85% ปริมาณฝน 1.7 มม. ☂️

Terminal:

```text
POST /api/chat 200 in 4.1s (next.js: 5ms, application-code: 4.1s)
```

Result:
- Functional/context: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: three-layer context inheritance remained correct: Bangkok → 4 Oct 2026 → evening. V2 `ฝนปรอยหนัก` changed to natural `ฝนละออง`.

---

## 4. T04 — Laundry recommendation

Input: `วันนี้ตากผ้าได้ไหมที่กรุงเทพ`

Actual Output:

> วันนี้ไม่แนะนำให้ตากผ้าที่กรุงเทพฯ นะคะ เนื่องจากมีพายุฝนฟ้าคะนอง โดยมีโอกาสฝนสูงถึง 95% และมีปริมาณฝนประมาณ 2.3 มม. ค่ะ 🌧️

Terminal:

```text
POST /api/chat 200 in 6.4s (next.js: 6ms, application-code: 6.4s)
```

Result:
- Functional/recommendation: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed over deterministic recommendation facts

Notes: recommendation first; strongest relevant reasons only; no greeting/provider identity.

---

## 5. T05 — Running recommendation

Input: `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ`

Actual Output:

> ช่วงเย็นนี้ที่กรุงเทพฯ ไม่ค่อยเหมาะกับการวิ่งนะคะ เนื่องจากมีโอกาสฝนละออง 78% และอุณหภูมิที่รู้สึกได้ค่อนข้างสูงถึง 35.2°C ค่ะ 🌧️

Terminal:

```text
POST /api/chat 200 in 4.4s (next.js: 4ms, application-code: 4.4s)
```

Result:
- Functional/recommendation: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed over deterministic recommendation facts

Notes: preserved evening/Bangkok/rain/apparent-temperature reasoning; concise and persona-consistent.

---

## 6. T06 — Bangkok vs Chiang Mai comparison

Input: `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า`

Actual Output:

> พรุ่งนี้กรุงเทพมหานครร้อนกว่าเชียงค่ะ โดยกรุงเทพฯ มีอุณหภูมิสูงสุด 33.9°C (อุณหภูมิที่รู้สึกได้ 40.6°C) ส่วนเชียงใหม่อุณหภูมิสูงสุด 30.6°C ค่ะ ☀️

Terminal:

```text
POST /api/chat 200 in 7.3s (next.js: 12ms, application-code: 7.3s)
```

Result:
- Functional/comparison logic: **Pass**
- Response quality: **Partial**
- Path: Gemini-composed over deterministic comparison facts

Issue: one generated phrase truncated the entity name `เชียงใหม่` to `เชียง` in `ร้อนกว่าเชียงค่ะ`, although the full `เชียงใหม่` appeared correctly later in the same answer. Numeric comparison remained correct: 33.9°C vs 30.6°C.

Classification: **V3 entity-name preservation regression**. This is real evidence and must not be erased by rewriting the V3 output.

---

## 7. T12 — Missing location clarification

Input: `พรุ่งนี้ฝนตกไหม`

Actual Output:

> อยากเช็กสภาพอากาศที่ไหนคะ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️

Terminal:

```text
POST /api/chat 200 in 1132ms (next.js: 8ms, application-code: 1124ms)
```

Result:
- Functional: **Pass**
- Application persona patch: **Pass**
- Path: deterministic application copy

Notes: did not guess a location. Feminine copy replaced the V1/V2 masculine `ครับ` variant. This improvement is attributed to the application patch, not Prompt V3.

---

## 8. Missing-location slot filling

Input in same chat: `เชียงใหม่`

Actual Output:

> สำหรับเชียงใหม่ในวันที่ 4 ต.ค. 2026 มีโอกาสเกิดพายุฝนฟ้าคะนอง 69% ค่ะ โดยมีปริมาณฝน 5.2 มม. และอุณหภูมิอยู่ระหว่าง 23.5 ถึง 30.6 องศาเซลเซียสค่ะ ⛈️

Terminal:

```text
POST /api/chat 200 in 4.1s (next.js: 4ms, application-code: 4.1s)
```

Result:
- Functional/context/slot filling: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: preserved prior tomorrow intent and filled only the missing location. Less metric dumping than V2.

---

## 9. T09 — Location not found

Input: `พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง`

Actual Output:

> ขออภัยค่ะ ☂️ น้องร่มค้นหาสถานที่ “เมือง ABCXYZ999” ไม่พบค่ะ ลองพิมพ์ชื่อเมืองหรือจังหวัดอีกครั้ง

Terminal:

```text
POST /api/chat 404 in 2.4s (next.js: 3ms, application-code: 2.4s)
```

Result:
- Error handling: **Pass**
- No fabrication: **Pass**
- Application persona patch: **Pass**
- Path: deterministic application copy

Notes: expected application 404; not a Gemini/API failure.

---

## 10. T10 — Date outside forecast range

Input: `กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง`

Actual Output:

> ขออภัยค่ะ ☂️ น้องร่มยังไม่มีข้อมูลพยากรณ์สำหรับวันหรือช่วงเวลานั้นค่ะ ลองเลือกวันที่ใกล้ขึ้นนะคะ

Terminal:

```text
POST /api/chat 422 in 3.0s (next.js: 3ms, application-code: 3.0s)
```

Result:
- Date validation: **Pass**
- No fabrication: **Pass**
- Application persona patch: **Pass**
- Path: deterministic application copy

Notes: expected application 422; no fabricated out-of-range forecast.

---

## 11. T11 — English rain query

Input: `Will it rain in Bangkok tomorrow?`

Actual Output:

> Yes, there is an 85% chance of drizzle in Bangkok tomorrow (4 Oct 2026), with expected precipitation of 2.3 mm. 🌧️

Terminal:

```text
POST /api/chat 200 in 4.0s (next.js: 2ms, application-code: 4.0s)
```

Result:
- Functional: **Pass**
- Language preservation: **Pass**
- Terminology/factual preservation: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: clear V2→V3 improvement. V2 answered this English query in Thai and added `ฝนปรอยหนักตลอดทั้งวัน`; V3 answered in English and did not imply unsupported all-day duration.

---

## 12. T02 — Standalone Bangkok tomorrow forecast

Input: `พรุ่งนี้กรุงเทพอากาศเป็นยังไง`

Actual Output:

> พยากรณ์อากาศที่กรุงเทพมหานครในวันที่ 4 ต.ค. 2026 มีฝนละออง โดยมีอุณหภูมิต่ำสุด 26 องศาเซลเซียส สูงสุด 33.9 องศาเซลเซียส (อุณหภูมิเฉลี่ย 28.8 องศาเซลเซียส และอุณหภูมิที่รู้สึกได้สูงสุดถึง 40.6 องศาเซลเซียส) มีโอกาสเกิดฝน 85% ปริมาณฝน 2.3 มม. ค่ะ 🌧️

Terminal:

```text
POST /api/chat 200 in 4.8s (next.js: 157ms, application-code: 4.7s)
```

Result:
- Functional: **Pass**
- Terminology/unit protection: **Pass**
- Factual preservation: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: V2 `ฝนปรอยหนัก` did not recur; `อาซิลเซียส` did not recur; no unsupported `ตลอดทั้งวัน`. Some extra metrics remain acceptable for a broad forecast question.

---

## 13. T08 turn 1 — Chiang Mai tomorrow

Input: `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง`

Actual Output:

> พยากรณ์อากาศที่เชียงใหม่ในวันที่ 4 ต.ค. 2026 มีพายุฝนฟ้าคะนองค่ะ โดยมีอุณหภูมิต่ำสุด 23.5 องศาเซลเซียส และสูงสุด 30.6 องศาเซลเซียส (อุณหภูมิที่รู้สึกได้ 38 องศาเซลเซียส) มีโอกาสเกิดฝน 69% และปริมาณฝน 5.2 มิลลิเมตรค่ะ ⛈️

Terminal:

```text
POST /api/chat 200 in 4.3s (next.js: 4ms, application-code: 4.3s)
```

Result:
- Functional/location/date: **Pass**
- Terminology/unit protection: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: full `เชียงใหม่` entity name was preserved here, suggesting the T06 truncation was not caused by the location resolver.

---

## 14. T08 turn 2 — Chiang Mai evening follow-up

Input in same chat: `แล้วช่วงเย็นล่ะ`

Actual Output:

> สำหรับช่วงเย็นที่เชียงใหม่จะมีฝนละอองค่ะ ☂️ อุณหภูมิประมาณ 27.3°C (อุณหภูมิที่รู้สึกได้ 35.3°C) โดยมีโอกาสฝน 67% และปริมาณฝน 2.9 มม. ค่ะ

Terminal:

```text
POST /api/chat 200 in 4.0s (next.js: 4ms, application-code: 4.0s)
```

Result:
- Functional/context: **Pass**
- Terminology/unit protection: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed

Notes: inherited Chiang Mai + 4 Oct 2026 and changed only the time period to evening.

---

## 15. T03 — Umbrella recommendation

Input: `เย็นนี้ควรพกร่มไหมที่กรุงเทพ`

Actual Output:

> ควรพกร่มค่ะ 🌂 เนื่องจากช่วงเย็นที่กรุงเทพมหานครมีโอกาสฝน 78% และมีฝนละอองเล็กน้อย ปริมาณฝนประมาณ 0.1 มม.ค่ะ

Terminal:

```text
POST /api/chat 200 in 6.5s (next.js: 4ms, application-code: 6.4s)
```

Result:
- Functional/recommendation: **Pass**
- Response quality: **Pass**
- Path: Gemini-composed over deterministic recommendation facts

Minor issue: missing whitespace in `0.1 มม.ค่ะ`; meaning is unaffected.

---

# V3 observed conclusion

## Functional behavior

All 15 planned V3 requests completed their intended functional path successfully in the observed test sequence:
- **15/15 Functional Pass**
- Context inheritance remained correct in both Bangkok and Chiang Mai multi-turn cases.
- Recommendation behavior for laundry, running, and umbrella remained correct.
- Error handling did not fabricate a location or out-of-range forecast.

This is an observed test result, not a claim of universal reliability.

## Response quality

- **14/15 Response Quality Pass**
- **1/15 Response Quality Partial**: T06 entity-name truncation `เชียงใหม่` → `เชียง` in one phrase.

## V3 goals confirmed by real evidence

1. Controlled drizzle terminology improved: `ฝนละออง` / `drizzle` replaced recurring V2 wording such as `ฝนปรอยหนัก` and `ฝนปรอยค่อนข้างมาก` in the targeted cases.
2. Unit protection worked in the observed V3 sequence; malformed `อาซิลเซียส` did not recur.
3. Unsupported `ตลอดทั้งวัน` / `all day` wording did not recur in the targeted daily rain cases.
4. English input received English output in T11.
5. Repeated greeting/self-introduction and provider-identity blending did not recur.
6. Recommendation and context behavior from V2 was retained.
7. Deterministic application persona copy now uses feminine Thai particles in tested clarification/error paths; this is an **Application Persona Patch** result, not a Prompt V3 result.

## Remaining issues before Final MVP hardening

1. **Entity-name preservation:** one comparison generation changed `เชียงใหม่` to `เชียง`. Exact location names are trusted structured facts and should be protected at application level rather than relying only on generation instructions.
2. **Minor formatting:** `0.1 มม.ค่ะ` lacked a space in one output.
3. **Relevance can still be tightened:** broad forecast answers may include optional metrics that are not strictly needed, though the tested output remained acceptable.
4. **Latency varies by request:** observed application-code times ranged from about 1.1s for clarification to 7.3s for a full comparison. No 503/retry event was reported in this V3 sequence; these runs alone do not establish a general latency guarantee.

Prompt V3 is now **closed**. Do not rewrite its historical outputs to hide the T06 regression.
