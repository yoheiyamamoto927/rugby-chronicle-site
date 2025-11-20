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
    // ★ スマホ2列 / タブレット3列 / PC3列 のカードグリッド
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
      {posts.map((p, i) => {
        const { src, alt } = pickThumb(p);
        const hasDate = !!formatJPDate(p.date);

        return (
          <article
            key={p.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200/70 hover:shadow-md hover:ring-neutral-300 transition"
          >
            <Link href={`/posts/${p.slug}`} prefetch className="flex h-full flex-col">
              {/* サムネイル */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-100">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
                  priority={i < 2}
                  unoptimized
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* テキスト */}
              <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                {hasDate && (
                  <time
                    className="mb-1 text-[11px] text-neutral-500"
                    dateTime={p.date!}
                  >
                    {formatJPDate(p.date)}
                  </time>
                )}

                <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-neutral-900">
                  {p.title}
                </h3>

                {p.excerpt && (
                  <p
                    className="mt-1 hidden text-[11px] leading-snug text-neutral-600 md:line-clamp-3 md:block"
                    dangerouslySetInnerHTML={{
                      __html: (p.excerpt || '').replace(/<[^>]+>/g, '').slice(0, 120),
                    }}
                  />
                )}

                <span className="mt-2 inline-flex items-center text-[11px] font-medium text-neutral-900/80 group-hover:text-neutral-900">
                  続きを読む →
                </span>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
