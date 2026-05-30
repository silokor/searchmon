// SV 시리즈 25팩 한국/일본 발매 메타 (정가, 발매일, 박스 이미지 URL)
// 박스 이미지: 일본판은 limitlesstcg.com 시리즈 로고 외 별도 source 필요 → CDN search
// 한국 발매 정보: pokemonkorea.co.kr 공식 기준 (확인된 것만)

export type SetMetaExtra = {
  code: string;
  // 한국
  releasedKR: boolean;
  packPriceKR?: number;        // 1팩 정가 (원)
  boxPriceKR?: number;         // 1박스(30팩) 정가
  releaseKR?: string;          // YYYY-MM-DD
  nameKR_full?: string;        // 정식 한국판 명칭
  // 일본
  packPriceJPY: number;        // 보통 175엔/팩 (일반팩), 660엔/팩 (하이클래스)
  boxPriceJPY: number;
  releaseJP: string;
  // 박스 이미지 (실 사진)
  boxImageUrl?: string;
};

export const SET_EXTRAS: Record<string, SetMetaExtra> = {
  SV1V: {
    code: "SV1V",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-04-21",
    nameKR_full: "스칼렛 ex",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-01-20",
  },
  SV1S: {
    code: "SV1S",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-04-21",
    nameKR_full: "바이올렛 ex",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-01-20",
  },
  SV1a: {
    code: "SV1a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-06-23",
    nameKR_full: "트리플렛 비트",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-03-10",
  },
  SV2D: {
    code: "SV2D",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-07-21",
    nameKR_full: "클레이 버스트",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-04-14",
  },
  SV2P: {
    code: "SV2P",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-07-21",
    nameKR_full: "스노우 해저드",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-04-14",
  },
  SV2a: {
    code: "SV2a",
    releasedKR: true, packPriceKR: 5500, boxPriceKR: 110000, releaseKR: "2023-09-22",
    nameKR_full: "포켓몬 카드 151",
    packPriceJPY: 550, boxPriceJPY: 11000, releaseJP: "2023-06-16",
  },
  SV3: {
    code: "SV3",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-10-27",
    nameKR_full: "흑염의 지배자",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-07-28",
  },
  SV3a: {
    code: "SV3a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2023-11-24",
    nameKR_full: "레이징 서프",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-09-22",
  },
  SV4K: {
    code: "SV4K",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-01-26",
    nameKR_full: "고대의 포효",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-10-27",
  },
  SV4M: {
    code: "SV4M",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-01-26",
    nameKR_full: "미래의 일섬",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2023-10-27",
  },
  SV4a: {
    code: "SV4a",
    releasedKR: true, packPriceKR: 5500, boxPriceKR: 110000, releaseKR: "2024-03-15",
    nameKR_full: "샤이니 트레저 ex",
    packPriceJPY: 550, boxPriceJPY: 5500, releaseJP: "2023-12-01",
  },
  SV5K: {
    code: "SV5K",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-04-26",
    nameKR_full: "와일드 포스",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-01-26",
  },
  SV5M: {
    code: "SV5M",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-04-26",
    nameKR_full: "사이버 저지",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-01-26",
  },
  SV5a: {
    code: "SV5a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-06-21",
    nameKR_full: "크림슨 헤이즈",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-03-22",
  },
  SV6: {
    code: "SV6",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-08-30",
    nameKR_full: "변환의 가면",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-04-26",
  },
  SV6a: {
    code: "SV6a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-09-27",
    nameKR_full: "나이트 원더러",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-06-07",
  },
  SV7: {
    code: "SV7",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-11-15",
    nameKR_full: "스텔라 미라클",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-07-19",
  },
  SV7a: {
    code: "SV7a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2024-12-13",
    nameKR_full: "파라다임 트리거",
    packPriceJPY: 165, boxPriceJPY: 4950, releaseJP: "2024-09-13",
  },
  SV8: {
    code: "SV8",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2025-02-21",
    nameKR_full: "초전 브레이커",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2024-10-18",
  },
  SV8a: {
    code: "SV8a",
    releasedKR: true, packPriceKR: 5500, boxPriceKR: 110000, releaseKR: "2025-04-25",
    nameKR_full: "테라스탈 페스티벌 ex",
    packPriceJPY: 550, boxPriceJPY: 5500, releaseJP: "2024-12-06",
  },
  SV9: {
    code: "SV9",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2025-06-20",
    nameKR_full: "배틀 파트너즈",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2025-01-24",
  },
  SV9a: {
    code: "SV9a",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2025-07-25",
    nameKR_full: "히트웨이브 아레나",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2025-03-14",
  },
  SV10: {
    code: "SV10",
    releasedKR: true, packPriceKR: 2200, boxPriceKR: 66000, releaseKR: "2025-09-19",
    nameKR_full: "로켓단의 영광",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2025-05-30",
  },
  SV11W: {
    code: "SV11W",
    releasedKR: false,
    nameKR_full: "메가 화이트 ex (한국 미발매)",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2025-11-28",
  },
  SV11B: {
    code: "SV11B",
    releasedKR: false,
    nameKR_full: "메가 블랙 ex (한국 미발매)",
    packPriceJPY: 180, boxPriceJPY: 5400, releaseJP: "2025-11-28",
  },
};

// 환율 (JPY → KRW)
export const JPY_TO_KRW = 10.0; // 1엔 = 10원 (반올림 보수적)

// PSA10 가격 추정 multiplier (raw 시세 대비)
export const PSA10_MULTIPLIER: Record<string, number> = {
  SAR: 2.6, MUR: 2.4, MA: 2.0, AR: 1.8, UR: 2.8,
  SR: 2.2, SIR: 2.5, HR: 2.3, CHR: 1.6, CSR: 2.0, RR: 1.4, RRR: 1.5,
  R: 1.2, U: 1.0, C: 1.0,
};

// 카드 raw 추정가 (레어도별 일본 시세 평균, JPY)
// Limitless가 가격 안 줘서 레어도 기반 평균값 — 실거래는 Mercari 링크에서 확인
export const RAW_PRICE_BY_RARITY: Record<string, number> = {
  SAR: 25000, MUR: 35000, MA: 12000, AR: 3500, UR: 18000,
  SR: 8000, SIR: 20000, HR: 22000, CHR: 6000, CSR: 9000, RR: 1500, RRR: 2200,
  R: 300, U: 100, C: 50,
};
