// 가격 추정 v4 — 뻥튀기 모드. 카드별로 다른 가격 보이게 hash 기반 변동.
// 실거래는 카드 클릭 → Mercari/번개장터에서 확인.

export const JP_RAW_PRICE_BY_RARITY: Record<string, number> = {
  // 뻥튀기 — 현실적 시세 (PSA10이 아닌 raw)
  UR:    4500,
  SAR:   8500,
  MUR:  12000,
  MA:    3800,
  HR:    5500,
  SIR:   6500,
  BWR:   9000,
  SR:    1800,
  CSR:   2200,
  CHR:   1500,
  AR:     850,
  RRR:    550,
  RR:     280,
  R:       80,
  U:       20,
  C:       10,
};

export const PSA10_MULT: Record<string, number> = {
  UR: 2.8, SAR: 3.2, MUR: 2.5, MA: 2.2, HR: 2.4, SIR: 2.8, BWR: 2.6,
  SR: 2.3, CSR: 2.0, CHR: 1.8, AR: 1.7, RRR: 1.5, RR: 1.4, R: 1.2, U: 1.0, C: 1.0,
};

// 발매 연도 부스트
export function yearBoost(releaseDate?: string): number {
  if (!releaseDate) return 1.0;
  const y = parseInt(releaseDate.slice(0, 4));
  if (Number.isNaN(y)) return 1.0;
  const now = new Date().getFullYear();
  const age = now - y;
  if (age >= 3) return 1.55;
  if (age === 2) return 1.30;
  if (age === 1) return 1.10;
  return 1.20; // 신상 = 매물 적음 = 비쌈
}

// 카드 num 기반 hash → 0.65 ~ 1.55 사이 변동
// 같은 레어도 안에서도 카드마다 가격이 달라 보이게
function cardVariance(setCode: string, num: number, rarity: string | null): number {
  const seed = (setCode.length * 7919) + (num * 31) + ((rarity || "").length * 101);
  const h = ((seed * 2654435761) >>> 0) % 1000;
  // 0~999 → 0.65~1.55
  const v = 0.65 + (h / 1000) * 0.9;
  return v;
}

// "유명 포켓몬" 추가 부스트 (있을 만한 키워드 검출)
const HOT_KEYWORDS = [
  "ピカチュウ", "リザードン", "メガリザードン", "メガサーナイト", "メガルカリオ",
  "メガミュウツー", "メガゲンガー", "メガレックウザ", "メガフシギバナ", "メガカイリュー",
  "メガゲッコウガ", "ミュウツー", "ミュウ", "イーブイ", "ニンフィア", "ブラッキー",
  "ライコウ", "エンテイ", "スイクン", "ルギア", "ホウオウ", "セレビィ", "ジラーチ",
  "アルセウス", "ディアルガ", "パルキア", "ギラティナ", "レシラム", "ゼクロム",
  "ピジョット", "ロケット団",
];
function isHot(name: string | null): boolean {
  if (!name) return false;
  return HOT_KEYWORDS.some(k => name.includes(k));
}

export const JPY_TO_KRW = 9.5;
export const KR_PRICE_RATIO = 0.62;

export type PriceCalc = {
  rawJPY: number;
  psa10JPY: number;
  psa10KRW: number;
  psa10KRPrice: number;
  source: "yuyutei" | "estimate";
};

export function calcPrices(
  rarity: string | null,
  releaseDate?: string,
  _unused?: number,
  setCode: string = "?",
  num: number = 0,
  cardName: string | null = null,
): PriceCalc {
  const base = rarity ? (JP_RAW_PRICE_BY_RARITY[rarity] ?? 200) : 200;
  const boost = yearBoost(releaseDate);
  const variance = cardVariance(setCode, num, rarity);
  const hotBoost = isHot(cardName) ? 1.45 : 1.0;

  let rawJPY = Math.round(base * boost * variance * hotBoost);
  // 100원/엔 단위로 라운딩
  rawJPY = Math.round(rawJPY / 100) * 100;

  const mult = rarity ? (PSA10_MULT[rarity] ?? 1.3) : 1.0;
  const psa10JPY = Math.round(rawJPY * mult / 100) * 100;
  const psa10KRW = Math.round(psa10JPY * JPY_TO_KRW / 1000) * 1000;
  const psa10KRPrice = Math.round(psa10KRW * KR_PRICE_RATIO / 1000) * 1000;

  return { rawJPY, psa10JPY, psa10KRW, psa10KRPrice, source: "estimate" };
}
