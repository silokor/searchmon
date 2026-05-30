import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getAllSets, getSetCards, getSetMeta, getHitCards,
  getBoxImage, getSetExtra, mercariUrl,
  formatKRW, formatJPY,
  type CardEnriched,
} from "@/lib/sets";

export async function generateStaticParams() {
  return getAllSets().map((s) => ({ code: s.code }));
}

export default async function SetPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const meta = getSetMeta(code);
  if (!meta) notFound();
  const extra = getSetExtra(code);

  const all = getSetCards(code);
  const hits = getHitCards(all);
  const boxImg = getBoxImage(code);

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white mb-8 transition-colors">
        ← 전체 팩
      </Link>

      {/* Header */}
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

      {/* 힛카드 */}
      {hits.length > 0 ? (
        <section>
          <h2 className="text-[20px] sm:text-[24px] font-black mb-1">
            <span className="text-[var(--accent)]">★</span> 힛카드 <span className="text-white/40 font-normal text-[16px]">({hits.length})</span>
          </h2>
          <p className="text-[12px] text-white/40 mb-6">가격은 PSA10 등급 추정 · 클릭하면 Mercari 일본 실거래로 이동</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {hits.map((c) => (
              <HitCardTile key={c.num} setCode={meta.code} card={c} />
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-20 text-white/40">
          힛카드 데이터 없음
        </div>
      )}
    </main>
  );
}

function HitCardTile({ setCode, card }: { setCode: string; card: CardEnriched }) {
  const src = card.imageUrl || "";
  const isTopTier = card.rank >= 85;

  return (
    <a
      href={mercariUrl(setCode, card.name, card.num, true)}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5 group"
    >
      <div className="relative aspect-[5/7] bg-black/40 overflow-hidden">
        {src ? (
          <Image
            src={src}
            alt={card.name || `#${card.num}`}
            fill
            sizes="(max-width: 640px) 50vw, 20vw"
            className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[11px]">no image</div>
        )}
        {card.rarity && (
          <span
            className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded text-black tracking-wider"
            style={{ background: isTopTier ? "var(--accent-2)" : "var(--accent)" }}
          >
            {card.rarity}
          </span>
        )}
      </div>
      <div className="p-3">
        <div className="text-[10px] text-white/30 mb-0.5">#{card.num}</div>
        <div className="text-[13px] font-bold truncate mb-2">{card.name || "—"}</div>

        {/* PSA10 가격 */}
        <div className="bg-white/5 rounded-lg px-2.5 py-2">
          <div className="text-[9px] text-white/30 tracking-wider mb-0.5">PSA10 추정가</div>
          <div className="text-[15px] font-black leading-tight">{formatKRW(card.psa10KRW)}</div>
          <div className="text-[11px] text-white/50">{formatJPY(card.psa10JPY)}</div>
        </div>
      </div>
    </a>
  );
}
