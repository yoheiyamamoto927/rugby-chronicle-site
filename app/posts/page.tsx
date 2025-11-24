// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import {
  POSTS_WITH_OFFSET_PAGINATION,
  POSTS_FOR_AUTHOR_VIEW,
} from "@/lib/queries";

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
  const authorSlug = searchParams?.author || null;

  const size = 12;

  let posts: any[] = [];
  let totalPages = 1;

  if (authorSlug) {
    // ★ ライター別：GraphQL では全件取って、Next 側で slug で絞る
    const data = await gql<any>(POSTS_FOR_AUTHOR_VIEW, { first: 100 });
    const all = data?.posts?.nodes || [];
    posts = all.filter((p: any) => p.author?.node?.slug === authorSlug);
    totalPages = 1; // まずは1ページだけ表示
  } else {
    // ★ 通常一覧：これまで通り offsetPagination を使う
    const offset = (page - 1) * size;
    const data = await gql<any>(POSTS_WITH_OFFSET_PAGINATION, { size, offset });
    posts = data?.posts?.nodes || [];
    const total = data?.posts?.pageInfo?.offsetPagination?.total || 0;
    totalPages = Math.max(1, Math.ceil(total / size));
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル */}
      {authorSlug ? (
        <h1 className="text-2xl font-bold mb-6">
          ライター: {authorSlug} の記事一覧
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      )}

      {/* 記事リスト */}
      <ArticleList posts={posts} />

      {/* ページネーション（ライター別のときはいったん非表示） */}
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
