// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_BY_AUTHOR } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string; // universis / imamoto-takashi
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

type PostsByAuthorResult = {
  posts: {
    nodes: WpPost[];
  };
};

// ★ display_name（WP の authorName が使う値）との対応表
const displayNameMap: Record<string, string> = {
  universis: "YOHEI YAMAMOTO",
  "imamoto-takashi": "IMAMOTO TAKASHI",
};

export default async function AuthorPostsPage({
  params,
}: {
  params: Params;
}) {
  const authorSlug = params.slug;

  // ★ displayName を確定（WPGraphQL の authorName 用）
  const displayName =
    displayNameMap[authorSlug] ?? authorSlug; // slug が無い場合 fallback

  // ★ displayName でフィルタして記事取得
  const data = await gql<PostsByAuthorResult>(POSTS_BY_AUTHOR, {
    first: 100,
    displayName,
  });

  const posts = data?.posts?.nodes ?? [];
  const authorName = posts[0]?.author?.node?.name ?? displayName;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      <h1 className="mb-4 text-2xl font-bold">
        ライター:
        <span className="ml-1">{authorName}</span>
        の記事一覧
      </h1>

      {posts.length === 0 ? (
        <p className="text-sm text-neutral-500">まだ記事がありません。</p>
      ) : (
        <ArticleList posts={posts} />
      )}
    </section>
  );
}
