import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllSets, getSetCards, getSetMeta, getHitCards, mercariUrl, rankRarity } from "@/lib/sets";

export async function generateStaticParams() {
  return getAllSets().map((s) => ({ code: s.code }));
}

export default async function SetPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const meta = getSetMeta(code);
  if (!meta) notFound();

  const all = getSetCards(code);
  const hits = getHitCards(all);

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-2 text-[13px] text-white/50 hover:text-white mb-8 transition-colors">
        ← 전체 팩
      </Link>

      {/* Header */}
      <header className="mb-12 grid sm:grid-cols-[200px_1fr] gap-8 items-center">
        <div className="bg-[var(--bg-elev)] rounded-2xl p-6 aspect-[4/3] flex items-center justify-center border border-white/5">
          <Image
            src={`/images/sets/${meta.code}.png`}
            alt={meta.name_ko}
            width={300}
            height={150}
            className="w-auto h-auto max-h-[80%] max-w-[90%] object-contain"
            unoptimized
          />
        </div>
        <div>
          <div className="text-[11px] text-white/30 tracking-widest mb-2">{meta.code}</div>
          <h1 className="text-[28px] sm:text-[40px] font-black leading-tight mb-2">{meta.name_ko}</h1>
          <p className="text-[14px] sm:text-[16px] text-white/50 mb-4">{meta.name_ja}</p>
          <div className="flex gap-6 text-[13px] text-white/40">
            <div><span className="text-white/90 font-bold">{all.length}</span> 장</div>
            <div><span className="text-[var(--accent)] font-bold">{hits.length}</span> 힛카드</div>
          </div>
        </div>
      </header>

      {/* Hit cards (rare 60+) */}
      {hits.length > 0 && (
        <section className="mb-16">
          <h2 className="text-[20px] sm:text-[24px] font-black mb-6">
            <span className="text-[var(--accent)]">★</span> 힛카드
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
            {hits.map((c) => (
              <CardTile key={c.num} setCode={meta.code} card={c} />
            ))}
          </div>
        </section>
      )}

      {/* All cards */}
      <section>
        <h2 className="text-[20px] sm:text-[24px] font-black mb-6 text-white/70">전체 카드</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {all.map((c) => (
            <CardTile key={c.num} setCode={meta.code} card={c} compact />
          ))}
        </div>
      </section>
    </main>
  );
}

function CardTile({ setCode, card, compact = false }: { setCode: string; card: { num: number; name: string | null; rarity: string | null; imageUrl: string | null }; compact?: boolean }) {
  const rank = rankRarity(card.rarity);
  const isHit = rank >= 60;
  // CDN 직접 사용 — git/vercel 부담 X
  const src = card.imageUrl || `/images/cards/${setCode}/${card.num}.png`;

  return (
    <a
      href={mercariUrl(setCode, card.name, card.num, isHit)}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5 group"
    >
      <div className="relative aspect-[5/7] bg-black/40">
        <Image
          src={src}
          alt={card.name || `#${card.num}`}
          fill
          sizes="(max-width: 640px) 33vw, 20vw"
          className="object-contain p-1"
          unoptimized
        />
        {isHit && card.rarity && (
          <span
            className="absolute top-1.5 right-1.5 text-[9px] font-black px-1.5 py-0.5 rounded text-black"
            style={{ background: rank >= 90 ? "var(--accent-2)" : "var(--accent)" }}
          >
            {card.rarity}
          </span>
        )}
      </div>
      {!compact && (
        <div className="p-2">
          <div className="text-[11px] text-white/30">#{card.num}</div>
          <div className="text-[12px] font-bold truncate">{card.name || "—"}</div>
        </div>
      )}
    </a>
  );
}
