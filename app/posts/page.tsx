// app/posts/page.tsx
import Link from "next/link";
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import {
  POSTS_WITH_OFFSET_PAGINATION,
  POSTS_FOR_AUTHOR_VIEW,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

// =========================
// 型定義
// =========================
type SearchParams = {
  page?: string;
  author?: string;
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

type PostsForAuthorViewResult = {
  posts: {
    nodes: WpPost[];
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
  const pageParam = searchParams?.page ?? "1";
  const parsed = Number(pageParam);
  const page = !Number.isNaN(parsed) && parsed > 0 ? parsed : 1;

  // ここに「表示名」が入ってくる想定
  // 例: author=YOHEI%20YAMAMOTO
  const authorNameParam = searchParams?.author || null;

  let posts: WpPost[] = [];
  let totalPages = 1;

  if (authorNameParam) {
    // =========================
    // ★ ライター別一覧（表示名でフィルタ）
    // =========================
    const data = await gql<PostsForAuthorViewResult>(POSTS_FOR_AUTHOR_VIEW, {
      first: 200,
    });

    const all = data?.posts?.nodes ?? [];

    posts = all.filter(
      (p) => p.author?.node?.name === authorNameParam
    );

    totalPages = 1; // 今は 1 ページだけ表示
  } else {
    // =========================
    // ★ 通常一覧（先頭から PAGE_SIZE 件）
    // =========================
    const data = await gql<PostsWithOffsetPaginationResult>(
      POSTS_WITH_OFFSET_PAGINATION,
      { first: PAGE_SIZE } // ← ここで first を渡す
    );

    posts = data?.posts?.nodes ?? [];
    totalPages = 1; // offsetPagination をやめたので今は 1 ページ扱い
  }

  const authorName = authorNameParam ?? null;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      {/* タイトル */}
      {authorName ? (
        <h1 className="mb-6 text-2xl font-bold">
          ライター: <span className="ml-1">{authorName}</span> の記事一覧
        </h1>
      ) : (
        <h1 className="mb-6 text-2xl font-bold">記事一覧</h1>
      )}

      {/* 記事0件時 */}
      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">まだ記事がありません。</p>
      ) : (
        <ArticleList posts={posts} />
      )}

      {/* ページネーション（今は無効扱い） */}
      {!authorName && totalPages > 1 && (
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
