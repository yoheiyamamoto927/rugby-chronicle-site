import Image from 'next/image';
import Link from 'next/link';
import { gql } from '@/lib/wp';
import { RELATED_POSTS } from '@/lib/queries';

type Card = {
  id: string;
  slug: string;
  title: string;
  date: string;
  featuredImage?: { node?: { sourceUrl: string; altText: string } };
};

export default async function RelatedPosts({
  excludeId,
  categoryIds,
  title = '関連記事',
}: {
  excludeId: string;
  categoryIds: number[];
  title?: string;
}) {
  if (!categoryIds.length) return null;

  const data = await gql<{ posts: { nodes: Card[] } }>(RELATED_POSTS, {
    catIn: categoryIds,
    exclude: [excludeId],
    first: 5,
  });

  const items = data.posts.nodes;
  if (items.length === 0) return null;

  return (
    <section className="mt-16">
      <h3 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h3>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const img = p.featuredImage?.node?.sourceUrl;
          return (
            <Link
              key={p.id}
              href={`/posts/${p.slug}`}
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white hover:shadow-sm"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100">
                {img && (
                  <Image
                    src={img}
                    alt={p.title}
                    width={800}
                    height={450}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <time className="block text-xs text-neutral-500">
                  {new Date(p.date).toLocaleDateString('ja-JP')}
                </time>
                <div className="mt-1 line-clamp-2 text-sm font-medium text-neutral-900">
                  {p.title}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
