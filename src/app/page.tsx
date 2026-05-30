import { getAllSets, getEnrichedCards, getHitCards, getBoxImage, getSetExtra } from "@/lib/sets";
import SearchableGrid from "@/components/SearchableGrid";

export default function HomePage() {
  const sets = getAllSets().map((s) => {
    const enriched = getEnrichedCards(s.code);
    const hits = getHitCards(enriched);
    const extra = getSetExtra(s.code);
    return {
      ...s,
      hitCount: hits.length,
      boxImage: getBoxImage(s.code),
      packPriceKR: extra?.packPriceKR,
      boxPriceKR: extra?.boxPriceKR,
      packPriceJPY: extra?.packPriceJPY ?? 165,
      boxPriceJPY: extra?.boxPriceJPY ?? 4950,
      releasedKR: extra?.releasedKR ?? false,
      releaseJP: extra?.releaseJP ?? "",
      nameKR_full: extra?.nameKR_full,
    };
  });

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-12">
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-[44px] sm:text-[64px] font-black tracking-tight leading-none">
            서치<span className="text-[var(--accent)]">몬</span>
          </div>
          <div className="text-[13px] text-white/40 tracking-widest">SEARCHMON</div>
        </div>
        <p className="text-[15px] sm:text-[17px] text-white/60 max-w-xl leading-relaxed">
          일본판 포켓몬 카드, 2023년부터 지금까지.<br />
          팩 안의 <span className="text-[var(--accent)] font-bold">힛카드</span>와 시세를 한눈에.
        </p>
      </header>

      <SearchableGrid sets={sets} />

      <footer className="mt-20 text-center text-[12px] text-white/30 space-y-1">
        <div>데이터: Limitless TCG · 박스 이미지: Bulbapedia · 시세 링크: Mercari</div>
        <div>가격은 PSA10 등급 추정치 (실거래는 카드 클릭 → Mercari 확인)</div>
      </footer>
    </main>
  );
}
