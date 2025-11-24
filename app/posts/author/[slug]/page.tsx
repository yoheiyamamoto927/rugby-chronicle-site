// app/posts/author/[slug]/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS_FOR_AUTHOR_VIEW } from "@/lib/queries";

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

type PostsForAuthorViewResult = {
  posts: {
    nodes: WpPost[];
  };
};

export default async function AuthorPostsPage({ params }: { params: Params }) {
  const authorSlug = params.slug;

  // author 付きで全件取得 → Next 側で絞る
  const data = await gql<PostsForAuthorViewResult>(POSTS_FOR_AUTHOR_VIEW, {
    first: 200,
  });

  const all = data?.posts?.nodes ?? [];

  const posts = all.filter((p) => p.author?.node?.slug === authorSlug);

  const authorName = posts[0]?.author?.node?.name ?? authorSlug;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      <h1 className="mb-6 text-2xl font-bold">
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
