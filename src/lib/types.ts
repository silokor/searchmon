// 서버/클라이언트 공용 타입
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
  displayName: string;    // "[일판] 이름" / "[한판] 이름"
  marketUrl: string;
};

export type SetIndexEntry = {
  code: string;
  name_ja: string;
  name_ko: string;
  name_full?: string;
  cardCount: number;
};

// === Mercari (일판) ===
export function mercariUrl(setCode: string, cardName: string | null, num: number | string, psa10 = true): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}

// === 한판 시세: 번개장터 검색 ===
export function bungaeUrl(cardName: string | null, num: number | string, setNameKR?: string): string {
  // 번개장터는 한글검색 잘됨
  const q = ["포켓몬", setNameKR || "", cardName || "", `${num}번`, "PSA10"].filter(Boolean).join(" ");
  return `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(q)}`;
}

export function formatKRW(n: number): string { return `₩${n.toLocaleString("ko-KR")}`; }
export function formatJPY(n: number): string { return `¥${n.toLocaleString("ja-JP")}`; }
