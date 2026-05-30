import fs from "node:fs";
import path from "node:path";

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

const DATA_DIR = path.join(process.cwd(), "src/data");

export function getAllSets(): SetIndexEntry[] {
  const file = path.join(DATA_DIR, "sets.json");
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getSetCards(code: string): CardEntry[] {
  const file = path.join(DATA_DIR, "cards", `${code}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getSetMeta(code: string): SetIndexEntry | null {
  return getAllSets().find((s) => s.code === code) ?? null;
}

// 레어도 순위 (높을수록 비싸고 희귀)
const RARITY_RANK: Record<string, number> = {
  UR: 100, SAR: 95, SR: 80, AR: 70, MUR: 90, MA: 85,
  RR: 60, RRR: 65, CHR: 75, CSR: 78, HR: 88, SIR: 92,
  R: 30, U: 20, C: 10,
};

export function rankRarity(r: string | null | undefined): number {
  if (!r) return 0;
  return RARITY_RANK[r] ?? 0;
}

// 힛카드만 필터 (레어도 60 이상)
export function getHitCards(cards: CardEntry[]): CardEntry[] {
  return cards
    .filter((c) => rankRarity(c.rarity) >= 60)
    .sort((a, b) => rankRarity(b.rarity) - rankRarity(a.rarity));
}

// Mercari 검색 URL (PSA10 포함)
export function mercariUrl(setCode: string, cardName: string | null, num: number, psa10 = false): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}
