import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const tmpDir = resolve(root, ".tmp-geocoding-regression");
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

const localTsc = process.platform === "win32"
  ? resolve(root, "node_modules/.bin/tsc.cmd")
  : resolve(root, "node_modules/.bin/tsc");
const tsc = existsSync(localTsc) ? localTsc : "tsc";
const tempTsconfig = resolve(root, ".tmp-geocoding-regression-tsconfig.json");
writeFileSync(tempTsconfig, JSON.stringify({
  compilerOptions: {
    target: "ES2022",
    module: "commonjs",
    moduleResolution: "node",
    lib: ["ES2022", "DOM", "DOM.Iterable"],
    skipLibCheck: true,
    esModuleInterop: true,
    baseUrl: ".",
    paths: { "@/*": ["./*"] },
    rootDir: ".",
    outDir: tmpDir,
  },
  files: [
    "lib/weather/geocoding.ts",
    "lib/weather/thaiProvinces.ts",
    "types/weather.ts",
    "types/chat.ts",
  ],
}, null, 2));

const compile = spawnSync(tsc, ["-p", tempTsconfig], { cwd: root, encoding: "utf8" });
rmSync(tempTsconfig, { force: true });

if (compile.status !== 0) {
  process.stdout.write(compile.stdout);
  process.stderr.write(compile.stderr);
  process.exit(compile.status ?? 1);
}

const require = createRequire(import.meta.url);
const { geocodeLocation } = require(resolve(tmpDir, "lib/weather/geocoding.js"));
const { THAI_PROVINCES } = require(resolve(tmpDir, "lib/weather/thaiProvinces.js"));

const thaiNames = THAI_PROVINCES.map((province) => province.thaiName);
if (THAI_PROVINCES.length !== 77 || new Set(thaiNames).size !== 77) {
  throw new Error(`Thai province mapping must contain 77 unique provinces; got ${THAI_PROVINCES.length}/${new Set(thaiNames).size}`);
}

const previouslyFailed = new Set([
  "ฉะเชิงเทรา",
  "ตราด",
  "นนทบุรี",
  "พะเยา",
  "เพชรบุรี",
  "สระบุรี",
  "หนองคาย",
  "อุบลราชธานี",
]);

const mode = process.argv[2] ?? "all";
const cases = mode === "failed"
  ? THAI_PROVINCES.filter((province) => previouslyFailed.has(province.thaiName))
  : THAI_PROVINCES;

const nativeFetch = globalThis.fetch;
let calls = [];
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === "string" ? input : input.url);
  if (url.hostname === "geocoding-api.open-meteo.com") {
    calls.push({
      name: url.searchParams.get("name"),
      language: url.searchParams.get("language"),
    });
  }
  return nativeFetch(input, init);
};

let passed = 0;
let failed = 0;

for (const province of cases) {
  calls = [];
  try {
    const result = await geocodeLocation(province.thaiName);
    const usedFallback = calls.some((call) => call.name === province.geocodingName);
    const countryOk = result.countryCode === "TH";
    const displayOk = usedFallback ? result.name === province.thaiName : true;
    const ok = countryOk && displayOk;

    if (ok) passed += 1;
    else failed += 1;

    console.log([
      ok ? "PASS" : "FAIL",
      province.thaiName,
      `resolved=${result.name}`,
      `country=${result.countryCode ?? ""}`,
      `fallback=${usedFallback ? "yes" : "no"}`,
      `queries=${calls.map((call) => `${call.name}:${call.language}`).join(" -> ")}`,
    ].join(" | "));
  } catch (error) {
    failed += 1;
    console.log([
      "FAIL",
      province.thaiName,
      `error=${error instanceof Error ? error.message : String(error)}`,
      `queries=${calls.map((call) => `${call.name}:${call.language}`).join(" -> ")}`,
    ].join(" | "));
  }
}

console.log(`SUMMARY ${mode}: ${passed}/${cases.length} PASS, ${failed} FAIL`);
rmSync(tmpDir, { recursive: true, force: true });
process.exitCode = failed === 0 ? 0 : 1;
