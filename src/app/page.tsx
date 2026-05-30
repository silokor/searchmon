import { getAllSets } from "@/lib/sets";
import SearchableGrid from "@/components/SearchableGrid";

export default function HomePage() {
  const sets = getAllSets();

  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-12 sm:py-20">
      <header className="mb-12 sm:mb-16">
        <div className="flex items-baseline gap-3 mb-3">
          <div className="text-[44px] sm:text-[64px] font-black tracking-tight leading-none">
            서치<span className="text-[var(--accent)]">몬</span>
          </div>
          <div className="text-[13px] text-white/40 tracking-widest">SEARCHMON</div>
        </div>
        <p className="text-[15px] sm:text-[17px] text-white/60 max-w-xl leading-relaxed">
          일본판 포켓몬 카드, 2023년부터 지금까지.<br />
          팩을 고르면 안에 든 카드가 다 보임.
        </p>
      </header>

      <SearchableGrid sets={sets} />

      <footer className="mt-20 text-center text-[12px] text-white/30">
        데이터: Limitless TCG · 시세 링크: Mercari (일본)
      </footer>
    </main>
  );
}
