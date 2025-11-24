// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string; // /posts/author/universis など
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

// ★ URL の slug → WP 上の表示名 のマッピング
const AUTHOR_NAME_MAP: Record<string, string> = {
  universis: "YOHEI YAMAMOTO",
  "imamoto-takashi": "IMAMOTO TAKASHI",
};

export default async function AuthorPostsPage({
  params,
}: {
  params: Params;
}) {
  const authorSlug = params.slug; // universis / imamoto-takashi
  const mappedName = AUTHOR_NAME_MAP[authorSlug];

  // 投稿を多めに取得
  const data = await gql<PostsResult>(POSTS, { first: 100 });
  const all = data?.posts?.nodes ?? [];

  // slug か name どちらか一致すれば OK にする
  const posts = all.filter((p) => {
    const s = p.author?.node?.slug;
    const n = p.author?.node?.name;
    return (
      (s && s === authorSlug) ||
      (mappedName && n === mappedName)
    );
  });

  const authorName =
    posts[0]?.author?.node?.name || mappedName || authorSlug;

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
