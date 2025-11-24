// app/posts/page.tsx
import Link from "next/link";
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import {
  POSTS_WITH_OFFSET_PAGINATION,
  POSTS_FOR_AUTHOR_VIEW,
} from "@/lib/queries";

// ★ クエリパラメータごとにページを再生成させる
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

type OffsetPaginationInfo = {
  total?: number;
  hasMore?: boolean;
};

type PostsWithOffsetPaginationResult = {
  posts: {
    nodes: WpPost[];
    pageInfo?: {
      offsetPagination?: OffsetPaginationInfo;
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
  // page クエリ処理
  const pageParam = searchParams?.page ?? "1";
  const parsed = Number(pageParam);
  const page = !Number.isNaN(parsed) && parsed > 0 ? parsed : 1;

  // ★ この値を「フルネーム」で受け取る
  // 例: /posts?author=YOHEI%20YAMAMOTO
  const authorNameParam = searchParams?.author || null;

  let posts: WpPost[] = [];
  let totalPages = 1;

  if (authorNameParam) {
    // =========================
    // ★ ライター別一覧（表示名 name でフィルタ）
    // =========================
    const data = await gql<PostsForAuthorViewResult>(POSTS_FOR_AUTHOR_VIEW, {
      first: 200,
    });

    const all = data?.posts?.nodes ?? [];

    const filtered = all.filter(
      (p) => p.author?.node?.name === authorNameParam
    );

    posts = filtered;
    totalPages = 1;
  } else {
    // =========================
    // ★ 通常一覧（ページネーション）
    // =========================
    const offset = (page - 1) * PAGE_SIZE;

    const data = await gql<PostsWithOffsetPaginationResult>(
      POSTS_WITH_OFFSET_PAGINATION,
      { size: PAGE_SIZE, offset }
    );

    posts = data?.posts?.nodes ?? [];
    const total =
      data?.posts?.pageInfo?.offsetPagination?.total ?? 0;

    totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  }

  // タイトル表示用
  const authorName = authorNameParam;

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

      {/* 記事0件 */}
      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">
          まだ記事がありません。
        </p>
      ) : (
        <ArticleList posts={posts} />
      )}

      {/* ページネーション（ライター別は非表示） */}
      {!authorName && totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-4 text-sm"
          aria-label="ページネーション"
        >
          {/* 前へ */}
          {page > 1 ? (
            <Link
              href={page - 1 === 1 ? "/posts" : `/posts?page=${page - 1}`}
              className="px-4 py-2 border rounded hover:bg-neutral-50"
            >
              ← 前へ
            </Link>
          ) : (
            <span className="px-4 py-2 border border-transparent text-neutral-300">
              ← 前へ
            </span>
          )}

          {/* 現在ページ */}
          <span className="text-neutral-600">
            {page} / {totalPages}
          </span>

          {/* 次へ */}
          {page < totalPages ? (
            <Link
              href={`/posts?page=${page + 1}`}
              className="px-4 py-2 border rounded hover:bg-neutral-50"
            >
              次へ →
            </Link>
          ) : (
            <span className="px-4 py-2 border border-transparent text-neutral-300">
              次へ →
            </span>
          )}
        </nav>
      )}
    </section>
  );
}
