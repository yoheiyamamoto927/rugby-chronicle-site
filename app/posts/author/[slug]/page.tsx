// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_BY_AUTHOR } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string;
};

type WpAuthor = {
  node?: {
    name?: string;
    slug?: string;
  };
};

export default async function AuthorPostsPage({
  params,
}: {
  params: Params;
}) {
  const authorSlug = params.slug;

  // 🔥 WP の displayName に変換
  const displayNameMap: Record<string, string> = {
    universis: "YOHEI YAMAMOTO",
    "imamoto-takashi": "IMAMOTO TAKASHI",
  };
  const displayName = displayNameMap[authorSlug] ?? authorSlug;

  // 🔥 GraphQL に渡すのは "displayName" だけ
  const data = await gql(POSTS_BY_AUTHOR, {
    first: 100,
    displayName,   // ←←← 絶対これ！！
  });

  const posts = data?.posts?.nodes ?? [];

  const authorName =
    posts[0]?.author?.node?.name ?? displayName;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      <h1 className="mb-4 text-2xl font-bold">
        ライター:
        <span className="ml-1">{authorName}</span>
        の記事一覧
      </h1>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          まだ記事がありません。
        </p>
      ) : (
        <ArticleList posts={posts} />
      )}
    </section>
  );
}
