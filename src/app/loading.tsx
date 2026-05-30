// 메인 페이지 진입 시 스켈레톤
export default function Loading() {
  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <header className="mb-10">
        <div className="flex items-baseline gap-3 mb-3">
          <div className="h-12 w-40 skeleton skeleton-box" />
          <div className="h-3 w-24 skeleton skeleton-box" />
        </div>
        <div className="h-4 w-3/4 max-w-xl skeleton skeleton-box mb-2" />
        <div className="h-4 w-1/2 max-w-md skeleton skeleton-box" />
      </header>

      {/* 검색바/필터 */}
      <div className="flex gap-3 mb-6">
        <div className="h-10 flex-1 max-w-md rounded-lg skeleton" />
        <div className="h-10 w-20 rounded-lg skeleton" />
        <div className="h-10 w-20 rounded-lg skeleton" />
        <div className="h-10 w-20 rounded-lg skeleton" />
      </div>

      {/* 박스 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-3">
              <div className="h-2 w-10 skeleton skeleton-box mb-2" />
              <div className="h-4 w-3/4 skeleton skeleton-box mb-3" />
              <div className="h-14 rounded-md skeleton mb-2" />
              <div className="flex justify-between">
                <div className="h-2 w-8 skeleton skeleton-box" />
                <div className="h-2 w-14 skeleton skeleton-box" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
