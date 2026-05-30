import { getAllSets, getEnrichedCards, getBoxImage, getSetExtra } from "@/lib/sets";
import SearchableGrid, { type SetCardItem } from "@/components/SearchableGrid";

export default function HomePage() {
  // 각 세트를 [일판] + (있으면) [한판] 두 카드로 분할
  const sets: SetCardItem[] = [];
  for (const s of getAllSets()) {
    const enriched = getEnrichedCards(s.code);
    const extra = getSetExtra(s.code);
    const hitJP = enriched.filter(c => c.edition === "JP" && c.rank >= 60).length;
    const hitKR = enriched.filter(c => c.edition === "KR" && c.rank >= 60).length;
    const boxImg = getBoxImage(s.code);

    // 일판은 항상
    sets.push({
      ...s,
      edition: "JP",
      hitCount: hitJP,
      boxImage: boxImg,
      packPriceKR: extra?.packPriceKR,
      boxPriceKR: extra?.boxPriceKR,
      packPriceJPY: extra?.packPriceJPY ?? 165,
      boxPriceJPY: extra?.boxPriceJPY ?? 4950,
      msrpPackKR: extra?.msrpPackKR,
      msrpBoxKR: extra?.msrpBoxKR,
      msrpPackJPY: extra?.msrpPackJPY,
      msrpBoxJPY: extra?.msrpBoxJPY,
      releasedKR: extra?.releasedKR ?? false,
      releaseJP: extra?.releaseJP ?? "",
      releaseKR: extra?.releaseKR,
      nameKR_full: extra?.nameKR_full,
    });

    // 한판은 발매된 세트만
    if (extra?.releasedKR) {
      sets.push({
        ...s,
        edition: "KR",
        hitCount: hitKR,
        boxImage: boxImg,
        packPriceKR: extra?.packPriceKR,
        boxPriceKR: extra?.boxPriceKR,
        packPriceJPY: extra?.packPriceJPY ?? 165,
        boxPriceJPY: extra?.boxPriceJPY ?? 4950,
        msrpPackKR: extra?.msrpPackKR,
        msrpBoxKR: extra?.msrpBoxKR,
        msrpPackJPY: extra?.msrpPackJPY,
        msrpBoxJPY: extra?.msrpBoxJPY,
        releasedKR: true,
        releaseJP: extra?.releaseJP ?? "",
        releaseKR: extra?.releaseKR,
        nameKR_full: extra?.nameKR_full,
      });
    }
  }

  // 정렬: 신상이 위로, 같은 세트는 [한판] → [일판] 순
  sets.sort((a, b) => {
    const d = (b.releaseJP || "").localeCompare(a.releaseJP || "");
    if (d !== 0) return d;
    return a.edition === "KR" ? -1 : 1;
  });

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <header className="mb-10">
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-[40px] sm:text-[56px] font-black tracking-tight leading-none">
            서치<span className="text-[var(--accent)]">몬</span>
          </div>
          <div className="text-[12px] text-white/40 tracking-widest">SEARCHMON</div>
        </div>
        <p className="text-[14px] sm:text-[16px] text-white/60 max-w-xl leading-relaxed">
          <span className="text-[#FFD400] font-bold">[일판]</span> ·{" "}
          <span className="text-[#5BC0FF] font-bold">[한판]</span> 모든 SV 시리즈 팩과{" "}
          <span className="text-[var(--accent)] font-bold">힛카드 시세</span>를 한눈에.
        </p>
      </header>

      <SearchableGrid sets={sets} />

      <footer className="mt-20 text-center text-[12px] text-white/30 space-y-1">
        <div>데이터: tcgdex · Limitless TCG · 박스: Bulbapedia</div>
        <div>시세: 일판=Mercari / 한판=번개장터 (PSA10 추정)</div>
      </footer>
    </main>
  );
}
