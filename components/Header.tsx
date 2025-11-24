'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import GlobalMenu from './GlobalMenu';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* 左：ハンバーガー */}
<GlobalMenu />

{/* 中央：ロゴ */}
<Link href="/" className="font-extrabold tracking-tight text-2xl">
  <span className="text-neutral-900">UNIVER</span>
  <span className="text-sky-600">SIS</span>
</Link>



        {/* 右：ログイン/検索 + 相談CTA */}
<div className="flex items-center gap-3">

  <a
    href="https://sportsconnect-lab.github.io/rugby-analyzer-site/"
    className="rounded-full bg-universis-blue px-3 py-1.5 text-xl font-semibold text-black hover:opacity-90"
  >
    分析依頼
  </a>
</div>

      </div>
    </header>
  );
}
