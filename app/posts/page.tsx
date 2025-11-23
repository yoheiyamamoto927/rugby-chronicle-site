// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_INDEX } from "@/lib/queries";
import type { WPPost } from "@/ts/wp";

type SearchParams = {
  author?: string;
};

type PostsIndexData = {
  posts: {
    nodes: WPPost[];
  };
};

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const author = searchParams?.author ?? null;

  // GraphQL 変数
  const variables: { first: number; authorName?: string } = {
    first: 50, // とりあえず最大50件まで表示（足りなければ増やせばOK）
  };

  if (author) {
    // WordPress の「ユーザースラッグ」（nicename）をそのまま渡す想定
    variables.authorName = author;
  }

  const data = await gql<PostsIndexData>(POSTS_INDEX, variables);
  const posts = data?.posts?.nodes ?? [];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル */}
      {author ? (
        <h1 className="text-2xl font-bold mb-6">
          ライター: {author} の記事一覧
        </h1>
      ) : (
        <h1 className="text-2xl font-bold mb-6">記事一覧</h1>
      )}

      <ArticleList posts={posts} />
      {/* 今は offsetPagination を使わないのでページネーションは一旦ナシ */}
    </section>
  );
}
