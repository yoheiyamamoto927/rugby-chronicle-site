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

/* ------------ SEO / Meta ------------ */
export const metadata: Metadata = {
  title: "UNIVERSIS",
  description:
    "UNIVERSIS | ラグビーの戦術・データ・文化を横断するスポーツ知のハブ。",
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
