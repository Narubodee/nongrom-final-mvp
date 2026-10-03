# Final Regression Run Order

Use this order to keep context tests controlled.

1. Refresh → `วันนี้กรุงเทพฝนตกไหม`
2. Refresh → `พรุ่งนี้กรุงเทพอากาศเป็นยังไง`
3. Refresh → `เย็นนี้ควรพกร่มไหมที่กรุงเทพ`
4. Refresh → `วันนี้ตากผ้าได้ไหมที่กรุงเทพ`
5. Refresh → `เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ`
6. Refresh → comparison T06 Round 1
7. Refresh → comparison T06 Round 2
8. Refresh → comparison T06 Round 3
9. Refresh → `วันนี้กรุงเทพฝนตกไหม` → without refresh `แล้วพรุ่งนี้ล่ะ`
10. Refresh → `เชียงใหม่พรุ่งนี้อากาศเป็นยังไง` → without refresh `แล้วช่วงเย็นล่ะ`
11. Refresh → unknown location T09
12. Refresh → outside-range date T10
13. Refresh → English T11
14. Refresh → missing location T12 → without refresh `เชียงใหม่`

For every request, capture:

- exact user input
- exact Actual Output
- terminal `POST /api/chat ...` line
- HTTP status
- Pass / Partial / Fail
- issue description if any

Do not copy the old V3 Actual Output into Final Regression Results even when the wording happens to match. Final Regression evidence must come from this hardened build.
