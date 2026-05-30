// Limitless TCG → searchmon 시드
// 사용: node scripts/crawl-sets.mjs
// 결과: src/data/sets.json + src/data/cards/<SET>.json + public/images/sets/<SET>.png + public/images/cards/<SET>/<num>.png
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src/data");
const CARDS_DIR = path.join(DATA_DIR, "cards");
const IMG_SETS = path.join(ROOT, "public/images/sets");
const IMG_CARDS = path.join(ROOT, "public/images/cards");
for (const d of [DATA_DIR, CARDS_DIR, IMG_SETS, IMG_CARDS]) fs.mkdirSync(d, { recursive: true });

const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// 2023+ SV 시리즈 팩 — 본팩 + 강화확장팩 + 하이클래스팩
// SV1V(바이올렛)/SV1S(스칼렛) = 2023.01 부터
const SETS = [
  // 2023
  { code: "SV1V", name_ja: "ポケモンカード151以前 SV1V スカーレットex", name_ko: "스칼렛 ex" },
  { code: "SV1S", name_ja: "SV1S バイオレットex", name_ko: "바이올렛 ex" },
  { code: "SV1a", name_ja: "SV1a トリプレットビート", name_ko: "트리플렛 비트" },
  { code: "SV2D", name_ja: "SV2D クレイバースト", name_ko: "클레이버스트" },
  { code: "SV2P", name_ja: "SV2P スノーハザード", name_ko: "스노우 해저드" },
  { code: "SV2a", name_ja: "SV2a ポケモンカード151", name_ko: "포켓몬 151" },
  { code: "SV3",  name_ja: "SV3 黒炎の支配者", name_ko: "흑염의 지배자" },
  { code: "SV3a", name_ja: "SV3a レイジングサーフ", name_ko: "레이징 서프" },
  { code: "SV4K", name_ja: "SV4K 古代の咆哮", name_ko: "고대의 포효" },
  { code: "SV4M", name_ja: "SV4M 未来の一閃", name_ko: "미래의 일섬" },
  { code: "SV4a", name_ja: "SV4a シャイニートレジャーex", name_ko: "샤이니 트레저 ex" },
  // 2024
  { code: "SV5K", name_ja: "SV5K ワイルドフォース", name_ko: "와일드 포스" },
  { code: "SV5M", name_ja: "SV5M サイバージャッジ", name_ko: "사이버 저지" },
  { code: "SV5a", name_ja: "SV5a クリムゾンヘイズ", name_ko: "크림슨 헤이즈" },
  { code: "SV6",  name_ja: "SV6 変幻の仮面", name_ko: "변환의 가면" },
  { code: "SV6a", name_ja: "SV6a ナイトワンダラー", name_ko: "나이트 원더러" },
  { code: "SV7",  name_ja: "SV7 ステラミラクル", name_ko: "스텔라 미라클" },
  { code: "SV7a", name_ja: "SV7a パラダイムトリガー", name_ko: "패러다임 트리거" },
  { code: "SV8",  name_ja: "SV8 超電ブレイカー", name_ko: "초전 브레이커" },
  { code: "SV8a", name_ja: "SV8a テラスタルフェスティバル", name_ko: "테라스탈 페스티벌 ex" },
  // 2025
  { code: "SV9",  name_ja: "SV9 バトルパートナーズ", name_ko: "배틀 파트너즈" },
  { code: "SV9a", name_ja: "SV9a ヒートウェイブアリーナ", name_ko: "히트웨이브 아레나" },
  { code: "SV10", name_ja: "SV10 ロケット団の栄光", name_ko: "로켓단의 영광" },
  { code: "SV11W", name_ja: "SV11W メガホワイトex", name_ko: "메가 화이트 ex" },
  { code: "SV11B", name_ja: "SV11B メガブラックex", name_ko: "메가 블랙 ex" },
];

async function fetchText(url, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) return await r.text();
      if (r.status === 404) return null;
    } catch (e) { /* retry */ }
    await sleep(800);
  }
  return null;
}

async function downloadImage(url, dest) {
  if (fs.existsSync(dest)) return true;
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA } });
      if (r.ok) {
        const buf = Buffer.from(await r.arrayBuffer());
        fs.writeFileSync(dest, buf);
        return true;
      }
    } catch {}
    await sleep(400);
  }
  return false;
}

function pickOg(html) {
  const m = html.match(/<meta property="og:image" content="([^"]+)"/);
  return m ? m[1] : null;
}

