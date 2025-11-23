// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_WITH_OFFSET_PAGINATION } from "@/lib/queries";

type SearchParams = {
  page?: string;
  author?: string;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Number(searchParams?.page ?? 1) || 1;
  const authorSlug = searchParams?.author ?? null;

  const size = 12;
  const offset = (page - 1) * size;

  // GraphQL から記事一覧（全体）を取得
  const data = await gql<any>(POSTS_WITH_OFFSET_PAGINATION, {
    size,
    offset,
  });

  let posts = data?.posts?.nodes ?? [];
  const total = data?.posts?.pageInfo?.offsetPagination?.total ?? 0;
  const totalPages = Math.ceil(total / size);

  // ★ 著者指定があるときだけ JS 側で絞り込み
  if (authorSlug) {
    posts = posts.filter(
      (p: any) => p?.author?.node?.slug === authorSlug
    );
  }

  const hasPosts = posts.length > 0;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル（著者名あれば表示） */}
      {authorSlug ? (
        <h1 className="text-2xl font-bold mb-6">
          ライター: {authorSlug} の記事一覧
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      )}

      {/* 記事リスト（2列/3列カード表示：ArticleList 側で制御） */}
      {hasPosts ? (
        <ArticleList posts={posts} />
      ) : (
        <p className="text-neutral-500">該当する記事がありません。</p>
      )}

      {/* ページネーション：全体一覧のときだけ表示（author 指定時は非表示） */}
      {!authorSlug && totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-4 text-sm">
          {page > 1 && (
            <a
              href={`/posts?page=${page - 1}`}
              className="px-4 py-2 border rounded hover:bg-neutral-50"
            >
              ← 前へ
            </a>
          )}

          {page < totalPages && (
            <a
              href={`/posts?page=${page + 1}`}
              className="px-4 py-2 border rounded hover:bg-neutral-50"
            >
              次へ →
            </a>
          )}
        </div>
      )}
    </section>
  );
}
