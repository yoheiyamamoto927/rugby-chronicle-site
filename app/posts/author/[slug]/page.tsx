// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_FOR_AUTHOR_VIEW } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = {
  slug: string; // URL上の universis / imamoto-takashi など
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

type PostsForAuthorResult = {
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

  // ① 全投稿（最大100件）を取得（ここでは authorSlug などの変数は渡さない）
  const data = await gql<PostsForAuthorResult>(POSTS_FOR_AUTHOR_VIEW, {
    first: 100,
  });

  const allPosts = data?.posts?.nodes ?? [];

  // ② WordPress の author.slug と URL の slug を突き合わせて絞り込み
  const posts = allPosts.filter(
    (p) => p.author?.node?.slug === authorSlug
  );

  // 見出し用の名前（投稿から取得）
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
