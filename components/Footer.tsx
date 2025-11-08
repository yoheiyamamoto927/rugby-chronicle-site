// components/Footer.tsx
'use client';

import Link from 'next/link';
import { CATEGORIES } from '@/lib/nav';

type Pair = { en: string; jp: string; href: string };

// 左列（カテゴリ）は CATEGORIES をそのまま流用
const leftPairs: Pair[] = CATEGORIES.map((c) => ({
  en: c.en,
  jp: c.jp,
  href: `/category/${c.slug}`,
}));

// 右列（ブランド系）
const rightPairs: Pair[] = [
  { en: 'WRITER', jp: 'ライター', href: '/writers' },
  { en: 'ABOUT', jp: 'UNIVERSISとは', href: '/about' },
  {
    en: 'RUGBY ANALYZER',
    jp: '分析依頼（Rugby Analyzer）',
    href: 'https://sportsconnect-lab.github.io/rugby-analyzer-site/',
  },
];

// 下段のインフォメーション
// 下段のインフォメーション（最小構成）
const info: Array<{ label: string; href: string; external?: boolean }> = [
  //{ label: '運営会社', href: '/company' },           // 任意。未作成なら外してOK
  { label: 'プライバシーポリシー', href: '/privacy-policy' }, // 必須（/app/privacy-policy/page.tsx を作成済み）
  // { label: '利用規約', href: '/terms' },          // 将来追加するならコメント解除
  // { label: 'クッキーポリシー', href: '/cookie-policy' }, // GA導入などCookie運用開始で追加
  // { label: '特定商取引法に基づく表記', href: '/legal' }, // 有料販売/申込が始まったら
  // { label: 'FAQ', href: '/faq' },                 // ページを作ったら
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">

        {/* 上段：左右2ブロック */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
          {/* 左：カテゴリ（英語/日本語 2列） */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {leftPairs.map((p) => (
              <FooterItem key={p.en} en={p.en} jp={p.jp} href={p.href} />
            ))}
          </div>

          {/* 右：Writer/ABOUT/Analyzer（英語/日本語 2列） */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {rightPairs.map((p) => (
              <FooterItem key={p.en} en={p.en} jp={p.jp} href={p.href} />
            ))}
          </div>
        </div>

        {/* 区切り線 */}
        <hr className="my-10 border-neutral-200" />

        {/* 下段：INFORMATION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[14px] leading-6">
          <div className="font-semibold text-neutral-500">INFORMATION</div>
          <div className="col-span-1 sm:col-span-1 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {info.map((i) => (
              <Link key={i.label} href={i.href} className="text-neutral-800 hover:underline">
                {i.label}
              </Link>
            ))}
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-600">
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <Link href="/contact" className="hover:underline">サービスに関するお問い合わせ</Link>
          </div>
          <div className="text-neutral-500">
            © {new Date().getFullYear()} UNIVERSIS. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ====== 共通アイテム（英語・日本語を横並びで1組） ====== */
function FooterItem({ en, jp, href }: { en: string; jp: string; href: string }) {
  const isExternal = href.startsWith('http');

  const En = (
    <span className="font-extrabold tracking-wide text-[18px] leading-none text-neutral-900 hover:opacity-80">
      {en}
    </span>
  );
  const Jp = (
    <span className="text-[18px] leading-none text-neutral-900 hover:opacity-80">
      {jp}
    </span>
  );

  if (isExternal) {
    return (
      <>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {En}
        </a>
        <a href={href} target="_blank" rel="noopener noreferrer" className="inline-block">
          {Jp}
        </a>
      </>
    );
  }

  return (
    <>
      <Link href={href} className="inline-block">
        {En}
      </Link>
      <Link href={href} className="inline-block">
        {Jp}
      </Link>
    </>
  );
}
