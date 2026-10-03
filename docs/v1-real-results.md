# NongRom — V1 Real Results on `gemini-3.5-flash-lite`

Date: 2026-10-03

These are real outputs supplied by the Product Owner. They are not fabricated or pre-generated expected outputs.

## V1-G35-01 — Bangkok rain today
Input: `วันนี้กรุงเทพฝนตกไหม`

Actual Output:
> สวัสดีค่ะน้องร่มมาแล้วค่ะ ☂️ สำหรับกรุงเทพมหานครในวันที่ 3 ตุลาคม 2026 นี้ มีโอกาสเกิดฝนตกสูงถึง 95% เลยค่ะ โดยคาดว่าจะมีสภาพอากาศเป็นพายุฝนฟ้าคะนอง และมีปริมาณฝนประมาณ 2.3 มม. ออก  
> เดินทางอย่าลืมพกร่มติดตัวไว้ด้วยนะคะ

Terminal: `POST /api/chat 200 in 5.8s (next.js: 1535ms, application-code: 4.3s)`

Assessment: **Pass**, with response wording/persona issues.

## V1-G35-02 — Follow-up tomorrow
Input: `แล้วพรุ่งนี้ล่ะ`

Actual Output:
> สำหรับวันพรุ่งนี้ (4 ต.ค. 2569) ที่กรุงเทพมหานคร มีคาดการณ์ว่าจะมีฝนปรอยหนักตลอดทั้งวัน โดยมีโอกาสเกิดฝนอยู่ที่ 85% และปริมาณฝนประมาณ 2.3 มม. ครับ 🌧️  
>  
> อุณหภูมิจะอยู่ระหว่าง 26 ถึง 33.9 อาศัยความรู้สึกร้อนถึง 40.6 ซ. ยังไงพกร่มติดตัวไว้ด้วยนะครับ ☂️

Terminal: `POST /api/chat 200 in 4.2s (next.js: 8ms, application-code: 4.2s)`

Assessment: **Pass with response-quality issues**. Context inheritance succeeded.

## V1-G35-03 — Follow-up evening
Input: `แล้วช่วงเย็นล่ะ`

Actual Output:
> สวัสดีค่ะน้องร่มเองนะคะ ☂️  
>  
> สำหรับช่วงเย็นของวันที่ 4 ตุลาคม 2569 ที่กรุงเทพมหานคร อุณหภูมิจะอยู่ที่ประมาณ 28.1°C (รู้สึกเหมือนร้อนถึง 34.4°C) มีโอกาสเจอฝนปรอยหนักประมาณ 85% ปริมาณฝนราวๆ 1.7 มิลลิเมตรค่ะ ความชื้นค่อนข้างสูงอยู่ที่ 83% อย่าลืมพกร่มติดตัวไว้ด้วยนะคะ 🌧️

Terminal: `POST /api/chat 200 in 4.4s (next.js: 3ms, application-code: 4.4s)`

Assessment: **Pass with response-quality issues**. Multi-turn location + date + time inheritance succeeded.

## V1-G35-04 — Laundry recommendation
Input: `วันนี้ตากผ้าได้ไหมที่กรุงเทพ`

Actual Output:
> สวัสดีค่ะน้องร่มเองนะคะ ☂️ วันที่ 3 ต.ค. 2026 นี้ ที่กรุงเทพมหานครไม่ค่อยแนะนำให้ตากผ้าค่ะ เนื่องจากมีสภาพอากาศเป็นพายุฝนฟ้าคะนอง โดยมีโอกาสเกิดฝนสูงถึง 95% และมีปริมาณฝนประมาณ 2.3 มม. ค่ะ

Terminal: `POST /api/chat 200 in 4.2s (next.js: 4ms, application-code: 4.2s)`

Assessment: **Pass**, with repeated self-introduction.

## V1-G35-05 — Running recommendation
Input: `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ`

Actual Output:
> สวัสดีค่ะน้องร่มจาก Open-Meteo นะคะ ☂️  
>  
> สำหรับกรุงเทพมหานครในช่วงเย็นวันนี้ (3 ตุลาคม 2026) น้องร่มไม่แนะนำให้ออกไปวิ่งค่ะ เนื่องจากมีโอกาสเกิดฝนตกประมาณ 78% และอุณหภูมิที่รู้สึกได้ค่อนข้างสูงถึงประมาณ 35.2°C ค่ะ หากจำเป็นต้องออกไปด้านนอก อย่าลืมพกร่มกันฝนไว้ด้วยนะคะ

Terminal: `POST /api/chat 200 in 4.1s (next.js: 3ms, application-code: 4.1s)`

