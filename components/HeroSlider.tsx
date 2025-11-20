'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { WPPost } from '@/ts/wp';

type Props = {
  posts: WPPost[];
  intervalMs?: number;
};

export default function HeroSlider({ posts, intervalMs = 4500 }: Props) {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const len = posts.length;

  const go = useCallback(
    (i: number) => setIndex(((i % len) + len) % len),
    [len]
  );

  // 自動スライド
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

    if (inView) {
      timer.current && clearInterval(timer.current);
      timer.current = setInterval(() => go(index + 1), intervalMs);
    }

    return () => {
      obs.disconnect();
      timer.current && clearInterval(timer.current);
    };
  }, [index, intervalMs, len, hover, go]);

  // スワイプ
  useEffect(() => {
    let startX = 0;
    const el = wrapRef.current;
    const onStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        go(index + (dx < 0 ? 1 : -1));
        startX = e.touches[0].clientX;
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
      className="relative w-full overflow-hidden bg-neutral-100"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-roledescription="carousel"
      aria-label="注目スライド"
    >
      {/* スライド列（PC/SP 共通） */}
      <div
        className="flex w-full transition-transform duration-500 will-change-transform"
        style={{ transform: `translateX(${-index * 100}%)` }}
      >
        {posts.map((p, i) => {
          const img = p.featuredImage?.node?.sourceUrl ?? '';
          const alt = p.featuredImage?.node?.altText ?? p.title ?? 'post';
          const href = p.slug ? `/posts/${p.slug}` : '#';

          return (
            <article
              key={`${p.id ?? p.slug ?? i}-${i}`}
              className="relative min-w-full"
            >
              {/* 画像：常に 16:9 固定 */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
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

                {/* PCだけグラデーションのせる */}
                <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
              </div>

              {/* テキストブロック
                  - SP: 画像の下に白いカード
                  - PC: 画像の上に白文字オーバーレイ
              */}
              <div className="bg-white px-4 py-4 md:absolute md:inset-x-10 md:bottom-8 md:bg-transparent md:px-0 md:py-0 md:text-white">
                <div className="md:max-w-3xl">
                  <h2 className="text-lg font-bold leading-snug text-neutral-900 md:text-3xl md:font-extrabold md:text-white">
                    {p.title ?? ''}
                  </h2>

                  {p.slug && (
                    <Link
                      href={href}
                      className="mt-3 inline-flex rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800 md:bg-white md:text-neutral-900 md:hover:bg-white"
                    >
                      記事を読む
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* 矢印（PCのみ） */}
      <button
        aria-label="前へ"
        onClick={() => go(index - 1)}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white md:flex"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        aria-label="次へ"
        onClick={() => go(index + 1)}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white md:flex"
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
