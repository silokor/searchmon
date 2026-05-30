// 세트별 printedTotal 추가 페치 후 cards에 secret 플래그 보강
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const SETS = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/sets.json"), "utf-8"));

(async () => {
  // tcgdex sets 가져와서 우리 코드와 매칭
  const r = await fetch("https://api.tcgdex.net/v2/ja/sets", { headers: { "User-Agent": "SearchmonBot" } });
  const all = await r.json();
  const byCode = {};
  for (const s of all) byCode[s.id.toUpperCase()] = s;

  const printedTotalMap = {};
  for (const s of SETS) {
    const matched = byCode[s.code.toUpperCase()];
    if (matched) {
      printedTotalMap[s.code] = matched.cardCount?.official ?? matched.cardCount?.total ?? 0;
    }
  }
  fs.writeFileSync(path.join(ROOT, "src/data/printedTotals.json"), JSON.stringify(printedTotalMap, null, 2));
  console.log("printedTotals:", printedTotalMap);
})();
