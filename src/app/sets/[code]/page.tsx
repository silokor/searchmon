import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllSets, getSetCards, getSetMeta, getHitCards,
  getBoxImage, getSetExtra, enrichCard,
} from "@/lib/sets";
import CardFilterGrid from "@/components/CardFilterGrid";

export async function generateStaticParams() {
  return getAllSets().map((s) => ({ code: s.code }));
}

export default async function SetPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const meta = getSetMeta(code);
  if (!meta) notFound();
  const extra = getSetExtra(code);

  const all = getSetCards(code);
  const enriched = all.map(enrichCard);
  const hits = getHitCards(all);
  const boxImg = getBoxImage(code);

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white mb-8 transition-colors">
        ← 전체 팩
      </Link>

      {/* Header — Pack House 정보 박스 스타일 차용 */}
      <header className="mb-14 grid sm:grid-cols-[280px_1fr] gap-8 items-center">
        <div className="bg-gradient-to-br from-white/5 to-black/30 rounded-2xl p-6 aspect-[5/4] flex items-center justify-center border border-white/5">
          {boxImg ? (
            <Image
              src={boxImg}
              alt={meta.name_ko}
              width={300}
              height={300}
              className="w-auto max-h-[90%] max-w-[90%] object-contain drop-shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
              unoptimized
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
          <div className="text-[11px] text-white/30 tracking-widest mb-2">{meta.code}</div>
          <h1 className="text-[28px] sm:text-[40px] font-black leading-tight mb-1">
            {extra?.nameKR_full || meta.name_ko}
          </h1>
          <p className="text-[14px] sm:text-[16px] text-white/50 mb-5">{meta.name_ja}</p>

          {!extra?.releasedKR && (
            <div className="inline-block mb-4 px-3 py-1.5 rounded-full bg-yellow-500/15 text-yellow-300 text-[12px] font-bold border border-yellow-500/30">
              한국 미발매
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 max-w-[440px]">
            <div className="bg-[var(--bg-elev)] rounded-xl px-4 py-3 border border-white/5">
              <div className="text-[11px] text-white/40 mb-1">1팩 정가</div>
              <div className="text-[18px] font-black">
                {extra?.packPriceKR ? `₩${extra.packPriceKR.toLocaleString()}` : <span className="text-white/30">—</span>}
              </div>
              <div className="text-[12px] text-white/40">¥{extra?.packPriceJPY ?? "?"}</div>
            </div>
            <div className="bg-[var(--bg-elev)] rounded-xl px-4 py-3 border border-white/5">
              <div className="text-[11px] text-white/40 mb-1">1박스 정가</div>
              <div className="text-[18px] font-black">
                {extra?.boxPriceKR ? `₩${extra.boxPriceKR.toLocaleString()}` : <span className="text-white/30">—</span>}
              </div>
              <div className="text-[12px] text-white/40">¥{extra?.boxPriceJPY.toLocaleString() ?? "?"}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-white/40">
            <div>총 <span className="text-white/80 font-bold">{all.length}</span>장</div>
            <div className="text-[var(--accent)]">★ 힛카드 <span className="font-bold">{hits.length}</span>장</div>
            {extra?.releaseJP && <div>일본 발매 {extra.releaseJP}</div>}
            {extra?.releaseKR && <div>한국 발매 {extra.releaseKR}</div>}
          </div>
        </div>
      </header>

      {/* 카드 그리드 (필터 + 정렬) */}
      <section>
        <h2 className="text-[20px] sm:text-[24px] font-black mb-1">카드</h2>
        <p className="text-[12px] text-white/40 mb-6">PSA10 추정가 · 클릭 → Mercari 일본 실거래</p>
        <CardFilterGrid setCode={meta.code} cards={enriched} />
      </section>
    </main>
  );
}
