// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_BY_AUTHOR } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string; // URL上の universis / imamoto-takashi
};

type WpImage = {
  sourceUrl?: string;
  altText?: string;
};

type WpCategory = {
  name: string;
  slug: string;
};

type WpAuthorNode = {
  name?: string;
  slug?: string;
};

type WpAuthor = {
  node?: WpAuthorNode;
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

export default async function AuthorPostsPage({
  params,
}: {
  params: Params;
}) {
  const authorSlug = params.slug; // /posts/author/[slug] の slug

  // WPGraphQL では authorName に「ユーザーの slug」を渡すと絞り込める
  const data = await gql<PostsByAuthorResult>(POSTS_BY_AUTHOR, {
    first: 100,
    authorSlug,
  });

  const posts = data?.posts?.nodes ?? [];
  const authorName = posts[0]?.author?.node?.name ?? authorSlug;

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
