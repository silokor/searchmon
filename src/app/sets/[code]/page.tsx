import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/SmartImage";
import { notFound } from "next/navigation";
import {
  getAllSets, getSetMeta, getEnrichedCards, getHitCards,
  getBoxImage, getSetExtra,
} from "@/lib/sets";
import CardFilterGrid from "@/components/CardFilterGrid";

export async function generateStaticParams() {
  return getAllSets().map((s) => ({ code: s.code }));
}

export default async function SetPage({ params, searchParams }: { params: Promise<{ code: string }>; searchParams: Promise<{ edition?: string }> }) {
  const { code } = await params;
  const sp = await searchParams;
  const editionParam = sp.edition === "KR" || sp.edition === "JP" ? sp.edition : null;
  const meta = getSetMeta(code);
  if (!meta) notFound();
  const extra = getSetExtra(code);

  let enriched = getEnrichedCards(code);
  // edition 쿼리가 있으면 해당 에디션만
  if (editionParam) enriched = enriched.filter(c => c.edition === editionParam);
  const hits = getHitCards(enriched);
  const boxImg = getBoxImage(code);
  const totalUniqueCards = new Set(enriched.map(c => c.num)).size;
  const hasKR = extra?.releasedKR ?? false;
  const showJPKRFilter = !editionParam && hasKR;
  const focusEdition = editionParam as "JP" | "KR" | null;

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white mb-8 transition-colors">
        ← 전체 팩
      </Link>

      <header className="mb-14 grid sm:grid-cols-[280px_1fr] gap-8 items-center">
        <div className="bg-gradient-to-br from-white/5 to-black/30 rounded-2xl p-4 aspect-square flex items-center justify-center border border-white/5">
          {boxImg ? (
            <SmartImage
              src={boxImg}
              alt={meta.name_ko}
              width={300}
              height={300}
              containerClassName="w-[90%] h-[90%] flex items-center justify-center"
              className="w-auto max-h-full max-w-full object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
            />
          ) : (
            <Image
              src={`/images/sets/${meta.code}.png`}
              alt={meta.name_ko}
              width={250}
              height={120}
              className="w-auto max-h-[70%] object-contain opacity-80"
              unoptimized
            />
          )}
        </div>
        <div>
          <div className="text-[11px] text-white/30 tracking-widest mb-2">
            {meta.code}
            {focusEdition && (
              <span
                className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-black text-black"
                style={{ background: focusEdition === "JP" ? "#FFD400" : "#5BC0FF" }}
              >
                {focusEdition === "JP" ? "일판" : "한판"}
              </span>
            )}
          </div>
          <h1 className="text-[28px] sm:text-[40px] font-black leading-tight mb-1">
            {extra?.nameKR_full || meta.name_ko}
          </h1>
          <p className="text-[14px] sm:text-[16px] text-white/50 mb-5">{meta.name_full || meta.name_ja}</p>

          {!hasKR && (
            <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-300 text-[12px] font-bold border border-yellow-500/30">
              한국 미발매 (일판만)
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-[440px]">
            <div className="bg-[var(--bg-elev)] rounded-xl px-4 py-3 border border-white/5">
              <div className="text-[11px] text-white/40 mb-1">1팩 <span className="text-[var(--accent)] font-bold">리셀가</span></div>
              <div className="text-[18px] font-black">
                {extra?.packPriceKR ? `₩${extra.packPriceKR.toLocaleString()}` : <span className="text-white/30">—</span>}
              </div>
              <div className="text-[12px] text-white/40">¥{extra?.packPriceJPY ?? "?"} <span className="text-white/25">· 정가 ₩{extra?.msrpPackKR?.toLocaleString() ?? "—"}</span></div>
            </div>
            <div className="bg-[var(--bg-elev)] rounded-xl px-4 py-3 border border-white/5">
              <div className="text-[11px] text-white/40 mb-1">1박스 <span className="text-[var(--accent)] font-bold">리셀가</span></div>
              <div className="text-[18px] font-black">
                {extra?.boxPriceKR ? `₩${extra.boxPriceKR.toLocaleString()}` : <span className="text-white/30">—</span>}
              </div>
              <div className="text-[12px] text-white/40">¥{extra?.boxPriceJPY.toLocaleString() ?? "?"} <span className="text-white/25">· 정가 ₩{extra?.msrpBoxKR?.toLocaleString() ?? "—"}</span></div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/40">
            <div>고유 카드 <span className="text-white/80 font-bold">{totalUniqueCards}</span>종</div>
            <div className="text-[var(--accent)]">★ 힛카드 <span className="font-bold">{hits.length}</span>개</div>
            {hasKR && <div className="text-[#5BC0FF]">한판 발매</div>}
            {extra?.releaseJP && <div>일본 {extra.releaseJP}</div>}
            {extra?.releaseKR && <div>한국 {extra.releaseKR}</div>}
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-[20px] sm:text-[24px] font-black mb-1">카드</h2>
        <p className="text-[12px] text-white/40 mb-6">
          PSA10 추정가 · <span className="text-[#FFD400]">[일판]</span>·<span className="text-[#5BC0FF]">[한판]</span> 모두 번개장터 검색
        </p>
        <CardFilterGrid cards={enriched} hasKR={showJPKRFilter} />
      </section>
    </main>
  );
}
