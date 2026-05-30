"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { SetIndexEntry } from "@/lib/sets";

export default function SearchableGrid({ sets }: { sets: SetIndexEntry[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return sets;
    return sets.filter((s) =>
      s.code.toLowerCase().includes(k) ||
      s.name_ko.toLowerCase().includes(k) ||
      s.name_ja.toLowerCase().includes(k) ||
      (s.name_full?.toLowerCase().includes(k) ?? false)
    );
  }, [sets, q]);

  return (
    <>
      {/* Search */}
      <div className="mb-8 relative">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="팩 이름 / 코드 검색 (예: 메가, SV10, 151)"
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

      {/* Result count */}
      <div className="flex justify-between items-baseline mb-6 text-[13px] text-white/40">
        <div>
          <span className="text-white/90 font-bold text-[18px]">{filtered.length}</span> 팩
          <span className="mx-2">·</span>
          <span className="text-white/90 font-bold text-[18px]">{filtered.reduce((a, s) => a + s.cardCount, 0).toLocaleString()}</span> 장
        </div>
        {q && <div>"{q}" 검색 결과</div>}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {filtered.map((s) => (
          <Link
            key={s.code}
            href={`/sets/${s.code}`}
            className="card-hover group block bg-[var(--bg-elev)] rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center p-6">
              <Image
                src={`/images/sets/${s.code}.png`}
                alt={s.name_ko}
                width={300}
                height={120}
                className="w-auto h-auto max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)]"
                unoptimized
              />
            </div>
            <div className="p-4">
              <div className="text-[11px] text-white/30 tracking-widest mb-1">{s.code}</div>
              <div className="text-[14px] sm:text-[15px] font-bold leading-snug mb-1">{s.name_ko}</div>
              <div className="text-[11px] text-white/40">{s.cardCount}장</div>
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
