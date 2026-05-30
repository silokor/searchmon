import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "서치몬 — 일본판 포켓몬 카드 검색",
  description: "2023년부터 현재까지, SV 시리즈 모든 팩과 카드를 한눈에.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#0a0a0c] text-white antialiased">{children}</body>
    </html>
  );
}
