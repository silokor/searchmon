"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SetIndexEntry } from "@/lib/sets";

type Props = {
  sets: (SetIndexEntry & {
    hitCount: number;
    boxImage: string | null;
    packPriceKR?: number;
    boxPriceKR?: number;
    packPriceJPY: number;
    boxPriceJPY: number;
    releasedKR: boolean;
    releaseJP: string;
    nameKR_full?: string;
  })[];
};

export default function SearchableGrid({ sets }: Props) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return sets;
    return sets.filter((s) =>
      s.code.toLowerCase().includes(k) ||
      s.name_ko.toLowerCase().includes(k) ||
      s.name_ja.toLowerCase().includes(k) ||
      (s.nameKR_full?.toLowerCase().includes(k) ?? false) ||
      (s.name_full?.toLowerCase().includes(k) ?? false)
    );
  }, [sets, q]);

  return (
    <>
      <div className="mb-8 relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="팩 이름 / 코드 검색 (예: 메가, 151, SV10)"
          className="w-full bg-[var(--bg-elev)] border border-white/10 rounded-2xl px-5 py-4 text-[15px] placeholder-white/30 focus:outline-none focus:border-[var(--accent)]/60 transition-colors"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-[13px]"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex justify-between items-baseline mb-6 text-[13px] text-white/40">
        <div>
          <span className="text-white/90 font-bold text-[18px]">{filtered.length}</span> 팩
          <span className="mx-2">·</span>
          <span className="text-white/90 font-bold text-[18px]">{filtered.reduce((a, s) => a + s.hitCount, 0)}</span> 힛카드
        </div>
        {q && <div>"{q}" 검색</div>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        {filtered.map((s) => (
          <Link
            key={s.code}
            href={`/sets/${s.code}`}
            className="card-hover group block bg-[var(--bg-elev)] rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="relative aspect-[5/4] bg-gradient-to-br from-white/5 to-black/30 flex items-center justify-center p-5">
              {s.boxImage ? (
                <Image
                  src={s.boxImage}
                  alt={s.name_ko}
                  width={200}
                  height={200}
                  className="w-auto max-h-[90%] max-w-[80%] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
                  unoptimized
                />
              ) : (
                <Image
                  src={`/images/sets/${s.code}.png`}
                  alt={s.name_ko}
                  width={200}
                  height={100}
                  className="w-auto max-h-[60%] max-w-[80%] object-contain opacity-80"
                  unoptimized
                />
              )}
              {!s.releasedKR && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  KR 미발매
                </span>
              )}
            </div>
            <div className="p-4 border-t border-white/5">
              <div className="text-[11px] text-white/30 tracking-widest mb-1">{s.code}</div>
              <div className="text-[15px] font-bold leading-snug mb-2">{s.nameKR_full || s.name_ko}</div>
              <div className="text-[11px] text-white/40 mb-3">{s.name_ja.replace(/^SV\d+[a-zA-Z]*\s*/, "")}</div>

              {/* 가격 */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white/5 rounded-lg px-2.5 py-2">
                  <div className="text-white/30 mb-0.5">팩 (1팩)</div>
                  {s.packPriceKR ? (
                    <div className="text-white font-bold">₩{s.packPriceKR.toLocaleString()}</div>
                  ) : (
                    <div className="text-white/40">—</div>
                  )}
                  <div className="text-white/40">¥{s.packPriceJPY}</div>
                </div>
                <div className="bg-white/5 rounded-lg px-2.5 py-2">
                  <div className="text-white/30 mb-0.5">박스 (30팩)</div>
                  {s.boxPriceKR ? (
                    <div className="text-white font-bold">₩{s.boxPriceKR.toLocaleString()}</div>
                  ) : (
                    <div className="text-white/40">—</div>
                  )}
                  <div className="text-white/40">¥{s.boxPriceJPY.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-[10px] text-white/30">
                <span className="text-[var(--accent)]">★ {s.hitCount}</span>
                <span>· 발매 {s.releaseJP}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40 text-[14px]">
          검색 결과 없음
        </div>
      )}
    </>
  );
}
