// 가격 추정 v2 — 레어도 + 발매연도 + 시크릿 보정
// 실제 시세는 카드 클릭 시 마켓에서 확인. 이건 추정치.

// 일본 raw 시세 (JPY) — 레어도별 기본값
export const JP_RAW_PRICE_BY_RARITY: Record<string, number> = {
  UR:   20000,
  SAR:  18000,
  MUR:  35000,
  MA:   12000,
  HR:   15000,
  SIR:  16000,
  SR:    5000,
  CSR:   8000,
  CHR:   5000,
  AR:    2500,
  BWR:  25000,
  RRR:   2000,
  RR:    1000,
  R:      200,
  U:       80,
  C:       40,
};

// PSA10 multiplier (raw → PSA10 가격)
export const PSA10_MULT: Record<string, number> = {
  UR: 2.5, SAR: 2.8, MUR: 2.2, MA: 1.8, HR: 2.0, SIR: 2.5, SR: 2.0,
  CSR: 1.8, CHR: 1.6, AR: 1.5, BWR: 2.0, RRR: 1.4, RR: 1.3, R: 1.2, U: 1.0, C: 1.0,
};

// 발매연도별 보정 (오래된 카드일수록 비쌈, 신상도 부스트)
export function yearBoost(releaseDate?: string): number {
  if (!releaseDate) return 1.0;
  const y = parseInt(releaseDate.slice(0, 4));
  if (Number.isNaN(y)) return 1.0;
  const now = new Date().getFullYear();
  const age = now - y;
  if (age >= 3) return 1.35;  // 2023년 이전 = 빈티지 프리미엄
  if (age === 2) return 1.15;
  if (age === 1) return 1.0;
  return 1.1;  // 신상 부스트
}

// 환율 (JPY → KRW), 보수적
export const JPY_TO_KRW = 9.5;

// 한판 시세 비율 (일판 PSA10 KRW × 비율)
// 한국 시장은 일본 시장가의 50~60% (수요 < 공급, 한판은 일판보다 거래량 적음)
export const KR_PRICE_RATIO = 0.55;

export type PriceCalc = {
  rawJPY: number;
  psa10JPY: number;
  psa10KRW: number;       // 일판 PSA10 한화 환산 (해외 직구 기준)
  psa10KRPrice: number;   // 한판 PSA10 한국 시장가
};

export function calcPrices(rarity: string | null, releaseDate?: string): PriceCalc {
  const base = rarity ? (JP_RAW_PRICE_BY_RARITY[rarity] ?? 100) : 100;
  const mult = rarity ? (PSA10_MULT[rarity] ?? 1.3) : 1.0;
  const boost = yearBoost(releaseDate);
  const rawJPY = Math.round(base * boost / 50) * 50;
  const psa10JPY = Math.round(rawJPY * mult / 100) * 100;
  const psa10KRW = Math.round(psa10JPY * JPY_TO_KRW / 100) * 100;
  const psa10KRPrice = Math.round(psa10KRW * KR_PRICE_RATIO / 100) * 100;
  return { rawJPY, psa10JPY, psa10KRW, psa10KRPrice };
}
