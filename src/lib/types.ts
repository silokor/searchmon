// 서버/클라이언트 공용 타입
import pokeNames from "@/data/pokemon_names.json";

const POKE_NAMES = pokeNames as Record<string, string>;

export type Edition = "JP" | "KR";

export type CardEntry = {
  num: number | string;
  name: string | null;
  rarity: string | null;
  imageUrl: string | null;
  illustrator?: string | null;
  category?: string | null;
};

export type CardEnriched = CardEntry & {
  edition: Edition;
  rank: number;
  rawJPY: number;
  psa10JPY: number;
  psa10KRW: number;       // 일판 한화 환산
  psa10KRPrice: number;   // 한판 한국 시장가
  // 표시용
  displayName: string;    // "[일판] 이름" / "[한판] 한글이름"
  koreanName: string | null; // 추정된 한글 카드명 (포켓몬 종족명 기반)
  marketUrl: string;
};

export type SetIndexEntry = {
  code: string;
  name_ja: string;
  name_ko: string;
  name_full?: string;
  cardCount: number;
};

// 일본 카드명 → 한국어 (포켓몬 종족명만 매핑, 나머지는 그대로)
export function toKoreanCardName(jpName: string | null): string | null {
  if (!jpName) return null;
  // "ex" / 트레이너 표기 제거 후 종족명 추출 시도
  // ex) "ピカチュウex" → "ピカチュウ" + "ex"
  let base = jpName;
  let suffix = "";
  const mEx = jpName.match(/^(.+?)(ex|EX|V|VMAX|VSTAR|GX)$/);
  if (mEx) { base = mEx[1]; suffix = mEx[2]; }

  // 정확 매칭
  if (POKE_NAMES[base]) {
    return POKE_NAMES[base] + (suffix ? " " + suffix : "");
  }
  if (POKE_NAMES[jpName]) return POKE_NAMES[jpName];
  // 포함 매칭 (부분 일치, 트레이너 카드 등)
  return null;
}

// === Mercari (일판) ===
export function mercariUrl(setCode: string, cardName: string | null, num: number | string, psa10 = true): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}

// === 한판 시세: 번개장터 (한글로 검색) ===
export function bungaeUrl(koName: string | null, jpName: string | null, num: number | string, setNameKR?: string): string {
  // 한글명 우선, 없으면 일본명 (그대로 검색해도 결과 나올 수 있음)
  const cardKw = koName || jpName || "";
  const q = ["포켓몬", "한판", setNameKR || "", cardKw, "PSA10"].filter(Boolean).join(" ");
  return `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(q)}`;
}

// === 한판 시세 보조: 네이버 쇼핑 ===
export function naverShopUrl(koName: string | null, jpName: string | null, setNameKR?: string): string {
  const cardKw = koName || jpName || "";
  const q = ["포켓몬", "한판", setNameKR || "", cardKw, "PSA10"].filter(Boolean).join(" ");
  return `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`;
}

export function formatKRW(n: number): string { return `₩${n.toLocaleString("ko-KR")}`; }
export function formatJPY(n: number): string { return `¥${n.toLocaleString("ja-JP")}`; }
