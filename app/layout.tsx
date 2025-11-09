// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GAListener from "@/components/GAListener";

/* ------------ Fonts ------------ */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNIVERSIS｜大学ラグビー分析・戦術・試合レポート",
  description:
    "大学ラグビーの戦術・データ・文化を横断して読む。UNIVERSISはラグビー分析・試合レポート・コラムを通して“次の一勝”を見つけるスポーツ知のハブ。",
  keywords: [
    "大学ラグビー",
    "ラグビー分析",
    "ラグビー記事",
    "戦術分析",
    "試合レポート",
    "関東大学ラグビー",
    "Rugby Analysis",
    "UNIVERSIS"
  ],
  openGraph: {
    title: "UNIVERSIS｜大学ラグビー分析・戦術・試合レポート",
    description:
      "ラグビーの戦術・データ・文化を横断する分析メディア『UNIVERSIS』。大学ラグビーを中心に、戦術・試合レポート・スカウティングを配信。",
    url: "https://universis.site",
    siteName: "UNIVERSIS",
    images: [
      {
        url: "https://universis.site/ogp.png",
        width: 1200,
        height: 630,
        alt: "UNIVERSIS | 大学ラグビー分析サイト",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
};


/* ------------ Root Layout (default は1回だけ) ------------ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        {/* GA4 ライブラリ */}
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        {/* 初期化（SPA なので send_page_view は false） */}
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
          `}
        </Script>
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-neutral-900`}
      >
        <Header />
        {children}
        <Footer />

        {/* ルート遷移ごとに page_view を送信 */}
        <GAListener />
      </body>
    </html>
  );
}
