// components/RelatedPosts.tsx
import Link from 'next/link';
import Image from 'next/image';
import { gql } from '@/lib/wp';
import type { WPPost } from '@/ts/wp';

type Props = {
  currentSlug?: string; // 現在表示中の記事の slug（除外用）
  title?: string;       // セクション見出し（デフォルト "Related"）
  count?: number;       // 取得件数（表示は currentSlug を除外して上位3件）
};

const RELATED_QUERY = /* GraphQL */ `
  query RelatedPosts($count: Int = 6) {
    posts(
      first: $count
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        date
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export default async function RelatedPosts({
  currentSlug,
  title = 'Related',
  count = 6,
}: Props) {
  const resp = await gql<{ posts: { nodes: WPPost[] } }>(RELATED_QUERY, { count });
  const all = resp?.posts?.nodes ?? [];
  const posts = all.filter(p => p.slug !== currentSlug).slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((p) => {
          const src = p.featuredImage?.node?.sourceUrl || '/noimage.jpg';
          const alt = p.featuredImage?.node?.altText || p.title || 'thumbnail';
          return (
            <Link key={p.id} href={`/posts/${p.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-neutral-100">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-neutral-900">
                {p.title}
              </h3>
              {p.date && (
                <p className="text-xs text-neutral-500">
                  {new Date(p.date).toLocaleDateString('ja-JP')}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
