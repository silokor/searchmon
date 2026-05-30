// PokeAPI → 일본 카타카나 ↔ 한국명 매핑
// 결과: src/data/pokemon_names.json — { "ピカチュウ": "피카츄", ... }
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "src/data/pokemon_names.json");

const UA = "Mozilla/5.0";
const TOTAL = 1025;
const BATCH = 20;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function getOne(id) {
  for (let i = 0; i < 3; i++) {
    try {
      const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { headers: { "User-Agent": UA } });
      if (r.ok) {
        const d = await r.json();
        const names = Object.fromEntries(d.names.map(n => [n.language.name, n.name]));
        return { id, ja: names["ja"] || names["ja-hrkt"], ko: names["ko"] };
      }
      if (r.status === 404) return null;
    } catch {}
    await sleep(300);
  }
  return null;
}

const map = {};
for (let i = 1; i <= TOTAL; i += BATCH) {
  const ids = [];
  for (let j = i; j < Math.min(i + BATCH, TOTAL + 1); j++) ids.push(j);
  const results = await Promise.all(ids.map(getOne));
  for (const r of results) {
    if (r?.ja && r?.ko) map[r.ja] = r.ko;
  }
  process.stdout.write(`  ${Math.min(i + BATCH - 1, TOTAL)}/${TOTAL} (${Object.keys(map).length} mapped)\r`);
  await sleep(80);
}
fs.writeFileSync(OUT, JSON.stringify(map, null, 2));
console.log(`\n=== ${Object.keys(map).length} 포켓몬 일↔한 매핑 완료 ===`);
