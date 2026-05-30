// SV11B (Black Bolt) + SV11W (White Flare) 카드 데이터 크롤
// pokemontcg.io 영문판 → 일본명 매핑 (PokeAPI)
// 결과: src/data/cards/SV11B.json, SV11W.json (이미지 URL 포함)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CARDS_DIR = path.join(ROOT, "src/data/cards");
const POKE_NAMES = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/pokemon_names.json"), "utf-8"));

// 한국명 → 일본명 역매핑 (POKE_NAMES는 일본→한국)
const KO_TO_JA = {};
for (const [ja, ko] of Object.entries(POKE_NAMES)) KO_TO_JA[ko] = ja;

// 영문 포켓몬명 → 일본명 (PokeAPI species)
async function enToJa(en) {
  const slug = en.toLowerCase().replace(/[^a-z0-9-]/g, "");
  try {
    const r = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${slug}`);
    if (!r.ok) return null;
    const d = await r.json();
    const ja = d.names.find(n => n.language.name === "ja-Hrkt" || n.language.name === "ja");
    return ja?.name || null;
  } catch { return null; }
}

const RARITY_MAP = {
  "Common": "C", "Uncommon": "U", "Rare": "R",
  "Double Rare": "RR", "Double rare": "RR",
  "Ultra Rare": "UR",
  "Illustration Rare": "AR", "Illustration rare": "AR",
  "Special Illustration Rare": "SIR", "Special illustration rare": "SIR",
  "Hyper Rare": "HR",
  "Black White Rare": "BWR",
  "ACE SPEC Rare": "ACE",
  "Shiny Rare": "S",
  "Shiny Ultra Rare": "SR",
};

async function fetchSet(setId, code) {
  console.log(`Fetching ${setId} → ${code}`);
  const r = await fetch(`https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&pageSize=250&orderBy=number`);
  const d = await r.json();
  const cards = d.data;
  console.log(`  Got ${cards.length} cards`);

  const out = [];
  for (const c of cards) {
    const num = parseInt(c.number);
    const en = c.name;
    let ja = null;
    // 포켓몬은 enToJa, 트레이너는 그대로
    if (c.supertype === "Pokémon") {
      // " ex" suffix 처리
      const baseEn = en.replace(/\s*(ex|EX|V|VMAX|VSTAR|GX)\s*$/i, "").trim();
      const sfx = en.match(/\s*(ex|EX|V|VMAX|VSTAR|GX)\s*$/i)?.[1] || "";
      const jaBase = await enToJa(baseEn);
      if (jaBase) ja = jaBase + (sfx ? sfx.toLowerCase() : "");
    }
    out.push({
      num: isNaN(num) ? c.number : num,
      name: ja || en,
      rarity: RARITY_MAP[c.rarity] || c.rarity || null,
      imageUrl: c.images?.large || null,
      illustrator: c.artist || null,
      category: c.supertype === "Pokémon" ? "Pokemon" : c.supertype === "Trainer" ? "Trainer" : "Energy",
    });
  }

  const outPath = path.join(CARDS_DIR, `${code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`  Wrote ${outPath}`);
}

await fetchSet("zsv10pt5", "SV11B");
await fetchSet("rsv10pt5", "SV11W");
console.log("Done.");
