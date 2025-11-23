// app/posts/page.tsx
import { gql } from "@/lib/wp";
import { POSTS_WITH_OFFSET_PAGINATION } from "@/lib/queries";
import ArticleList from "@/components/ArticleList";
import type { WPPost } from "@/ts/wp";

type PostWithAuthor = WPPost & {
  author?: { node?: { name?: string | null; slug?: string | null } | null } | null;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { page?: string; author?: string };
}) {
  const page = Math.max(1, Number(searchParams?.page || 1));
  const authorSlug = searchParams?.author || null;

  // 一旦まとめて取得（最大 100 件）
  const data = await gql<{ posts: { nodes: PostWithAuthor[] } }>(
    POSTS_WITH_OFFSET_PAGINATION,
    { first: 100 }
  );

  const allPosts = data?.posts?.nodes ?? [];

  // 著者フィルタ（?author=universis など）
  const filtered = authorSlug
    ? allPosts.filter(
        (p) => p.author?.node?.slug && p.author.node.slug === authorSlug
      )
    : allPosts;

  // アプリ側ページング
  const size = 12;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * size;
  const pagePosts = filtered.slice(start, start + size);

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {authorSlug ? (
        <h1 className="text-2xl font-bold mb-6">
          ライター: {authorSlug} の記事一覧
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      )}

      <ArticleList posts={pagePosts} />

      {/* ページネーション */}
      <div className="mt-10 flex justify-center gap-4 text-sm">
        {currentPage > 1 && (
          <a
            href={`/posts?page=${currentPage - 1}${
              authorSlug ? `&author=${authorSlug}` : ""
            }`}
            className="px-4 py-2 border rounded hover:bg-neutral-50"
          >
            ← 前へ
          </a>
        )}

        {currentPage < totalPages && (
          <a
            href={`/posts?page=${currentPage + 1}${
              authorSlug ? `&author=${authorSlug}` : ""
            }`}
            className="px-4 py-2 border rounded hover:bg-neutral-50"
          >
            次へ →
          </a>
        )}
      </div>
    </section>
  );
}
