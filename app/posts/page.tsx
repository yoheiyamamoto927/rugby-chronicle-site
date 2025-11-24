// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_BY_AUTHOR } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string; // universis / imamoto-takashi など
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

// WP の「著者名」と URL スラッグのマッピング
const displayNameMap: Record<string, string> = {
  universis: "YOHEI YAMAMOTO",
  "imamoto-takashi": "IMAMOTO TAKASHI",
};

export default async function AuthorPostsPage({
  params,
}: {
  params: Params;
}) {
  // /posts/author/[slug] の [slug]
  const authorSlug = params.slug;

  // GraphQL の authorName に渡す値（WP上の表示名）
  const authorNameArg = displayNameMap[authorSlug] ?? authorSlug;

  // 🔍 ライター名でサーバー側フィルタ
  const data = await gql<PostsByAuthorResult>(POSTS_BY_AUTHOR, {
    first: 100,
    // ❗ここは必ず authorSlug というキー名で渡す（クエリ定義と一致させる）
    authorSlug: authorNameArg,
  });

  const posts = data?.posts?.nodes ?? [];

  // 画面に出す見出し用の名前
  const headingName = displayNameMap[authorSlug] ?? posts[0]?.author?.node?.name ?? authorSlug;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      <h1 className="mb-4 text-2xl font-bold">
        ライター:
        <span className="ml-1">{headingName}</span>
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
