// 팩 상세 진입 시 표시되는 스켈레톤
export default function Loading() {
  return (
    <main className="grain relative max-w-[1280px] mx-auto px-5 sm:px-8 py-10 sm:py-16">
      <div className="h-5 w-24 skeleton skeleton-box mb-8" />

      <header className="mb-14 grid sm:grid-cols-[280px_1fr] gap-8 items-center">
        <div className="aspect-square rounded-2xl skeleton" />
        <div>
          <div className="h-3 w-16 skeleton skeleton-box mb-3" />
          <div className="h-10 w-3/4 skeleton skeleton-box mb-3" />
          <div className="h-5 w-1/2 skeleton skeleton-box mb-6" />
          <div className="grid grid-cols-2 gap-3 max-w-[440px] mb-6">
            <div className="h-20 rounded-xl skeleton" />
            <div className="h-20 rounded-xl skeleton" />
          </div>
          <div className="flex gap-4">
            <div className="h-3 w-20 skeleton skeleton-box" />
            <div className="h-3 w-20 skeleton skeleton-box" />
            <div className="h-3 w-24 skeleton skeleton-box" />
          </div>
        </div>
      </header>

      <div className="h-6 w-16 skeleton skeleton-box mb-2" />
      <div className="h-3 w-72 skeleton skeleton-box mb-6" />

      {/* 카드 그리드 스켈레톤 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-[var(--bg-elev)] rounded-xl overflow-hidden border border-white/5">
            <div className="aspect-[3/4] skeleton" />
            <div className="p-3">
              <div className="h-2 w-8 skeleton skeleton-box mb-2" />
              <div className="h-3 w-3/4 skeleton skeleton-box mb-3" />
              <div className="h-12 rounded-lg skeleton" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
