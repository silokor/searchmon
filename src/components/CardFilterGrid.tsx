"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import type { CardEnriched } from "@/lib/types";
import { mercariUrl, formatKRW, formatJPY } from "@/lib/types";

type SortKey = "price-desc" | "price-asc" | "rarity-desc" | "num-asc" | "num-desc";

const RARITY_GROUPS = [
  { key: "S+", label: "최상급 (UR/SAR/MUR/SIR)", rarities: ["UR", "SAR", "MUR", "SIR"] },
  { key: "S",  label: "상급 (HR/MA/SR)",        rarities: ["HR", "MA", "SR"] },
  { key: "A",  label: "중상급 (CSR/CHR/AR)",     rarities: ["CSR", "CHR", "AR"] },
  { key: "B",  label: "고일반 (RRR/RR)",         rarities: ["RRR", "RR"] },
];

export default function CardFilterGrid({ setCode, cards }: { setCode: string; cards: CardEnriched[] }) {
  const [sort, setSort] = useState<SortKey>("price-desc");
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = cards;
    if (activeGroups.size > 0) {
      const allowed = new Set<string>();
      RARITY_GROUPS.forEach(g => { if (activeGroups.has(g.key)) g.rarities.forEach(x => allowed.add(x)); });
      r = r.filter(c => c.rarity && allowed.has(c.rarity));
    }
    if (q.trim()) {
      const k = q.trim().toLowerCase();
      r = r.filter(c => (c.name?.toLowerCase().includes(k)) || String(c.num).includes(k));
    }
    const sorted = [...r];
    sorted.sort((a, b) => {
      switch (sort) {
        case "price-desc": return b.psa10JPY - a.psa10JPY || b.rank - a.rank;
        case "price-asc":  return a.psa10JPY - b.psa10JPY || a.rank - b.rank;
        case "rarity-desc": return b.rank - a.rank || b.psa10JPY - a.psa10JPY;
        case "num-asc":    return (a.num as number) - (b.num as number);
        case "num-desc":   return (b.num as number) - (a.num as number);
      }
    });
    return sorted;
  }, [cards, activeGroups, sort, q]);

  const toggleGroup = (k: string) => {
    setActiveGroups(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  return (
    <>
      {/* 필터 바 */}
      <div className="mb-5 flex flex-wrap items-center gap-2 sm:gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="카드명 / 넘버 검색"
          className="flex-1 min-w-[180px] bg-[var(--bg-elev)] border border-white/10 rounded-xl px-4 py-2.5 text-[13px] placeholder-white/30 focus:outline-none focus:border-[var(--accent)]/60"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="bg-[var(--bg-elev)] border border-white/10 rounded-xl px-3 py-2.5 text-[13px] focus:outline-none cursor-pointer"
        >
          <option value="price-desc">가격 높은순</option>
          <option value="price-asc">가격 낮은순</option>
          <option value="rarity-desc">레어도순</option>
          <option value="num-asc">번호 ↑</option>
          <option value="num-desc">번호 ↓</option>
        </select>
      </div>

      {/* 레어도 필터 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveGroups(new Set())}
          className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${activeGroups.size === 0 ? "bg-[var(--accent)] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
        >
          전체 {cards.length}
        </button>
        {RARITY_GROUPS.map(g => {
          const count = cards.filter(c => c.rarity && g.rarities.includes(c.rarity)).length;
          if (count === 0) return null;
          const active = activeGroups.has(g.key);
          return (
            <button
              key={g.key}
              onClick={() => toggleGroup(g.key)}
              title={g.label}
              className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${active ? "bg-[var(--accent)] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
            >
              {g.key} {count}
            </button>
          );
        })}
      </div>

      {/* 결과 카운트 */}
      <div className="mb-4 text-[12px] text-white/40">
        {filtered.length}장 표시
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {filtered.map((c) => (
          <a
            key={c.num}
            href={mercariUrl(setCode, c.name, c.num as number, true)}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover block bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5 group"
          >
            <div className="relative aspect-[5/7] bg-black/40 overflow-hidden">
              {c.imageUrl ? (
                <Image
                  src={c.imageUrl}
                  alt={c.name || `#${c.num}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[11px]">no image</div>
              )}
              {c.rarity && (
                <span
                  className="absolute top-2 right-2 text-[10px] font-black px-2 py-0.5 rounded text-black tracking-wider"
                  style={{ background: c.rank >= 85 ? "var(--accent-2)" : "var(--accent)" }}
                >
                  {c.rarity}
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="text-[10px] text-white/30 mb-0.5">#{c.num}</div>
              <div className="text-[13px] font-bold truncate mb-2">{c.name || "—"}</div>
              <div className="bg-white/5 rounded-lg px-2.5 py-2">
                <div className="text-[9px] text-white/30 tracking-wider mb-0.5">PSA10 추정가</div>
                <div className="text-[15px] font-black leading-tight">{formatKRW(c.psa10KRW)}</div>
                <div className="text-[11px] text-white/50">{formatJPY(c.psa10JPY)}</div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40 text-[14px]">
          조건에 맞는 카드 없음
        </div>
      )}
    </>
  );
}
