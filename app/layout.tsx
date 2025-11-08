import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ← フッター追加
// app/layout.tsx（抜粋）
import Script from 'next/script';
import GaListener from './ga-listener';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* GA 本体 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JD9XMQM1MV"
          strategy="afterInteractive"
        />
        {/* 初期化：自動 page_view はオフ */}
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JD9XMQM1MV', { send_page_view: false });
          `}
        </Script>
      </head>
      <body>
        <GaListener />   {/* ← これを <body> 直下に入れる */}
        {children}
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