Assessment: **Pass with persona issue**. Open-Meteo was incorrectly blended into NongRom's identity.

## V1-G35-06 — Bangkok vs Chiang Mai comparison
Input: `กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า`

Actual Output:
> สวัสดีค่ะน้องร่มมาแล้วค่ะ จากข้อมูล Open-Meteo สำหรับวันพรุ่งนี้ (4 ต.ค. 2026) กรุงเทพมหานครมีอุณหภูมิสูงสุดสูงกว่าเชียงใหม่ค่ะ โดยกรุงเทพฯ สูงสุดอยู่ที่ 33.9°C (อุณหภูมิตัวแทนสูงสุด 33.9°C) ส่วนเชียงใหม่อยู่ที่ 30.6°C ค่ะ ☀️

Terminal: `POST /api/chat 200 in 4.3s (next.js: 3ms, application-code: 4.3s)`

Assessment: **Pass with wording issue** (`อุณหภูมิตัวแทนสูงสุด`).

## V1-G35-07 — Missing location
Input: `พรุ่งนี้ฝนตกไหม`

Actual Output:
> อยากเช็กสภาพอากาศที่ไหนครับ? บอกชื่อเมืองหรือจังหวัดให้น้องร่มได้เลย ☂️

Terminal: `POST /api/chat 200 in 1223ms (next.js: 3ms, application-code: 1220ms)`

Assessment: **Pass**. This response is application-generated, not Gemini-composed; its `ครับ` wording is therefore an application-copy issue, not a V2 Response Prompt issue.

## V1-G35-08 — Fill missing location on next turn
Input: `เชียงใหม่`

Actual Output:
> สวัสดีค่ะน้องร่มมาแล้วค่ะ ☂️ สำหรับที่เชียงใหม่ในวันที่ 4 ตุลาคม 2569 นี้ ทั้งวันมีโอกาสเกิดพายุฝนฟ้าคะนอง โดยมีปริมาณฝนประมาณ 5.2 มิลลิเมตร และโอกาส 69% ค่ะ อุณหภูมิอยู่ที่ประมาณ 26.5°C (ต่ำสุด 23.5°C สูงสุด 30.6°C) ความชื้น 88% และความเร็วลม 3.8 กม./ชม. ข้อมูลจาก Open-Meteo นี้ช่วยให้คุณเตรียมร่มก่อนออกจากบ้านได้เลยนะคะ

Terminal: `POST /api/chat 200 in 4.1s (next.js: 4ms, application-code: 4.1s)`

Assessment: **Pass with response-quality issues**. Missing-location recovery and inherited tomorrow date succeeded.

## V1-G35-09 — Unknown location
Input: `พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง`

Actual Output:
> ขออภัยครับ ☂️ น้องร่มค้นหาสถานที่ “เมือง ABCXYZ999” ไม่พบครับ ลองพิมพ์ชื่อเมืองหรือจังหวัดอีกครั้ง

Terminal: `POST /api/chat 404 in 2.6s (next.js: 3ms, application-code: 2.6s)`

Assessment: **Pass**. Error response is application-generated; not a Gemini Response Prompt output.

## V1-G35-10 — Date outside forecast range
Input: `กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง`

Actual Output:
> ขออภัยครับ ☂️ น้องร่มยังไม่มีข้อมูลพยากรณ์สำหรับวันหรือช่วงเวลานั้นครับ ลองเลือกวันที่ใกล้ขึ้น

Terminal: `POST /api/chat 422 in 3.1s (next.js: 3ms, application-code: 3.1s)`

Assessment: **Pass**. No forecast was fabricated. Error response is application-generated.

## V1 findings that motivate Prompt V2

Prompt-scope findings from Gemini-composed outputs:
- Repeated unnecessary greetings/self-introductions.
- Thai polite particle/persona inconsistency (`ครับ` vs `ค่ะ`).
- Incorrect identity phrasing: `น้องร่มจาก Open-Meteo`.
- Awkward user-facing phrases such as `ฝนปรอยหนัก`, `อาศัยความรู้สึกร้อน`, and `อุณหภูมิตัวแทนสูงสุด`.
- Some answers expose more fields than needed for the user's intent.
- Gregorian vs Buddhist Era date presentation varies between responses.

Application-scope findings intentionally **not changed in Prompt V2**:
- Missing-location and deterministic error messages use hard-coded `ครับ`.
- HTTP 404/422 error-contract choices.
- Internal normalized condition labels and deterministic comparison/recommendation reason strings.

Keeping those application behaviors unchanged preserves the controlled prompt experiment.
