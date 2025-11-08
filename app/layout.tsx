import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ← フッター追加
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <head>
        {/* Google Analytics for UNIVERSIS */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-JD9XMQM1MV"
        />
        <Script id="ga-universis" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JD9XMQM1MV', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
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

