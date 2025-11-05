'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { CATEGORY_LINKS, PAGE_LINKS } from '@/lib/routes';
import { CATEGORIES } from '@/lib/nav';

<ul className="space-y-4 text-lg">
  {CATEGORIES.map(c => (
    <li key={c.slug}>
      <Link href={`/category/${c.slug}`} onClick={() => setOpen(false)} className="hover:underline">
        {c.jp}
      </Link>
    </li>
  ))}
</ul>


export default function GlobalMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 初回クライアントマウント後だけポータルを使用
  useEffect(() => setMounted(true), []);

  // ESCで閉じる & body スクロール固定
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = open ? 'hidden' : prev;

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {/* トリガー */}
      <button
        aria-label="menu"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded px-2 py-1 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
      >
        <Menu className="h-5 w-5" />
        <span className="hidden sm:inline">MENU</span>
      </button>

      {/* body直下にポータルで描画 */}
      {mounted && open &&
        createPortal(
          <div className="fixed inset-0 z-[9999]">
            {/* 背景（白で覆う） */}
            <div
              className="fixed inset-0 bg-white/95"
              onClick={() => setOpen(false)}
            />

            {/* メニュー本体 */}
            <div className="fixed inset-0 overflow-y-auto">
              {/* ヘッダー */}
              <div className="sticky top-0 flex h-14 items-center justify-between border-b border-neutral-200 bg-white/95 px-4 sm:px-6 lg:px-8">
                <div className="text-sm font-semibold text-neutral-500">MENU</div>
                <button
                  aria-label="close menu"
                  onClick={() => setOpen(false)}
                  className="rounded p-2 hover:bg-neutral-100"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* 本体グリッド */}
              <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 lg:px-8 md:grid-cols-2">
                {/* 左：CONTENTS（カテゴリ） */}
                <nav>
                  <div className="mb-3 text-xs font-semibold text-neutral-500">CONTENTS</div>
                  <ul className="space-y-4 text-lg">
                    {CATEGORY_LINKS.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline justify-between"
                        >
                          <span className="text-[18px] font-black tracking-wide text-neutral-900 group-hover:opacity-80">
                            {c.ja}
                          </span>
                          <span className="text-xs font-medium tracking-widest text-neutral-400">
                            {c.en}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* 右：ABOUT / RUGBY ANALYZER / INFORMATION */}
                <nav>
                  <div className="mb-3 text-xs font-semibold text-neutral-500">ABOUT</div>
                  <ul className="space-y-4 text-lg">
                    <li>
                      <Link
                        href={PAGE_LINKS.about.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between"
                      >
                        <span className="text-[18px] font-black text-neutral-900 group-hover:opacity-80">
                          {PAGE_LINKS.about.ja}
                        </span>
                        <span className="text-xs font-medium tracking-widest text-neutral-400">
                          {PAGE_LINKS.about.en}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={PAGE_LINKS.writer.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between"
                      >
                        <span className="text-[18px] font-black text-neutral-900 group-hover:opacity-80">
                          {PAGE_LINKS.writer.ja}
                        </span>
                        <span className="text-xs font-medium tracking-widest text-neutral-400">
                          {PAGE_LINKS.writer.en}
                        </span>
                      </Link>
                    </li>
                    <li>
                      <a
                        href={PAGE_LINKS.rugbyAnalyzer.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setOpen(false)}
                        className="group flex items-baseline justify-between"
                      >
                        <span className="text-[18px] font-black text-neutral-900 group-hover:opacity-80">
                          {PAGE_LINKS.rugbyAnalyzer.ja}
                        </span>
                        <span className="text-xs font-medium tracking-widest text-neutral-400">
                          {PAGE_LINKS.rugbyAnalyzer.en}
                        </span>
                      </a>
                    </li>
                  </ul>

                  
                </nav>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}
