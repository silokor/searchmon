"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SmartImage from "@/components/SmartImage";
import type { SetIndexEntry } from "@/lib/types";

export type SetCardItem = SetIndexEntry & {
  edition: "JP" | "KR";
  hitCount: number;
  boxImage: string | null;
  packPriceKR?: number;
  boxPriceKR?: number;
  packPriceJPY: number;
  boxPriceJPY: number;
  msrpPackKR?: number;
  msrpBoxKR?: number;
  msrpPackJPY?: number;
  msrpBoxJPY?: number;
  releasedKR: boolean;
  releaseJP: string;
  releaseKR?: string;
  nameKR_full?: string;
};

export default function SearchableGrid({ sets }: { sets: SetCardItem[] }) {
  const [q, setQ] = useState("");
  const [edition, setEdition] = useState<"all" | "JP" | "KR">("all");

  const filtered = useMemo(() => {
    let r = sets;
    if (edition !== "all") r = r.filter(s => s.edition === edition);
    const k = q.trim().toLowerCase();
    if (k) {
      r = r.filter(s =>
        s.code.toLowerCase().includes(k) ||
        s.name_ko.toLowerCase().includes(k) ||
        s.name_ja.toLowerCase().includes(k) ||
        (s.nameKR_full?.toLowerCase().includes(k) ?? false) ||
        (s.name_full?.toLowerCase().includes(k) ?? false)
      );
    }
    return r;
  }, [sets, q, edition]);

  return (
    <>
      <div className="mb-4 relative">
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
          >✕</button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Chip active={edition === "all"} onClick={() => setEdition("all")}>전체 {sets.length}</Chip>
        <Chip active={edition === "JP"} onClick={() => setEdition("JP")} color="#FFD400">🇯🇵 일판 {sets.filter(s=>s.edition==="JP").length}</Chip>
        <Chip active={edition === "KR"} onClick={() => setEdition("KR")} color="#5BC0FF">🇰🇷 한판 {sets.filter(s=>s.edition==="KR").length}</Chip>
      </div>

      <div className="mb-4 text-[13px] text-white/40">
        <span className="text-white/90 font-bold text-[16px]">{filtered.length}</span> 상품
        <span className="mx-2">·</span>
        <span className="text-[var(--accent)] font-bold">★ {filtered.reduce((a, s) => a + s.hitCount, 0)}</span> 힛카드
        {q && <span className="ml-2">· "{q}"</span>}
      </div>

      {/* 박스 그리드 — 더 작게, 한 줄에 많이 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map((s) => <SetTile key={`${s.code}-${s.edition}`} item={s} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/40 text-[14px]">검색 결과 없음</div>
      )}
    </>
  );
}

function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${active ? "text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}
      style={active ? { background: color || "var(--accent)" } : undefined}
    >
      {children}
    </button>
  );
}

function SetTile({ item: s }: { item: SetCardItem }) {
  const isJP = s.edition === "JP";
  const editionLabel = isJP ? "일판" : "한판";
  const editionColor = isJP ? "#FFD400" : "#5BC0FF";
  // 둘 다 ₩ 메인 표시 — 일판은 Kream JPY*9.5로 환산
  const JTK = 9.5;
  const packKRW = isJP ? Math.round(s.packPriceJPY * JTK / 100) * 100 : s.packPriceKR;
  const boxKRW  = isJP ? Math.round(s.boxPriceJPY  * JTK / 1000) * 1000 : s.boxPriceKR;
  const packSub = isJP ? `¥${s.packPriceJPY.toLocaleString()}` : null;
  const boxSub  = isJP ? `¥${s.boxPriceJPY.toLocaleString()}` : null;
  const msrpBox = isJP ? s.msrpBoxJPY   : s.msrpBoxKR;
  const releaseDate = isJP ? s.releaseJP : s.releaseKR;
  // 차익률 (리셀가 / 정가) — 일판은 JPY 기준
  const resellForRatio = isJP ? s.boxPriceJPY : s.boxPriceKR;
  const premium = (resellForRatio && msrpBox) ? Math.round((resellForRatio / msrpBox) * 100) / 100 : null;
  const premiumLabel = premium ? `${premium.toFixed(1)}×` : null;
  const isHot = premium !== null && premium >= 1.5;
  const isDown = premium !== null && premium < 1.0;

  return (
    <Link
      href={`/sets/${s.code}?edition=${s.edition}`}
      className="card-hover group block bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5"
    >
      <div className="relative aspect-[3/4] bg-gradient-to-br from-white/5 to-black/40 flex items-center justify-center p-4">
        {s.boxImage ? (
          <SmartImage
            src={s.boxImage}
            alt={s.name_ko}
            width={180}
            height={180}
            containerClassName="w-[70%] h-[70%] flex items-center justify-center"
            className="w-auto max-h-full max-w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]"
          />
        ) : (
          <Image
            src={`/images/sets/${s.code}.png`}
            alt={s.name_ko}
            width={160}
            height={80}
            className="w-auto max-h-[60%] object-contain opacity-60"
            unoptimized
          />
        )}
        {/* 에디션 뱃지 */}
        <span
          className="absolute top-2 left-2 text-[9px] font-black px-1.5 py-0.5 rounded text-black tracking-wider"
          style={{ background: editionColor }}
        >
          {editionLabel}
        </span>
        {/* 차익률 뱃지 */}
        {premiumLabel && (
          <span
            className="absolute top-2 right-2 text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider"
            style={{
              background: isHot ? "var(--accent)" : isDown ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.15)",
              color: isHot ? "#000" : isDown ? "rgba(255,255,255,0.5)" : "#fff",
            }}
          >
            {premiumLabel}
          </span>
        )}
      </div>
      <div className="p-2.5 sm:p-3 border-t border-white/5">
        <div className="text-[10px] text-white/30 tracking-widest mb-0.5">{s.code}</div>
        <div className="text-[12px] sm:text-[13px] font-bold leading-tight mb-1 line-clamp-2 min-h-[28px]">
          <span style={{ color: editionColor }}>[{editionLabel}]</span> {s.nameKR_full || s.name_ko}
        </div>

        {/* 가격 (작게) */}
        <div className="bg-white/5 rounded-md px-2 py-1.5 mt-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-white/40">1팩</span>
            <span className="text-white font-bold">
              {packKRW ? `₩${packKRW.toLocaleString()}` : "—"}
              {packSub && <span className="text-white/30 ml-1 font-normal">({packSub})</span>}
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] mt-0.5">
            <span className="text-white/40">1박스</span>
            <span className="text-white font-bold">
              {boxKRW ? `₩${boxKRW.toLocaleString()}` : "—"}
              {boxSub && <span className="text-white/30 ml-1 font-normal">({boxSub})</span>}
            </span>
          </div>
          {msrpBox && (
            <div className="flex items-center justify-between text-[9px] mt-0.5 text-white/25">
              <span>정가</span>
              <span>{isJP ? `¥${msrpBox.toLocaleString()}` : `₩${msrpBox.toLocaleString()}`}</span>
            </div>
          )}
        </div>

        <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/30">
          <span className="text-[var(--accent)]">★ {s.hitCount}</span>
          <span>{releaseDate || "—"}</span>
        </div>
      </div>
    </Link>
  );
}
