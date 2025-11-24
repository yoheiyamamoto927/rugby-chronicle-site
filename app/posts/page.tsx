// app/posts/page.tsx
import { gql } from "@/lib/wp";
import ArticleList from "@/components/ArticleList";
import { POSTS } from "@/lib/queries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

export default async function PostsPage() {
  const data = await gql<PostsResult>(POSTS, { first: 12 });
  const posts = data?.posts?.nodes ?? [];

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-0 py-10">
      <h1 className="mb-4 text-2xl font-bold">記事一覧</h1>

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
