// app/sitemap.ts
import { gql } from "@/lib/wp"; // ← wp.ts 内の fetch 関数を使ってもOK
import { SITE_URL } from "@/lib/constants";

export default async function sitemap() {
  // ① WordPressから記事一覧を取得
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          {
            posts(first: 100) {
              nodes {
                slug
                date
              }
            }
          }
        `,
      }),
    }
  );

  const json = await res.json();
  const posts = json.data.posts.nodes;

  // ② 各記事ページのURLを返す
  const postUrls = posts.map((post: any) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${post.slug}`,
    lastModified: post.date,
  }));

  // ③ 固定ページ（トップ、カテゴリ、会社案内など）
  const staticUrls = [
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/about`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/category`, lastModified: new Date() },
    { url: `${process.env.NEXT_PUBLIC_SITE_URL}/contact`, lastModified: new Date() },
  ];

  // ④ 結果を返す
  return [...staticUrls, ...postUrls];
}
