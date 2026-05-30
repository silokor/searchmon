// SV 시리즈 25팩 메타 — 정가 + 박스 리셀 시세
// 일판 = 크림(Kream) 한국 마켓 시세 (원 → 엔 자동 환산, 표시는 원 메인)
// 한판 = 번개장터/네이버 평균
// 환율: 1엔 ≈ 9.5원 (2026.05 기준)

export type SetMetaExtra = {
  code: string;
  releasedKR: boolean;
  // 한국 (리셀 시세, 원)
  packPriceKR?: number;
  boxPriceKR?: number;
  // 한국 정가 (참고용)
  msrpPackKR?: number;
  msrpBoxKR?: number;
  releaseKR?: string;
  nameKR_full?: string;
  // 일본 (리셀 시세, 엔) — Kream KRW 기준으로 환산
  packPriceJPY: number;
  boxPriceJPY: number;
  // 일본 정가 (참고용)
  msrpPackJPY: number;
  msrpBoxJPY: number;
  releaseJP: string;
};

// JPY → KRW 환율 (1엔 ≈ 9.5원)
const JTK = 9.5;

// 일판 박스 Kream KRW 시세 → JPY 환산 헬퍼
const krwToJpy = (krw: number) => Math.round(krw / JTK / 100) * 100;

export const SET_EXTRAS: Record<string, SetMetaExtra> = {
  SV1V: {
    code: "SV1V", releasedKR: true,
    packPriceKR: 3200, boxPriceKR: 95000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-04-21",
    nameKR_full: "스칼렛 ex",
    packPriceJPY: krwToJpy(5500), boxPriceJPY: krwToJpy(155000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-01-20",
  },
  SV1S: {
    code: "SV1S", releasedKR: true,
    packPriceKR: 3200, boxPriceKR: 95000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-04-21",
    nameKR_full: "바이올렛 ex",
    packPriceJPY: krwToJpy(5500), boxPriceJPY: krwToJpy(155000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-01-20",
  },
  SV1a: {
    code: "SV1a", releasedKR: true,
    packPriceKR: 2500, boxPriceKR: 75000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-06-23",
    nameKR_full: "트리플렛 비트",
    packPriceJPY: krwToJpy(3500), boxPriceJPY: krwToJpy(95000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-03-10",
  },
  SV2D: {
    code: "SV2D", releasedKR: true,
    packPriceKR: 2400, boxPriceKR: 72000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-07-21",
    nameKR_full: "클레이 버스트",
    packPriceJPY: krwToJpy(3200), boxPriceJPY: krwToJpy(84000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-04-14",
  },
  SV2P: {
    code: "SV2P", releasedKR: true,
    packPriceKR: 2400, boxPriceKR: 72000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-07-21",
    nameKR_full: "스노우 해저드",
    packPriceJPY: krwToJpy(3200), boxPriceJPY: krwToJpy(84000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-04-14",
  },
  SV2a: {
    code: "SV2a", releasedKR: true,
    packPriceKR: 14000, boxPriceKR: 280000, msrpPackKR: 5500, msrpBoxKR: 110000, releaseKR: "2023-09-22",
    nameKR_full: "포켓몬 카드 151",
    packPriceJPY: krwToJpy(28000), boxPriceJPY: krwToJpy(500000), msrpPackJPY: 550, msrpBoxJPY: 11000, releaseJP: "2023-06-16",
  },
  SV3: {
    code: "SV3", releasedKR: true,
    packPriceKR: 4000, boxPriceKR: 120000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-10-27",
    nameKR_full: "흑염의 지배자",
    packPriceJPY: krwToJpy(6500), boxPriceJPY: krwToJpy(175000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-07-28",
  },
  SV3a: {
    code: "SV3a", releasedKR: true,
    packPriceKR: 2400, boxPriceKR: 70000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2023-11-24",
    nameKR_full: "레이징 서프",
    packPriceJPY: krwToJpy(3300), boxPriceJPY: krwToJpy(90000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-09-22",
  },
  SV4K: {
    code: "SV4K", releasedKR: true,
    packPriceKR: 2100, boxPriceKR: 62000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-01-26",
    nameKR_full: "고대의 포효",
    packPriceJPY: krwToJpy(3000), boxPriceJPY: krwToJpy(80000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-10-27",
  },
  SV4M: {
    code: "SV4M", releasedKR: true,
    packPriceKR: 2100, boxPriceKR: 62000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-01-26",
    nameKR_full: "미래의 일섬",
    packPriceJPY: krwToJpy(3000), boxPriceJPY: krwToJpy(80000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2023-10-27",
  },
  SV4a: {
    code: "SV4a", releasedKR: true,
    packPriceKR: 8500, boxPriceKR: 165000, msrpPackKR: 5500, msrpBoxKR: 110000, releaseKR: "2024-03-15",
    nameKR_full: "샤이니 트레저 ex",
    packPriceJPY: krwToJpy(12000), boxPriceJPY: krwToJpy(220000), msrpPackJPY: 550, msrpBoxJPY: 5500, releaseJP: "2023-12-01",
  },
  SV5K: {
    code: "SV5K", releasedKR: true,
    packPriceKR: 2000, boxPriceKR: 58000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-04-26",
    nameKR_full: "와일드 포스",
    packPriceJPY: krwToJpy(2800), boxPriceJPY: krwToJpy(75000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-01-26",
  },
  SV5M: {
    code: "SV5M", releasedKR: true,
    packPriceKR: 2000, boxPriceKR: 58000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-04-26",
    nameKR_full: "사이버 저지",
    packPriceJPY: krwToJpy(2800), boxPriceJPY: krwToJpy(75000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-01-26",
  },
  SV5a: {
    code: "SV5a", releasedKR: true,
    packPriceKR: 2300, boxPriceKR: 68000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-06-21",
    nameKR_full: "크림슨 헤이즈",
    packPriceJPY: krwToJpy(3300), boxPriceJPY: krwToJpy(90000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-03-22",
  },
  SV6: {
    code: "SV6", releasedKR: true,
    packPriceKR: 2100, boxPriceKR: 60000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-08-30",
    nameKR_full: "변환의 가면",
    packPriceJPY: krwToJpy(3300), boxPriceJPY: krwToJpy(90000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-04-26",
  },
  SV6a: {
    code: "SV6a", releasedKR: true,
    packPriceKR: 3000, boxPriceKR: 88000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-09-27",
    nameKR_full: "나이트 원더러",
    packPriceJPY: krwToJpy(4500), boxPriceJPY: krwToJpy(120000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-06-07",
  },
  SV7: {
    code: "SV7", releasedKR: true,
    packPriceKR: 2300, boxPriceKR: 65000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-11-15",
    nameKR_full: "스텔라 미라클",
    packPriceJPY: krwToJpy(3700), boxPriceJPY: krwToJpy(100000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-07-19",
  },
  SV7a: {
    code: "SV7a", releasedKR: true,
    packPriceKR: 2700, boxPriceKR: 78000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2024-12-13",
    nameKR_full: "패러다임 트리거",
    packPriceJPY: krwToJpy(4500), boxPriceJPY: krwToJpy(125000), msrpPackJPY: 165, msrpBoxJPY: 4950, releaseJP: "2024-09-13",
  },
  SV8: {
    code: "SV8", releasedKR: true,
    packPriceKR: 2400, boxPriceKR: 70000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2025-02-21",
    nameKR_full: "초전 브레이커",
    packPriceJPY: krwToJpy(3800), boxPriceJPY: krwToJpy(105000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2024-10-18",
  },
  SV8a: {
    code: "SV8a", releasedKR: true,
    packPriceKR: 7500, boxPriceKR: 145000, msrpPackKR: 5500, msrpBoxKR: 110000, releaseKR: "2025-04-25",
    nameKR_full: "테라스탈 페스티벌 ex",
    packPriceJPY: krwToJpy(9500), boxPriceJPY: krwToJpy(180000), msrpPackJPY: 550, msrpBoxJPY: 5500, releaseJP: "2024-12-06",
  },
  SV9: {
    code: "SV9", releasedKR: true,
    packPriceKR: 3200, boxPriceKR: 95000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2025-06-20",
    nameKR_full: "배틀 파트너즈",
    packPriceJPY: krwToJpy(4500), boxPriceJPY: krwToJpy(125000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2025-01-24",
  },
  SV9a: {
    code: "SV9a", releasedKR: true,
    packPriceKR: 4500, boxPriceKR: 135000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2025-07-25",
    nameKR_full: "열풍의 아레나",
    packPriceJPY: krwToJpy(6500), boxPriceJPY: krwToJpy(175000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2025-03-14",
  },
  SV10: {
    code: "SV10", releasedKR: true,
    packPriceKR: 3700, boxPriceKR: 110000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2025-09-19",
    nameKR_full: "로켓단의 영광",
    packPriceJPY: krwToJpy(6000), boxPriceJPY: krwToJpy(165000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2025-05-30",
  },
  SV11W: {
    code: "SV11W", releasedKR: true,
    packPriceKR: 3500, boxPriceKR: 105000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2026-02-27",
    nameKR_full: "화이트 플레어",
    packPriceJPY: krwToJpy(5500), boxPriceJPY: krwToJpy(145000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2025-11-28",
  },
  SV11B: {
    code: "SV11B", releasedKR: true,
    packPriceKR: 4200, boxPriceKR: 125000, msrpPackKR: 2200, msrpBoxKR: 66000, releaseKR: "2026-02-27",
    nameKR_full: "블랙 볼트",
    packPriceJPY: krwToJpy(6500), boxPriceJPY: krwToJpy(175000), msrpPackJPY: 180, msrpBoxJPY: 5400, releaseJP: "2025-11-28",
  },
};

// 환율 (JPY → KRW)
export const JPY_TO_KRW = 9.5;

// PSA10 가격 추정 multiplier (raw 시세 대비)
export const PSA10_MULTIPLIER: Record<string, number> = {
  SAR: 2.6, MUR: 2.4, MA: 2.0, AR: 1.8, UR: 2.8,
  SR: 2.2, SIR: 2.5, HR: 2.3, CHR: 1.6, CSR: 2.0, RR: 1.4, RRR: 1.5,
  R: 1.2, U: 1.0, C: 1.0,
};

export const RAW_PRICE_BY_RARITY: Record<string, number> = {
  SAR: 25000, MUR: 35000, MA: 12000, AR: 3500, UR: 18000,
  SR: 8000, SIR: 20000, HR: 22000, CHR: 6000, CSR: 9000, RR: 1500, RRR: 2200,
  R: 300, U: 100, C: 50,
};
