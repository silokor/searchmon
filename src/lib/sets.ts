import fs from "node:fs";
import path from "node:path";
import { SET_EXTRAS, type SetMetaExtra, JPY_TO_KRW, PSA10_MULTIPLIER, RAW_PRICE_BY_RARITY } from "@/data/setExtras";
import boxImagesJson from "@/data/boxImages.json";
import printedTotalsJson from "@/data/printedTotals.json";

const boxImages = boxImagesJson as Record<string, string>;
const printedTotals = printedTotalsJson as Record<string, number>;

// tcgdex 영문 rarity → 일본 코드
const RARITY_NORMALIZE: Record<string, string> = {
  "C": "C", "U": "U", "R": "R",
  "Double rare": "RR",
  "Illustration rare": "AR",
  "Special illustration rare": "SIR",
  "Black White Rare": "BWR",
  "UR": "UR", "SAR": "SAR", "SR": "SR", "AR": "AR", "MA": "MA",
  "MUR": "MUR", "HR": "HR", "CHR": "CHR", "CSR": "CSR", "RRR": "RRR", "SIR": "SIR",
};

function normalizeRarity(r: string | null | undefined, num: number, setCode: string): string | null {
  if (r && RARITY_NORMALIZE[r]) return RARITY_NORMALIZE[r];
  if (r === "None" || r === null || r === undefined) {
    // 번호가 printed total 초과 = 시크릿
    const total = printedTotals[setCode] ?? 0;
    if (total > 0 && num > total) {
      return "SAR"; // 시크릿 통칭 — 정확한 분류는 추후 보강
    }
    return null;
  }
  return r;
}

export type SetIndexEntry = {
  code: string;
  name_ja: string;
  name_ko: string;
  name_full?: string;
  cardCount: number;
};

export type CardEntry = {
  num: number;
  name: string | null;
  rarity: string | null;
  imageUrl: string | null;
};

export type CardEnriched = CardEntry & {
  rank: number;
  rawJPY: number;
  psa10JPY: number;
  psa10KRW: number;
};

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

export function enrichCard(c: CardEntry): CardEnriched {
  const rank = rankRarity(c.rarity);
  const raw = c.rarity ? RAW_PRICE_BY_RARITY[c.rarity] ?? 100 : 100;
  const mult = c.rarity ? PSA10_MULTIPLIER[c.rarity] ?? 1.5 : 1.5;
  const psa10JPY = Math.round(raw * mult / 100) * 100;
  const psa10KRW = Math.round(psa10JPY * JPY_TO_KRW / 100) * 100;
  return { ...c, rank, rawJPY: raw, psa10JPY, psa10KRW };
}

export function getHitCards(cards: CardEntry[]): CardEnriched[] {
  return cards
    .filter((c) => rankRarity(c.rarity) >= 60)
    .map(enrichCard)
    .sort((a, b) => b.rank - a.rank || b.psa10JPY - a.psa10JPY);
}

export function getBoxImage(code: string): string | null {
  if (!boxImages[code]) return null;
  const ext = boxImages[code].match(/\.(png|jpg)$/i)?.[1] || "png";
  // 로컬 경로 우선, 없으면 원본 URL
  return `/images/boxes/${code}.${ext}`;
}

// 카드 이름 표시: 일본명(원본) 그대로, "한국 발매 카드"인 경우 한국명도 표기 가능하나 매핑 데이터 없으므로 일본명만
export function displayCardName(c: CardEntry): string {
  return c.name || `#${c.num}`;
}

export function mercariUrl(setCode: string, cardName: string | null, num: number, psa10 = false): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}

// 한국 시세 = 일본 시세 × 보정환율 (배송/관세 포함 보수적 1.15배)
export function jpyToKRW(jpy: number): number {
  return Math.round(jpy * JPY_TO_KRW * 1.0 / 100) * 100;
}

export function formatKRW(n: number): string {
  return `₩${n.toLocaleString("ko-KR")}`;
}
export function formatJPY(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}
