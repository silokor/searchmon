"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import type { CardEnriched, Edition } from "@/lib/types";
import { formatKRW, formatJPY } from "@/lib/types";

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && <div className="absolute inset-0 skeleton" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 20vw"
        className={`object-contain p-1.5 group-hover:scale-105 transition-transform duration-500 ${loaded ? "img-fade" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        unoptimized
      />
    </>
  );
}

type SortKey = "price-desc" | "price-asc" | "rarity-desc" | "num-asc" | "num-desc";
type EditionFilter = "all" | "JP" | "KR";

const RARITY_GROUPS = [
  { key: "S+", label: "최상급 UR/SAR/MUR/SIR/BWR", rarities: ["UR", "SAR", "MUR", "SIR", "BWR"] },
  { key: "S",  label: "상급 HR/MA/SR",            rarities: ["HR", "MA", "SR"] },
  { key: "A",  label: "중상급 CSR/CHR/AR",        rarities: ["CSR", "CHR", "AR"] },
  { key: "B",  label: "고일반 RRR/RR",            rarities: ["RRR", "RR"] },
];

export default function CardFilterGrid({ cards, hasKR }: { cards: CardEnriched[]; hasKR: boolean }) {
  const [sort, setSort] = useState<SortKey>("price-desc");
  const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set());
  const [edition, setEdition] = useState<EditionFilter>("all");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    let r = cards;
    if (edition !== "all") r = r.filter(c => c.edition === edition);
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
        case "price-desc": {
          const ap = a.edition === "KR" ? a.psa10KRPrice : a.psa10KRW;
          const bp = b.edition === "KR" ? b.psa10KRPrice : b.psa10KRW;
          return bp - ap || b.rank - a.rank;
        }
        case "price-asc": {
          const ap = a.edition === "KR" ? a.psa10KRPrice : a.psa10KRW;
          const bp = b.edition === "KR" ? b.psa10KRPrice : b.psa10KRW;
          return ap - bp || a.rank - b.rank;
        }
        case "rarity-desc": return b.rank - a.rank || b.psa10JPY - a.psa10JPY;
        case "num-asc":     return (a.num as number) - (b.num as number);
        case "num-desc":    return (b.num as number) - (a.num as number);
      }
    });
    return sorted;
  }, [cards, activeGroups, sort, q, edition]);

  const toggleGroup = (k: string) => {
    setActiveGroups(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  };

  return (
    <>
      {/* 검색 + 정렬 */}
      <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
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

      {/* 일판/한판 필터 */}
      {hasKR && (
        <div className="mb-3 flex gap-2">
          <FilterChip active={edition === "all"} onClick={() => setEdition("all")}>전체</FilterChip>
          <FilterChip active={edition === "JP"} onClick={() => setEdition("JP")}>🇯🇵 일판만</FilterChip>
          <FilterChip active={edition === "KR"} onClick={() => setEdition("KR")}>🇰🇷 한판만</FilterChip>
        </div>
      )}

      {/* 레어도 필터 */}
      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={activeGroups.size === 0} onClick={() => setActiveGroups(new Set())}>
          전체 {cards.length}
        </FilterChip>
        {RARITY_GROUPS.map(g => {
          const count = cards.filter(c => c.rarity && g.rarities.includes(c.rarity)).length;
          if (count === 0) return null;
          const active = activeGroups.has(g.key);
          return (
            <FilterChip key={g.key} active={active} onClick={() => toggleGroup(g.key)} title={g.label}>
              {g.key} {count}
            </FilterChip>
          );
        })}
      </div>

      <div className="mb-4 text-[12px] text-white/40">
        {filtered.length}개 표시
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
        {filtered.map((c, i) => (
          <CardTile key={`${c.edition}-${c.num}-${i}`} card={c} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40 text-[14px]">조건에 맞는 카드 없음</div>
      )}
    </>
  );
}

function FilterChip({ active, onClick, children, title }: { active: boolean; onClick: () => void; children: React.ReactNode; title?: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${active ? "bg-[var(--accent)] text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}

function CardTile({ card: c }: { card: CardEnriched }) {
  const isJP = c.edition === "JP";
  const isTopTier = c.rank >= 85;
  const editionLabel = isJP ? "일판" : "한판";
  const editionColor = isJP ? "#FFD400" : "#5BC0FF";
  const price = isJP ? c.psa10KRW : c.psa10KRPrice;
  const baseName = c.name || `#${c.num}`;

  return (
    <a
      href={c.marketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover block bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5 group"
    >
      <div className="relative aspect-[3/4] bg-black/40 overflow-hidden">
        {c.imageUrl ? (
          <CardImage src={c.imageUrl} alt={baseName} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[11px]">no image</div>
        )}
        {/* 에디션 + rarity 뱃지 */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <span
            className="text-[9px] font-black px-1.5 py-0.5 rounded text-black tracking-wider"
            style={{ background: editionColor }}
          >
            {editionLabel}
          </span>
          {c.rarity && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded text-black tracking-wider"
              style={{ background: isTopTier ? "var(--accent-2)" : "var(--accent)" }}
            >
              {c.rarity}
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="text-[10px] text-white/30 mb-0.5">#{c.num}</div>
        <div className="text-[13px] font-bold truncate mb-0.5">
          <span style={{ color: editionColor }}>[{editionLabel}]</span> {c.koreanName || baseName}
        </div>
        {c.koreanName && c.koreanName !== baseName && (
          <div className="text-[10px] text-white/30 truncate">{baseName}</div>
        )}
        <div className="bg-white/5 rounded-lg px-2.5 py-2 mt-2">
          <div className="text-[9px] text-white/30 tracking-wider mb-0.5">PSA10 추정가</div>
          <div className="text-[15px] font-black leading-tight">{formatKRW(price)}</div>
          {isJP && <div className="text-[11px] text-white/50">{formatJPY(c.psa10JPY)}</div>}
          {!isJP && <div className="text-[10px] text-white/40">(한판 보정 ~62%)</div>}
        </div>
      </div>
    </a>
  );
}
