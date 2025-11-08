// app/category/[slug]/page.tsx
// 常にサーバーで動的にレンダリング（SSGしない）
export const dynamic = 'force-dynamic';
// ついでにキャッシュを短めに
export const revalidate = 60;

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { gql } from '@/lib/wp';
import { CATEGORY_BY_SLUG } from '@/lib/queries';

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
  featuredImage?: { node?: { sourceUrl?: string; altText?: string } | null } | null;
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

type PageParams = { slug: string };

/* ========= Utils ========= */
function formatJP(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
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

  const slug = p?.slug ? decodeURI(p.slug) : '';
  if (!slug) return notFound();

  const data = await gql<CategoryData>(CATEGORY_BY_SLUG, { slug });
  if (!data?.category) return notFound();

  const cat = data.category;
  const posts = cat.posts?.nodes ?? [];

  // 左上のリード文（必要なら編集）
  const leadBySlug: Record<string, string> = {
    university:
      '大学ラグビーの最新試合や考察を、関東対抗戦・関東リーグ戦・関西リーグ戦・大学選手権などの視点で整理して届けます。',
    japan: '日本代表のゲームレビューや分析、選手コラムなどをお届けします。',
    leagueone: '日本最高峰League Oneの試合をもとに、分析します。。',
    overseas: '海外ラグビーの試合レビュー、トレンド、分析を横断して紹介します。',
    highschool: '高校ラグビーの注目試合・注目選手の観点などを扱います。',
    column: '寄稿・連載コラム。ラグビーをもっと楽しむための読み物です。',
    tactics: '戦術・データ・文化の交差点で、チームを強くする視点をまとめます。',
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
          <h2 className="text-xl font-bold mb-4">大学ラグビーを深掘る</h2>
          <p className="text-[15px] leading-relaxed text-neutral-200 mb-6">
            {lead}
          </p>

          {cat.slug === 'university' && !!cat.children?.nodes?.length && (
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
              cat.slug === 'university' ? pickChildBadges(post, cat.id) : [];

            return (
              <article
                key={post.id}
                className="group border border-neutral-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <Link href={`/posts/${encodeURIComponent(post.slug)}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.featuredImage?.node?.sourceUrl || '/noimage.jpg'}
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
