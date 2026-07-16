import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "다시봄 - 당신의 두 번째 봄을 다시 켭니다 | 50대 남녀 맞춤형 갱년기 활력 솔루션",
  description: "50대 남성 및 여성의 활기찬 일상을 위한 프리미엄 갱년기 솔루션 '다시봄'. 자연 유래 성분과 식약처 공인 안전 원료로 신체 밸런스를 채우세요.",
  keywords: ["다시봄", "50대 영양제", "갱년기 영양제", "남성 갱년기", "여성 갱년기", "석류추출물", "쏘팔메토", "중년 건강"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
