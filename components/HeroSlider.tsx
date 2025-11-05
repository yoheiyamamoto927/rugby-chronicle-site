'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type SlidePost = {
  id: string;
  slug?: string;
  title: string;
  featuredImage?: { node?: { sourceUrl: string; altText: string } };
  // 追加: サービス訴求用
  externalUrl?: string;   // 外部LPへのリンクを直接指定
  subtitle?: string;      // サブコピー
  ctaLabel?: string;      // 例: "無料相談 / 見積り"
};

type Props = {
  posts: SlidePost[];
  intervalMs?: number;
};

export default function HeroSlider({ posts, intervalMs = 4500 }: Props) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const len = posts.length;

  const go = useCallback((i: number) => setIndex(((i % len) + len) % len), [len]);

  // 自動スライド（ホバー中/画面外では停止）
  useEffect(() => {
    if (!len || hover) return;
    let inView = true;
    const el = wrapRef.current;
    const obs = new IntersectionObserver(
      ([e]) => {
        inView = !!e?.isIntersecting;
        if (!inView && timer.current) {
          clearInterval(timer.current);
          timer.current = null;
        } else if (inView) {
          timer.current && clearInterval(timer.current);
          timer.current = setInterval(() => go(index + 1), intervalMs);
        }
      },
      { threshold: 0.25 }
    );
    if (el) obs.observe(el);

    // 初回起動
    if (inView) {
      timer.current && clearInterval(timer.current);
      timer.current = setInterval(() => go(index + 1), intervalMs);
    }

    return () => {
      obs.disconnect();
      timer.current && clearInterval(timer.current);
    };
  }, [index, intervalMs, len, hover, go]);

  // キーボード左右
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, go]);

  // スワイプ
  useEffect(() => {
    let startX = 0;
    const el = wrapRef.current;
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        go(index + (dx < 0 ? 1 : -1));
        startX = e.touches[0].clientX; // 連続操作を滑らかに
      }
    };
    el?.addEventListener('touchstart', onStart);
    el?.addEventListener('touchmove', onMove);
    return () => {
      el?.removeEventListener('touchstart', onStart);
      el?.removeEventListener('touchmove', onMove);
    };
  }, [index, go]);

  if (!len) return null;

  return (
    <div
      ref={wrapRef}
      className="relative h-[42vw] max-h-[520px] min-h-[280px] w-full overflow-hidden bg-neutral-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-roledescription="carousel"
      aria-label="注目スライド"
    >
      {/* スライド列 */}
      <div
        className="h-full w-full flex transition-transform duration-500 will-change-transform"
        style={{ transform: `translateX(${-index * 100}%)` }}
      >
        {posts.map((p, i) => {
          const img = p.featuredImage?.node?.sourceUrl;
          const alt = p.featuredImage?.node?.altText ?? p.title;
          const isActive = i === index;

          // クリック先: 外部URL > 記事ページ
          const href = p.externalUrl ?? (p.slug ? `/posts/${p.slug}` : '#');

          return (
            <div
              key={`${p.id}-${i}`}
              className="relative min-w-full h-full"
              aria-hidden={!isActive}
            >
              {img && (
                <Image
                  src={img}
                  alt={alt}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="100vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* テキスト/CTA */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="max-w-3xl">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                    {p.title}
                  </h2>
                  {p.subtitle && (
                    <p className="mt-2 text-neutral-200 text-sm sm:text-base drop-shadow">
                      {p.subtitle}
                    </p>
                  )}

                  {p.externalUrl ? (
                    <a
                      href={href}
                      className="inline-flex mt-4 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                      {p.ctaLabel ?? '無料相談 / 見積り'}
                    </a>
                  ) : p.slug ? (
                    <Link
                      href={href}
                      className="inline-flex mt-4 rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-white"
                    >
                      記事を読む
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 矢印 */}
      <button
        aria-label="前へ"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white shadow"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="次へ"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white shadow"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* ドット */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {posts.map((_, i) => (
          <button
            key={i}
            aria-label={`スライド ${i + 1} に移動`}
            onClick={() => go(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? 'w-6 bg-white' : 'w-2.5 bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
