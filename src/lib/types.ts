// 서버/클라이언트 공용 타입
import pokeNames from "@/data/pokemon_names.json";

const POKE_NAMES = pokeNames as Record<string, string>;

// 트레이너/특수카드 한글 매핑 (PokeAPI 미포함)
const TRAINER_NAMES: Record<string, string> = {
  // 서포트
  "博士の研究": "박사의 연구",
  "ナンジャモ": "이로치미디어",
  "ハイパーボール": "하이퍼볼",
  "モンスターボール": "몬스터볼",
  "ネストボール": "네스트볼",
  "クイックボール": "퀵볼",
  "ヒスイのヘビーボール": "히스이의 헤비볼",
  "ボウルタウン": "볼타운",
  "ピーニャ": "피냐",
  "ペパー": "페퍼",
  "サザレ": "사자레",
  "ボスの指令": "보스의 지령",
  "オモダカ": "오모다카",
  "ジニア": "지니아",
  "アカマツ": "아카마츠",
  "ブライア": "브라이어",
  "コルサ": "콜사",
  "ハッサク": "핫삭",
  "アオキ": "아오키",
  "リーリエのピッピ": "릴리에의 삐삐",
  "ライチュウV": "라이츄 V",
  "セイボリー": "세이보리",
  "ミモザ": "미모사",
  "シャクヤ": "샤크야",
  "コライドンex": "코라이돈 ex",
  "ミライドンex": "미라이돈 ex",
  "テラパゴスex": "테라파고스 ex",
  "ジラーチex": "지라치 ex",
  "アルセウスex": "아르세우스 ex",
  // 아이템
  "プレシャスキャリー": "프레셔스 캐리",
  "ふしぎなアメ": "이상한 사탕",
  "エネルギー回収": "에너지 회수",
  "すごいつりざお": "굉장한 낚싯대",
  "カウンターキャッチャー": "카운터 캐처",
  "プライムキャッチャー": "프라임 캐처",
  "テラスタルオーブ": "테라스탈 오브",
  "ともだちてちょう": "친구수첩",
  "ピーニャのびっくりボックス": "피냐의 깜짝상자",
  "改造ハンマー": "개조 해머",
  "つきのいし": "달의돌",
  // 에너지
  "ダブルターボエネルギー": "더블 터보 에너지",
  "ジェットエネルギー": "제트 에너지",
  "ルミナスエネルギー": "루미너스 에너지",
  "リバーサルエネルギー": "리버설 에너지",
  "ヒート炎エネルギー": "히트 불꽃 에너지",
  "サイコエンブレム": "사이코 엠블럼",
};

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
  source: "yuyutei" | "estimate";
  // 표시용
  displayName: string;
  koreanName: string | null;
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
  // 트레이너/특수카드
  if (TRAINER_NAMES[jpName]) return TRAINER_NAMES[jpName];
  if (TRAINER_NAMES[base]) return TRAINER_NAMES[base] + (suffix ? " " + suffix : "");
  // 포함 매칭 (부분 일치, 트레이너 카드 등)
  return null;
}

// === Mercari (일판) === 일본어로 검색
export function mercariUrl(setCode: string, cardName: string | null, num: number | string, psa10 = true): string {
  const q = [cardName || "", setCode, `${num}`, psa10 ? "PSA10" : ""].filter(Boolean).join(" ");
  return `https://jp.mercari.com/search?keyword=${encodeURIComponent(q)}`;
}

// === 번개장터 (한판) === 한글로: "포켓몬카드 [팩명] [카드명] 한판"
export function bungaeUrl(koName: string | null, jpName: string | null, num: number | string, setNameKR?: string): string {
  const cardKw = koName || jpName || "";
  const q = ["포켓몬카드", setNameKR || "", cardKw, "한판"].filter(Boolean).join(" ");
  return `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(q)}`;
}

// === 번개장터 (일판) === 한글로: "포켓몬카드 [팩명] [카드명] 일판"
export function bungaeJPUrl(koName: string | null, jpName: string | null, num: number | string, setNameKR?: string): string {
  // 한글 매핑 있으면 한글, 없으면 일본명
  const cardKw = koName || jpName || "";
  const q = ["포켓몬카드", setNameKR || "", cardKw, "일판"].filter(Boolean).join(" ");
  return `https://m.bunjang.co.kr/search/products?q=${encodeURIComponent(q)}`;
}

// === 한판 시세 보조: 네이버 쇼핑 ===
export function naverShopUrl(koName: string | null, jpName: string | null, setNameKR?: string): string {
  const cardKw = koName || jpName || "";
  const q = ["포켓몬카드", setNameKR || "", cardKw, "한판"].filter(Boolean).join(" ");
  return `https://search.shopping.naver.com/search/all?query=${encodeURIComponent(q)}`;
}

export function formatKRW(n: number): string { return `₩${n.toLocaleString("ko-KR")}`; }
export function formatJPY(n: number): string { return `¥${n.toLocaleString("ja-JP")}`; }