function parseTitle(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? m[1].trim() : null;
}

// 카드 그리드 페이지에서 카드 num + rarity 추출
function parseSetCards(html, setCode) {
  // /cards/jp/SET/NUM 링크 + 인접 이미지/rarity 추출
  // Limitless는 표 형태로 카드 num + rarity 노출. 정확 파싱은 카드 상세에서.
  const linkRe = new RegExp(`href="/cards/jp/${setCode}/(\\d+)"`, "g");
  const nums = new Set();
  let m;
  while ((m = linkRe.exec(html))) nums.add(parseInt(m[1], 10));
  return [...nums].sort((a, b) => a - b);
}

// 카드 상세에서 og:image + rarity + 이름 뽑기
async function fetchCardDetail(setCode, num) {
  const url = `https://limitlesstcg.com/cards/jp/${setCode}/${num}`;
  const html = await fetchText(url);
  if (!html) return null;
  const og = pickOg(html);
  // rarity는 og url 파일명에서 추출: SVxx_NUM_RAR_JP_SM.png
  let rarity = null;
  if (og) {
    const m = og.match(/_([A-Z]+)_JP/);
    if (m) rarity = m[1];
  }
  const title = parseTitle(html);
  // "이름 - 세트명 (CODE) #NUM"
  let name = null;
  if (title) {
    const tm = title.match(/^([^-]+)\s+-\s+/);
    if (tm) name = tm[1].trim();
  }
  return { num, name, rarity, imageUrl: og };
}

async function crawlSet(set) {
  const code = set.code;
  console.log(`\n[${code}] ${set.name_ja}`);

  // 1) 세트 메인 페이지
  const setUrl = `https://limitlesstcg.com/cards/jp/${code}`;
  const html = await fetchText(setUrl);
  if (!html) {
    console.log(`  ✗ 세트 페이지 없음 (404)`);
    return null;
  }
  const setName = parseTitle(html)?.replace(/\s*–\s*Limitless\s*$/, "").trim() || set.name_ja;

  // 2) 세트 로고
  const logoUrl = `https://s3.limitlesstcg.com/sets/jp/${code}.png`;
  const logoPath = path.join(IMG_SETS, `${code}.png`);
  await downloadImage(logoUrl, logoPath);

  // 3) 카드 num 추출
  const nums = parseSetCards(html, code);
  console.log(`  카드 ${nums.length}장`);

  // 4) 각 카드 상세 — 레어도 높은 거 위주만 받기 위해 우선 SAR/SR/UR/AR/MUR/MA/SIR/CHR/CSR/HR 후보 추출
  // 일단 다 받자 (병렬 5개씩)
  const cardImgDir = path.join(IMG_CARDS, code);
  fs.mkdirSync(cardImgDir, { recursive: true });

  const cards = [];
  const batchSize = 5;
  for (let i = 0; i < nums.length; i += batchSize) {
    const batch = nums.slice(i, i + batchSize);
    const results = await Promise.all(batch.map((n) => fetchCardDetail(code, n)));
    for (const r of results) {
      if (!r) continue;
      cards.push(r);
      if (r.imageUrl) {
        const ext = r.imageUrl.match(/\.(png|jpg|webp)/i)?.[1] || "png";
        const dest = path.join(cardImgDir, `${r.num}.${ext}`);
        await downloadImage(r.imageUrl, dest);
      }
    }
    process.stdout.write(`  진행 ${Math.min(i + batchSize, nums.length)}/${nums.length}\r`);
    await sleep(150);
  }
  console.log(`\n  ✓ 완료`);

  return { ...set, name: setName, cards };
}

(async () => {
  const index = [];
  for (const set of SETS) {
    const result = await crawlSet(set);
    if (result) {
      // 카드 데이터는 따로 저장
      const cardsFile = path.join(CARDS_DIR, `${result.code}.json`);
      fs.writeFileSync(cardsFile, JSON.stringify(result.cards, null, 2));
      index.push({
        code: result.code,
        name_ja: result.name_ja,
        name_ko: result.name_ko,
        name_full: result.name,
        cardCount: result.cards.length,
      });
      fs.writeFileSync(path.join(DATA_DIR, "sets.json"), JSON.stringify(index, null, 2));
    }
    await sleep(500);
  }
  console.log(`\n=== 완료. 세트 ${index.length}개 ===`);
})();
