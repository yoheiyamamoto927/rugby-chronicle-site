// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// クエリパラメータの型
type SearchParams = {
  [key: string]: string | string[] | undefined;
};

type WpImage = {
  sourceUrl?: string;
  altText?: string;
};

type WpCategory = {
  name: string;
  slug: string;
};

type WpAuthor = {
  node?: {
    name?: string;
    slug?: string;
  };
};

export type WpPost = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  author?: WpAuthor;
  featuredImage?: {
    node?: WpImage;
  };
  categories?: {
    nodes: WpCategory[];
  };
};

type PostsResult = {
  posts: {
    nodes: WpPost[];
  };
};

const PAGE_SIZE = 12;

export default async function PostsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // -------------------------
  // クエリパラメータ取得
  // -------------------------
  const authorParam = searchParams?.author;
  const authorSlug =
    typeof authorParam === "string"
      ? authorParam
      : Array.isArray(authorParam)
      ? authorParam[0]
      : undefined;

  let posts: WpPost[] = [];

  if (authorSlug) {
    // =========================
    // ライター別一覧：
    // 全投稿を多めに取得して、Next 側で author.slug でフィルタ
    // =========================
    const data = await gql<PostsResult>(POSTS, { first: 100 });
    const all = data?.posts?.nodes ?? [];

    posts = all.filter(
      (p) => p.author?.node?.slug === authorSlug
    );
  } else {
    // =========================
    // 通常の一覧：最新 PAGE_SIZE 件をそのまま表示
    // =========================
    const data = await gql<PostsResult>(POSTS, { first: PAGE_SIZE });
    posts = data?.posts?.nodes ?? [];
  }

  // 見出し用のライター名
  const authorName =
    authorSlug && posts[0]?.author?.node?.name
      ? posts[0].author!.node!.name
      : null;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル */}
      {authorSlug ? (
        <h1 className="mb-2 text-2xl font-bold">
          ライター:
          <span className="ml-1">
            {authorName ?? authorSlug}
          </span>
          の記事一覧
        </h1>
      ) : (
        <h1 className="mb-2 text-2xl font-bold">記事一覧</h1>
      )}

      {/* ★ デバッグ用：いまの authorSlug を一旦表示（動いたら消してOK） */}
      <p className="mb-4 text-xs text-neutral-400">
        authorSlug: {authorSlug ?? "(なし)"}
      </p>

      {/* 記事0件 */}
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
