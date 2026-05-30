import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IMG = path.join(ROOT, "public/images/boxes");
fs.mkdirSync(IMG, { recursive: true });

const UA = "Mozilla/5.0 (compatible; SearchmonBot/1.0)";

// Bulbapedia 페이지 → 박스 이미지 추출
const PAGES = {
  SV1V: "Scarlet_ex_(TCG)",
  SV1S: "Violet_ex_(TCG)",
  SV1a: "Triplet_Beat_(TCG)",
  SV2D: "Clay_Burst_(TCG)",
  SV2P: "Snow_Hazard_(TCG)",
  SV2a: "Pokémon_Card_151_(TCG)",
  SV3: "Ruler_of_the_Black_Flame_(TCG)",
  SV3a: "Raging_Surf_(TCG)",
  SV4K: "Ancient_Roar_(TCG)",
  SV4M: "Future_Flash_(TCG)",
  SV4a: "Shiny_Treasure_ex_(TCG)",
  SV5K: "Wild_Force_(TCG)",
  SV5M: "Cyber_Judge_(TCG)",
  SV5a: "Crimson_Haze_(TCG)",
  SV6: "Mask_of_Change_(TCG)",
  SV6a: "Night_Wanderer_(TCG)",
  SV7: "Stellar_Miracle_(TCG)",
  SV7a: "Paradigm_Trigger_(TCG)",
  SV8: "Super_Electric_Breaker_(TCG)",
  SV8a: "Terastal_Festival_ex_(TCG)",
  SV9: "Battle_Partners_(TCG)",
  SV9a: "Heat_Wave_Arena_(TCG)",
  SV10: "Glory_of_Team_Rocket_(TCG)",
  SV11W: "Mega_Symphonia_White_(TCG)",
  SV11B: "Mega_Symphonia_Black_(TCG)",
};

async function getBoxImg(code, slug) {
  const url = `https://bulbapedia.bulbagarden.net/wiki/${slug}`;
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) return null;
  const html = await r.text();
  // 박스 이미지 우선, 없으면 booster pack
  const candidates = [
    /src="(https:\/\/archives\.bulbagarden\.net\/media\/upload[^"]+(?:box|Box)[^"]*\.(?:png|jpg))"/g,
    /src="(https:\/\/archives\.bulbagarden\.net\/media\/upload[^"]+(?:booster|pack)[^"]*\.(?:png|jpg))"/g,
  ];
  for (const re of candidates) {
    const m = re.exec(html);
    if (m) {
      // thumb URL 처리: /thumb/x/yy/zzz.png/180px-zzz.png → 풀버전 /x/yy/zzz.png
      let u = m[1].replace(/\/thumb\/(.+?)\/\d+px-[^\/]+$/, "/$1");
      return u;
    }
  }
  return null;
}

const results = {};
for (const [code, slug] of Object.entries(PAGES)) {
  const u = await getBoxImg(code, slug);
  if (u) {
    console.log(`✓ ${code}: ${u}`);
    results[code] = u;
    // download
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA } });
      if (r.ok) {
        const ext = u.match(/\.(png|jpg)$/i)?.[1] || "png";
        const dest = path.join(IMG, `${code}.${ext}`);
        fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
      }
    } catch {}
  } else {
    console.log(`✗ ${code}: not found`);
  }
  await new Promise(r => setTimeout(r, 500));
}
fs.writeFileSync(path.join(ROOT, "src/data/boxImages.json"), JSON.stringify(results, null, 2));
console.log(`\n=== ${Object.keys(results).length}/25 boxes ===`);
