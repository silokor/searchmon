// tcgdex.net 일본판 API → searchmon 시드
// 결과: src/data/cards/<SET>.json — rarity 정확, 일본명 정확, 이미지 URL 정확
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CARDS_DIR = path.join(ROOT, "src/data/cards");
fs.mkdirSync(CARDS_DIR, { recursive: true });

const UA = "Mozilla/5.0 (compatible; SearchmonBot/1.0)";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const SETS = [
  "SV1V","SV1S","SV1a","SV2D","SV2P","SV2a","SV3","SV3a",
  "SV4K","SV4M","SV4a","SV5K","SV5M","SV5a","SV6","SV6a",
  "SV7","SV7a","SV8","SV8a","SV9","SV9a","SV10","SV11W","SV11B"
];

async function fetchJSON(url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return await r.json();
      if (r.status === 404) return null;
    } catch {}
    await sleep(500);
  }
  return null;
}

// 일본판 rarity → 영문 코드 매핑 (tcgdex가 "Common"/"Uncommon"/"Rare" 형태로 줄 수도, JP rarity로 줄 수도)
// 정확한 일본판 rarity (C/U/R/RR/RRR/AR/SR/SAR/UR/HR/CHR/CSR/CHR/SIR/MA/MUR)는 그대로 유지
const RARITY_NORMALIZE = {
  "Common": "C",
  "Uncommon": "U",
  "Rare": "R",
  "Double Rare": "RR",
  "Triple Rare": "RRR",
  "Art Rare": "AR",
  "Super Rare": "SR",
  "Special Art Rare": "SAR",
  "Ultra Rare": "UR",
  "Hyper Rare": "HR",
  "Shiny Rare": "S",
  "Shiny Super Rare": "SSR",
  "Illustration Rare": "AR",
  "Special Illustration Rare": "SIR",
  "Master Ball Rare": "MA",
  "Master Rare": "MUR",
  // 키 그 자체로 들어오면 통과
  "C":"C","U":"U","R":"R","RR":"RR","RRR":"RRR","AR":"AR","SR":"SR","SAR":"SAR",
  "UR":"UR","HR":"HR","SIR":"SIR","MA":"MA","MUR":"MUR","CHR":"CHR","CSR":"CSR",
};

async function crawlSet(code) {
  console.log(`\n[${code}]`);
  const set = await fetchJSON(`https://api.tcgdex.net/v2/ja/sets/${code}`);
  if (!set) { console.log("  ✗ 세트 없음"); return null; }
  console.log(`  ${set.name} / 카드 ${set.cards.length}장`);

  // 각 카드 상세 페치 (병렬 8개씩)
  const cards = [];
  const batch = 8;
  for (let i = 0; i < set.cards.length; i += batch) {
    const slice = set.cards.slice(i, i + batch);
    const results = await Promise.all(slice.map(c => fetchJSON(`https://api.tcgdex.net/v2/ja/cards/${c.id}`)));
    for (const c of results) {
      if (!c) continue;
      const rawRar = c.rarity;
      const rarity = rawRar ? (RARITY_NORMALIZE[rawRar] || rawRar) : null;
      cards.push({
        num: parseInt(c.localId, 10) || c.localId,
        name: c.name,
        rarity,
        imageUrl: c.image ? `${c.image}/high.png` : null,
        illustrator: c.illustrator || null,
        category: c.category || null,
      });
    }
    process.stdout.write(`  진행 ${Math.min(i + batch, set.cards.length)}/${set.cards.length}\r`);
    await sleep(80);
  }

  // num 기준 정렬
  cards.sort((a, b) => (typeof a.num === "number" ? a.num : 999) - (typeof b.num === "number" ? b.num : 999));
  fs.writeFileSync(path.join(CARDS_DIR, `${code}.json`), JSON.stringify(cards, null, 2));

  // 힛카드 수 출력
  const RANK = {SAR:95,UR:100,MUR:90,MA:85,SR:80,SIR:92,AR:70,HR:88,CHR:75,CSR:78,RR:60,RRR:65};
  const hits = cards.filter(c => c.rarity && RANK[c.rarity] >= 60).length;
  console.log(`\n  ✓ rarity 분포: ${JSON.stringify(Object.fromEntries(Object.entries(cards.reduce((a,c)=>{a[c.rarity||'?']=(a[c.rarity||'?']||0)+1;return a;},{})).sort((a,b)=>b[1]-a[1])))}`);
  console.log(`  ★ 힛카드 ${hits}장`);
  return cards;
}

(async () => {
  for (const code of SETS) {
    await crawlSet(code);
    await sleep(300);
  }
  console.log("\n=== 완료 ===");
})();
