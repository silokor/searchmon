// 서버/클라이언트 공용 타입 + 클라에서 안전한 유틸
export type CardEntry = {
  num: number | string;
  name: string | null;
  rarity: string | null;
  imageUrl: string | null;
  illustrator?: string | null;
  category?: string | null;
};

export type CardEnriched = CardEntry & {
  rank: number;
  rawJPY: number;
  psa10JPY: number;
  psa10KRW: number;
};

export type SetIndexEntry = {
  code: string;
  name_ja: string;
  name_ko: string;
  name_full?: string;
  cardCount: number;
};

export function mercariUrl(setCode: string, cardName: string | null, num: number | string, psa10 = false): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}

export function formatKRW(n: number): string { return `₩${n.toLocaleString("ko-KR")}`; }
export function formatJPY(n: number): string { return `¥${n.toLocaleString("ja-JP")}`; }
