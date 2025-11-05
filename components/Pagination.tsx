// components/Pagination.tsx
'use client';

import Link from 'next/link';
import { useMemo } from 'react';

type Props = {
  current: number;     // 現在のページ（1始まり）
  totalPages: number;  // 総ページ数
  basePath?: string;   // 例: "/" や "/category/university"
  maxNumbers?: number; // 中央に出す数字の個数（奇数推奨）
};

export default function Pagination({
  current,
  totalPages,
  basePath = '/',
  maxNumbers = 5,
}: Props) {
  if (totalPages <= 1) return null;

  // 表示する数字のレンジを計算（例: 1 ... 4 5 6 7 8 ... 20）
  const { start, end } = useMemo(() => {
    const half = Math.floor(maxNumbers / 2);
    let s = Math.max(1, current - half);
    let e = Math.min(totalPages, s + maxNumbers - 1);
    if (e - s + 1 < maxNumbers) {
      s = Math.max(1, e - maxNumbers + 1);
    }
    return { start: s, end: e };
  }, [current, totalPages, maxNumbers]);

  const pageHref = (p: number) => (p === 1 ? `${basePath}` : `${basePath}?page=${p}`);

  return (
    <nav className="mt-10 flex items-center justify-center gap-2">
      {/* Prev */}
      {current > 1 && (
        <Link
          href={pageHref(current - 1)}
          className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
        >
          ← 前へ
        </Link>
      )}

      {/* 先頭へ */}
      {start > 1 && (
        <>
          <Link
            href={pageHref(1)}
            className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
          >
            1
          </Link>
          {start > 2 && <span className="px-2 text-neutral-400">…</span>}
        </>
      )}

      {/* 中央の数字 */}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
        <Link
          key={p}
          href={pageHref(p)}
          aria-current={p === current ? 'page' : undefined}
          className={[
            'px-3 py-2 rounded-md border text-sm',
            p === current
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-neutral-300 hover:bg-neutral-100',
          ].join(' ')}
        >
          {p}
        </Link>
      ))}

      {/* 末尾へ */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-neutral-400">…</span>}
          <Link
            href={pageHref(totalPages)}
            className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next */}
      {current < totalPages && (
        <Link
          href={pageHref(current + 1)}
          className="px-3 py-2 rounded-md border border-neutral-300 text-sm hover:bg-neutral-100"
        >
          次へ →
        </Link>
      )}
    </nav>
  );
}
