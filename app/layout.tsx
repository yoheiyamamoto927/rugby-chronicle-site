import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ← フッター追加
import Script from "next/script";
import GAListener from "@/components/GAListener"; // ← 3) で作る

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* GA4 ライブラリ */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        {/* 初期化（send_page_view は false にして手動管理） */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
          `}
        </Script>
      </head>
      <body>
        {children}
        {/* ルート変更ごとに page_view を送る */}
        <GAListener />
      </body>
    </html>
  );
}




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNIVERSIS",
  description:
    "UNIVERSIS | ラグビーの戦術・データ・文化を横断するスポーツ知のハブ。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}
      >
        <Header /> {/* ← 左上にハンバーガー */}
        {children}
        <Footer /> {/* ← 下部にフッター */}
      </body>
    </html>
  );
}

