'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { WPPost } from '@/ts/wp';

// === 型拡張：WPPost に content を許可（WP のクエリ内容に依存するため任意扱い） ===
type PostLike = WPPost & { content?: string | null };

const ORIGIN =
  (typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_WP_ORIGIN
    : process.env.NEXT_PUBLIC_WP_ORIGIN) || 'http://localhost:8080';

// 相対URL→絶対URL
function toAbs(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `http:${url}`;
  if (url.startsWith('/')) return `${ORIGIN.replace(/\/$/, '')}${url}`;
  return url;
}

// 本文から最初の <img src> を拾う
function firstImgFromContent(html?: string | null): string | null {
  if (!html) return null;
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

// 日付フォーマッタ（undefined や壊れた日付を無視）
const formatJPDate = (iso?: string | null) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('ja-JP');
};

// 記事カード用のサムネ決定
function pickThumb(p: PostLike): { src: string; alt: string } {
  const fi = toAbs(p.featuredImage?.node?.sourceUrl ?? undefined);
  const fromContent = toAbs(firstImgFromContent(p.content));
  const src = fi || fromContent || '/noimage.jpg';
  const rawAlt = p.featuredImage?.node?.altText || p.title || 'thumbnail';
  return { src, alt: rawAlt.replace(/\s+/g, ' ') };
}

type Props = {
  posts: PostLike[];
};

export default function ArticleList({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <div className="space-y-12">
      {posts.map((p, i) => {
        const { src, alt } = pickThumb(p);

        return (
          <article key={p.id} className="group grid grid-cols-1 gap-6 sm:grid-cols-12">
            {/* サムネイル */}
            <div className="sm:col-span-5">
              <Link href={`/posts/${p.slug}`} className="block" prefetch>
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-100">
                  <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes="(min-width: 1024px) 36vw, (min-width: 640px) 45vw, 100vw"
                    priority={i < 2}
                    unoptimized
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
            </div>

            {/* テキスト */}
            <div className="sm:col-span-7 flex min-w-0 flex-col justify-center">
              {!!formatJPDate(p.date) && (
                <time className="mb-2 block text-sm text-neutral-500" dateTime={p.date!}>
                  {formatJPDate(p.date)}
                </time>
              )}

              <h3 className="mb-2 line-clamp-2 text-2xl font-serif font-semibold text-neutral-900">
                <Link href={`/posts/${p.slug}`} prefetch>
                  {p.title}
                </Link>
              </h3>

              {p.excerpt && (
                <p
                  className="line-clamp-2 text-neutral-600"
                  dangerouslySetInnerHTML={{
                    // excerpt が HTML の場合もあるので簡易サニタイズ＋トリム
                    __html: (p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 120),
                  }}
                />
              )}

              <div className="mt-3">
                <Link
                  href={`/posts/${p.slug}`}
                  className="inline-flex items-center text-sm font-medium text-neutral-900 hover:underline"
                  prefetch
                >
                  続きを読む →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
