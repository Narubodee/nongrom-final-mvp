const baseUrl = (process.env.NONGROM_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const delayMs = Number(process.env.NONGROM_TEST_DELAY_MS ?? "500");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function send(message, context) {
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(context ? { message, context } : { message }),
  });
  const body = await response.json();
  if (delayMs > 0) await sleep(delayMs);
  return { status: response.status, body };
}

const scenarios = [
  { id: "T01", turns: [{ message: "วันนี้กรุงเทพฝนตกไหม", status: 200 }] },
  { id: "T02", turns: [{ message: "พรุ่งนี้กรุงเทพอากาศเป็นยังไง", status: 200 }] },
  { id: "T03", turns: [{ message: "เย็นนี้ควรพกร่มไหมที่กรุงเทพ", status: 200 }] },
  { id: "T04", turns: [{ message: "วันนี้ตากผ้าได้ไหมที่กรุงเทพ", status: 200 }] },
  { id: "T05", turns: [{ message: "เย็นนี้เหมาะกับการวิ่งไหมที่กรุงเทพ", status: 200 }] },
  { id: "T06", turns: [{ message: "กรุงเทพกับเชียงใหม่พรุ่งนี้ที่ไหนร้อนกว่า", status: 200, check: (r) => r.body.message?.includes("เชียงใหม่") }] },
  { id: "T07", turns: [{ message: "วันนี้กรุงเทพฝนตกไหม", status: 200 }, { message: "แล้วพรุ่งนี้ล่ะ", status: 200 }] },
  { id: "T08", turns: [{ message: "เชียงใหม่พรุ่งนี้อากาศเป็นยังไง", status: 200 }, { message: "แล้วช่วงเย็นล่ะ", status: 200 }] },
  { id: "T09", turns: [{ message: "พรุ่งนี้อากาศที่เมือง ABCXYZ999 เป็นยังไง", status: 404, errorCode: "LOCATION_NOT_FOUND" }] },
  { id: "T10", turns: [{ message: "กรุงเทพวันที่ 1 มกราคม 2027 อากาศเป็นยังไง", status: 422, errorCode: "FORECAST_UNAVAILABLE" }] },
  { id: "T11", turns: [{ message: "Will it rain in Bangkok tomorrow?", status: 200, check: (r) => !/[\u0E00-\u0E7F]/u.test(r.body.message ?? "") }] },
  { id: "T12", turns: [{ message: "พรุ่งนี้ฝนตกไหม", status: 200 }, { message: "เชียงใหม่", status: 200 }] },
];

let passed = 0;
for (const scenario of scenarios) {
  let context;
  let scenarioOk = true;
  console.log(`--- ${scenario.id} ---`);
  for (const turn of scenario.turns) {
    try {
      const result = await send(turn.message, context);
      const statusOk = result.status === turn.status;
      const codeOk = turn.errorCode ? result.body.errorCode === turn.errorCode : true;
      const customOk = turn.check ? Boolean(turn.check(result)) : true;
      const turnOk = statusOk && codeOk && customOk;
      scenarioOk = scenarioOk && turnOk;
      console.log(`${turnOk ? "PASS" : "FAIL"} | input=${turn.message} | status=${result.status} | errorCode=${result.body.errorCode ?? ""}`);
      console.log(`OUTPUT | ${result.body.message ?? ""}`);
      if (result.body.context) context = result.body.context;
    } catch (error) {
      scenarioOk = false;
      console.log(`FAIL | input=${turn.message} | requestError=${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (scenarioOk) passed += 1;
}

console.log(`SUMMARY core: ${passed}/${scenarios.length} PASS, ${scenarios.length - passed} FAIL`);
process.exitCode = passed === scenarios.length ? 0 : 1;
