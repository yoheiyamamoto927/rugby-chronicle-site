// app/category/[slug]/page.tsx
// 常にサーバーで動的にレンダリング（SSGしない）
export const dynamic = "force-dynamic";
// ついでにキャッシュを短めに
export const revalidate = 60;

import Link from "next/link";
import { notFound } from "next/navigation";
import { gql } from "@/lib/wp";
import { CATEGORY_BY_SLUG, AUTHOR_BY_SLUG } from "@/lib/queries";

// ライターカテゴリ slug → author.slug の対応
const AUTHOR_SLUG_BY_WRITER_CATEGORY: Record<string, string> = {
  "yamamoto-yohei": "universis", // 山本陽平（WP のユーザーslugに合わせてね）
  "imamoto-takashi": "imamoto-takashi", // 今本さん
};

/* ========= Types ========= */
type CatNode = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
};

type PostNode = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt?: string | null;
  featuredImage?:
    | { node?: { sourceUrl?: string; altText?: string } | null }
    | null;
  categories?: { nodes: CatNode[] };
};

type CategoryData = {
  category: {
    id: string;
    name: string;
    slug: string;
    children?: { nodes: CatNode[] };
    posts: { nodes: PostNode[] };
  } | null;
};

type AuthorData = {
  user: {
    name: string;
    description?: string | null;
    avatar?: { url?: string | null } | null;
  } | null;
};

type PageParams = { slug: string };

/* ========= Utils ========= */
function formatJP(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/** 指定カテゴリの子カテゴリだけを記事のカテゴリ配列から拾って返す */
function pickChildBadges(post: PostNode, parentId: string): CatNode[] {
  const nodes = post.categories?.nodes ?? [];
  return nodes.filter((c) => c.parentId === parentId);
}

/* ========= Page ========= */
export default async function CategoryPage({
  params,
}: {
  params: Promise<PageParams> | PageParams;
}) {
  // Next.js 16: params が Promise になる場合があるので吸収
  const p = params instanceof Promise ? await params : params;

  const slug = p?.slug ? decodeURI(p.slug) : "";
  if (!slug) return notFound();

  // カテゴリー取得
  const data = await gql<CategoryData>(CATEGORY_BY_SLUG, { slug });
  if (!data?.category) return notFound();

  const cat = data.category;
  const posts = cat.posts?.nodes ?? [];

  // ★ ライターカテゴリなら WP のユーザープロフィールも取得
  const authorSlugForCategory = AUTHOR_SLUG_BY_WRITER_CATEGORY[slug];
  let writerProfile:
    | {
        name: string;
        description: string | null;
      }
    | null = null;

  if (authorSlugForCategory) {
    const authorData = await gql<AuthorData>(AUTHOR_BY_SLUG, {
      slug: authorSlugForCategory,
    }).catch(() => null);

    if (authorData?.user) {
      writerProfile = {
        name: authorData.user.name,
        description: authorData.user.description ?? null,
      };
    }
  }

  // 左上のリード文（通常カテゴリ用）
  const leadBySlug: Record<string, string> = {
  university:
    "大学ラグビーの試合分析・戦術解説・注目選手情報をわかりやすくまとめて紹介。関東対抗戦・リーグ戦・関西リーグ・大学選手権の見どころや、勝敗を分けたポイントを深掘りし、観戦の理解が深まる視点を提供します。",

  japan:
    "ラグビー日本代表の試合レビュー、戦術分析、選手評価を専門的に解説。最新の代表戦から選手起用、戦略の変化まで、日本代表をより深く理解できる情報を丁寧にまとめています。",

  leagueone:
    "リーグワン（Japan Rugby League One）の試合分析・チーム戦術・選手の特徴をわかりやすく解説。ラグビー観戦がより面白くなるデータ分析や試合レビューを通じて、各クラブの強みと課題を深掘りします。",

  overseas:
    "海外ラグビー（国際試合・海外クラブ）のレビュー、戦術解説、最新トレンドを日本人にも分かりやすく紹介。世界の強豪チームの特徴やプレースタイルを比較し、日本ラグビーに活かせる視点もまとめています。",

  highschool:
    "高校ラグビーの注目選手・強豪校の戦術・試合の見どころを詳しく解説。花園（全国高校ラグビー）を中心に、次世代のスター候補たちの魅力やチーム戦略を読み解き、高校ラグビーをもっと楽しめる情報を届けます。",

  column:
    "ラグビーの魅力をより深く知るためのコラムを掲載。文化・歴史・戦術・観戦術など、ラグビーを“知的に楽しむ”ための視点を幅広く取り上げ、読者の理解と興味を深める読み物をお届けします。",

  tactics:
    "ラグビー戦術・データ分析・プレー構造を体系的に解説。試合で何が起きているのか、各プレーの意図、チーム戦略の背景を“見える化”し、戦術理解が一段深まる専門コンテンツを提供します。",
};


  const lead = leadBySlug[cat.slug] ?? `${cat.name} の最新記事です。`;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* ===== タイトル ===== */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 mb-6">
          {cat.name.toUpperCase()}
        </h1>

        {/* ===== 黒背景の説明ボックス ===== */}
        <div className="bg-neutral-950 text-white rounded-3xl p-8 mb-12 shadow-lg max-w-4xl">
          {/* writerProfile があればライター名、なければ従来の見出し */}
          <h2 className="text-xl font-bold mb-4">
            {writerProfile ? writerProfile.name : "ラグビーを読み解く"}
          </h2>

          {/* 本文：writerProfile.description を優先し、なければ lead */}
          <p className="text-[15px] leading-relaxed text-neutral-200 mb-6 whitespace-pre-line">
            {writerProfile?.description || lead}
          </p>

          {cat.slug === "university" && !!cat.children?.nodes?.length && (
            <div>
              <div className="text-xs font-semibold text-neutral-400 mb-3 tracking-wide">
                SUB CATEGORIES
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.children!.nodes.map((c) => (
                  <span
                    key={c.slug}
                    className="inline-block rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-200 hover:bg-neutral-800 transition"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== 記事カードグリッド ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {posts.map((post) => {
            const badges =
              cat.slug === "university" ? pickChildBadges(post, cat.id) : [];

            return (
              <article
                key={post.id}
                className="group border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage?.node?.sourceUrl || "/noimage.jpg"}
                    alt={post.featuredImage?.node?.altText || post.title}
                    className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </Link>

                <div className="p-4">
                  <div className="text-xs text-neutral-500 mb-1">
                    {formatJP(post.date)}
                  </div>
                  <h2 className="font-semibold text-lg text-neutral-900 leading-snug mb-2">
                    <Link
                      href={`/posts/${encodeURIComponent(post.slug)}`}
                      className="hover:underline"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  {!!badges.length && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {badges.map((b) => (
                        <span
                          key={b.slug}
                          className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700"
                        >
                          {b.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {post.excerpt && (
                    <div
                      className="line-clamp-3 text-sm text-neutral-600 [&_*]:!m-0"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  )}

                  <Link
                    href={`/posts/${encodeURIComponent(post.slug)}`}
                    className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
                  >
                    続きを読む →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
