// tcgdex 한국어 API → 한판 카드명 매핑
// 결과: src/data/cards_ko/<SET>.json (num → korean name)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/data/cards_ko");
fs.mkdirSync(OUT, { recursive: true });

const UA = "Mozilla/5.0";
const sleep = ms => new Promise(r => setTimeout(r, ms));

// 우리 25개 코드 → tcgdex 한국 세트 id (정확)
const MAP = {
  SV1V: "SV1V", SV1S: "SV1S", SV1a: "SV1a", SV2D: "SV2D", SV2P: "SV2P",
  SV2a: "SV2a", SV3: "SV3", SV3a: "SV3a", SV4K: "SV4K", SV4M: "SV4M",
  SV4a: "SV4a", SV5K: "SV5K", SV5M: "SV5M", SV5a: "SV5a", SV6: "SV6",
  SV6a: "SV6a", SV7: "SV7", SV7a: "SV7a", SV8: "SV8", SV8a: "SV8a",
  SV9: "SV9", SV9a: "SV9a", SV10: "SV10",
  // SV11W/B 한판 미발매 → 매핑 없음
};

async function fetchJSON(url, retry = 2) {
  for (let i = 0; i < retry; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return await r.json();
      if (r.status === 404) return null;
    } catch {}
    await sleep(400);
  }
  return null;
}

const results = {};
for (const [ourCode, koCode] of Object.entries(MAP)) {
  // 1) /cards?set= 로 카드 목록 가져오기
  const list = await fetchJSON(`https://api.tcgdex.net/v2/ko/cards?set=${koCode}`);
  if (!list || list.length === 0) {
    console.log(`✗ ${ourCode} (ko: ${koCode}) - no cards`);
    continue;
  }
  // localId(num) → name 매핑
  const mapping = {};
  for (const c of list) {
    const num = parseInt(c.localId, 10);
    if (!Number.isNaN(num)) mapping[num] = c.name;
  }
  results[ourCode] = mapping;
  fs.writeFileSync(path.join(OUT, `${ourCode}.json`), JSON.stringify(mapping, null, 2));
  console.log(`✓ ${ourCode}: ${Object.keys(mapping).length} 카드명 매핑`);
  await sleep(200);
}

console.log(`\n=== 한국 카드명 매핑 완료: ${Object.keys(results).length}/${Object.keys(MAP).length} 세트 ===`);
