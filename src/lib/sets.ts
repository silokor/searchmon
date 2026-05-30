import fs from "node:fs";
import path from "node:path";
import { SET_EXTRAS, type SetMetaExtra } from "@/data/setExtras";
import { calcPrices } from "@/data/pricing";
import boxImagesJson from "@/data/boxImages.json";
import printedTotalsJson from "@/data/printedTotals.json";
import {
  type CardEntry, type CardEnriched, type SetIndexEntry, type Edition,
  bungaeUrl, bungaeJPUrl, toKoreanCardName,
} from "@/lib/types";

const boxImages = boxImagesJson as Record<string, string>;
const printedTotals = printedTotalsJson as Record<string, number>;

// (yuyu-tei 크롤 제거됨 — 가격은 pricing.ts에서 카드별 hash로 추정)

const RARITY_NORMALIZE: Record<string, string> = {
  "C": "C", "U": "U", "R": "R",
  "Double rare": "RR", "Double Rare": "RR",
  "Illustration rare": "AR", "Illustration Rare": "AR",
  "Special illustration rare": "SIR", "Special Illustration Rare": "SIR",
  "Black White Rare": "BWR",
  "Common": "C", "Uncommon": "U", "Rare": "R",
  "UR": "UR", "SAR": "SAR", "SR": "SR", "AR": "AR", "MA": "MA",
  "MUR": "MUR", "HR": "HR", "CHR": "CHR", "CSR": "CSR", "RRR": "RRR", "SIR": "SIR",
  "Ultra Rare": "UR", "Hyper Rare": "HR",
};

function normalizeRarity(r: string | null | undefined, num: number, setCode: string): string | null {
  if (r && RARITY_NORMALIZE[r]) return RARITY_NORMALIZE[r];
  if (r === "None" || r === null || r === undefined) {
    const total = printedTotals[setCode] ?? 0;
    if (total > 0 && num > total) return "SAR"; // 시크릿
    return null;
  }
  return r;
}

const DATA_DIR = path.join(process.cwd(), "src/data");

export function getAllSets(): SetIndexEntry[] {
  const file = path.join(DATA_DIR, "sets.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getSetCards(code: string): CardEntry[] {
  const file = path.join(DATA_DIR, "cards", `${code}.json`);
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf-8")) as CardEntry[];
  return raw.map((c) => ({
    ...c,
    rarity: normalizeRarity(c.rarity, typeof c.num === "number" ? c.num : 0, code),
  }));
}

export function getSetMeta(code: string): SetIndexEntry | null {
  return getAllSets().find((s) => s.code === code) ?? null;
}

export function getSetExtra(code: string): SetMetaExtra | undefined {
  return SET_EXTRAS[code];
}

const RARITY_RANK: Record<string, number> = {
  UR: 100, SAR: 95, SR: 80, AR: 70, MUR: 90, MA: 85, BWR: 92,
  RR: 60, RRR: 65, CHR: 75, CSR: 78, HR: 88, SIR: 92,
  R: 30, U: 20, C: 10,
};

export function rankRarity(r: string | null | undefined): number {
  if (!r) return 0;
  return RARITY_RANK[r] ?? 0;
}

/**
 * 카드를 enrich — edition별로 별도 객체 생성
 * 한판 발매 세트면 [일판][한판] 두 개 카드를 같이 반환
 */
export function enrichCards(setCode: string, cards: CardEntry[], releasedKR: boolean, releaseDateJP?: string): CardEnriched[] {
  const extra = getSetExtra(setCode);
  const setNameKR = extra?.nameKR_full?.replace(/\s*\(한국 미발매\)\s*/, "");
  const releaseDate = releaseDateJP || extra?.releaseJP;
  const out: CardEnriched[] = [];

  for (const c of cards) {
    const num = c.num as number;
    const price = calcPrices(c.rarity, releaseDate, undefined, setCode, num, c.name);
    const rank = rankRarity(c.rarity);
    const baseName = c.name || `#${num}`;
    const koName = toKoreanCardName(c.name);

    // [일판] 카드
    out.push({
      ...c,
      edition: "JP",
      rank,
      ...price,
      koreanName: koName,
      displayName: `[일판] ${baseName}`,
      marketUrl: bungaeJPUrl(koName, c.name, num, setNameKR),
    });

    // [한판] 카드 — 한국 발매된 세트에 한해
    if (releasedKR) {
      out.push({
        ...c,
        edition: "KR",
        rank,
        ...price,
        koreanName: koName,
        displayName: `[한판] ${koName || baseName}`,
        marketUrl: bungaeUrl(koName, c.name, num, setNameKR),
      });
    }
  }

  return out;
}

export function getEnrichedCards(setCode: string): CardEnriched[] {
  const cards = getSetCards(setCode);
  const extra = getSetExtra(setCode);
  return enrichCards(setCode, cards, extra?.releasedKR ?? false, extra?.releaseJP);
}

export function getHitCards(enriched: CardEnriched[]): CardEnriched[] {
  return enriched.filter(c => c.rank >= 60);
}

export function getBoxImage(code: string): string | null {
  if (!boxImages[code]) return null;
  const ext = boxImages[code].match(/\.(png|jpg)$/i)?.[1] || "png";
  return `/images/boxes/${code}.${ext}`;
}
