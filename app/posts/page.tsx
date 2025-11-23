// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_WITH_OFFSET_PAGINATION } from "@/lib/queries";

// ★ クエリパラメータごとに毎回サーバーで実行させる
export const dynamic = "force-dynamic";

type SearchParams = {
  page?: string;
  author?: string;
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const page = Number(searchParams?.page || 1);
  const author = searchParams?.author || null;

  const size = 12;
  const offset = (page - 1) * size;

  // GraphQL 変数
  const variables: Record<string, any> = {
    size,
    offset,
  };

  // 著者フィルタ（author があれば authorName に渡す）
  if (author) {
    variables.authorName = author;
  }

  // 投稿取得
  const data = await gql<any>(POSTS_WITH_OFFSET_PAGINATION, variables);
  const posts = data?.posts?.nodes || [];
  const total = data?.posts?.pageInfo?.offsetPagination?.total || 0;
  const totalPages = Math.ceil(total / size);

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル（著者名あれば表示） */}
      {author ? (
        <h1 className="text-2xl font-bold mb-6">
          ライター「{author}」の記事一覧
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      )}

      {/* 記事リスト */}
      <ArticleList posts={posts} />

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center gap-4 text-sm">
          {page > 1 && (
            <a
              href={`/posts?page=${page - 1}${
                author ? `&author=${author}` : ""
              }`}
              className="px-4 py-2 border rounded hover:bg-neutral-50"
            >
              ← 前へ
            </a>
          )}

          {page < totalPages && (
            <a
              href={`/posts?page=${page + 1}${
                author ? `&author=${author}` : ""
              }`}
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
