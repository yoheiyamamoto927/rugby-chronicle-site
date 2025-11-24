// app/posts/page.tsx
import Link from "next/link";
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_WITH_OFFSET_PAGINATION } from "@/lib/queries";

export const dynamic = "force-dynamic";

// =========================
// 型定義
// =========================
type SearchParams = {
  page?: string;
  author?: string; // ← URL の ?author=ここ の値（ユーザー slug）
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
  content?: string;
  author?: WpAuthor;
  featuredImage?: {
    node?: WpImage;
  };
  categories?: {
    nodes: WpCategory[];
  };
};

type PostsWithOffsetPaginationResult = {
  posts: {
    nodes: WpPost[];
    pageInfo?: {
      hasNextPage: boolean;
      endCursor?: string | null;
    };
  };
};

const PAGE_SIZE = 12;

// =========================
// ページコンポーネント
// =========================
export default async function PostsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  // page は今は使わない（後で cursor ページングを拡張する前提）
  const pageParam = searchParams?.page ?? "1";
  const parsed = Number(pageParam);
  const page = !Number.isNaN(parsed) && parsed > 0 ? parsed : 1;

  // URL の ?author=universis みたいな値（WP ユーザー slug）
  const authorSlug = searchParams?.author ?? null;

  // GraphQL へクエリ投げる（authorSlug があれば authorName として渡す）
  const data = await gql<PostsWithOffsetPaginationResult>(
    POSTS_WITH_OFFSET_PAGINATION,
    {
      first: PAGE_SIZE,
      authorName: authorSlug ?? undefined,
    }
  );

  const posts = data?.posts?.nodes ?? [];

  // 見出し用のライター表示名
  const authorName =
    authorSlug && posts[0]?.author?.node?.name
      ? posts[0].author!.node!.name
      : null;

  const totalPages = 1; // 今は 1 ページ扱い

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル */}
      {authorSlug ? (
        <h1 className="mb-6 text-2xl font-bold">
          ライター:
          <span className="ml-1">
            {authorName ?? authorSlug}
          </span>
          の記事一覧
        </h1>
      ) : (
        <h1 className="mb-6 text-2xl font-bold">記事一覧</h1>
      )}

      {/* 記事0件 */}
      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          まだ記事がありません。
        </p>
      ) : (
        <ArticleList posts={posts} />
      )}

      {/* ページネーション（今は無効扱い） */}
      {!authorSlug && totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-4 text-sm"
          aria-label="ページネーション"
        >
          <span className="px-4 py-2 border border-transparent text-neutral-300">
            ← 前へ
          </span>
          <span className="text-neutral-600">
            {page} / {totalPages}
          </span>
          <span className="px-4 py-2 border border-transparent text-neutral-300">
            次へ →
          </span>
        </nav>
      )}
    </section>
  );
}
