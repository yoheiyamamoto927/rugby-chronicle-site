// app/page.tsx
import Link from 'next/link';
import { gql } from '@/lib/wp';
import ArticleList from '@/components/ArticleList';
import HeroSlider from '@/components/HeroSlider';
import LeftRail from '@/components/LeftRail';
import { LineChart } from 'lucide-react';
import { POSTS_BY_SLUGS } from '@/lib/queries';
import type { WPPost } from '@/ts/wp';

// キャッシュ無効（?page= で確実に切り替える）
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// ★ここに好きな順番で“固定表示したい記事のスラッグ”を並べる
const CURATED_RANKING_SLUGS = [
  // 例：'2025関西大学ラグビー…'などの日本語はNG。必ず「投稿スラッグ（英数字とハイフン）」にしてください。
  'meijitukuba',
  'kiji-b',
  'kijid',
  'hello-world',
  // 必要に応じて追加
];

// ===== 一覧取得：offsetPagination を使わず「必要件数ぶん first」で取る =====
const POSTS_BY_COUNT = /* GraphQL */ `
  query PostsByCount($count: Int = 10) {
    posts(
      first: $count
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
        views
      }
      pageInfo { hasNextPage }
    }
  }
`;

// スライダーは常に最新5件
const SLIDES_QUERY = /* GraphQL */ `
  query SlidePosts {
    posts(
      first: 5
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

type Search = { page?: string };
type CountResp = { posts: { nodes: WPPost[]; pageInfo: { hasNextPage: boolean } } };
type SlidesResp = { posts: { nodes: WPPost[] } };

export default async function Page(props: {
  searchParams?: Search | Promise<Search>;
}) {
  const sp =
    props.searchParams instanceof Promise
      ? await props.searchParams
      : props.searchParams ?? {};

  const PAGE_SIZE = 10;
  const currentPage = Math.max(1, Number(sp.page ?? 1));
  const count = currentPage * PAGE_SIZE;

  // 現在ページに必要な件数だけ取得 → 末尾 PAGE_SIZE 件を表示
  const listData = await gql<CountResp>(POSTS_BY_COUNT, { count });
  const allFetched = listData.posts?.nodes ?? [];
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pagePosts = allFetched.slice(start, end);

  const hasNext = !!listData.posts?.pageInfo?.hasNextPage;
  const totalPages = hasNext ? currentPage + 1 : currentPage;

  // スライダー（最新5件）
  const slideData = await gql<SlidesResp>(SLIDES_QUERY);

  // WPPost[] 前提で null/undefined を除去して安全化
  const slides: WPPost[] = (slideData?.posts?.nodes ?? []).filter(
    (p): p is WPPost => Boolean(p)
  );

  // ===== 固定ランキングの取得＆整列 =====
  const curatedResp = await gql<{ posts: { nodes: WPPost[] } }>(POSTS_BY_SLUGS, {
    slugs: CURATED_RANKING_SLUGS as unknown as string[],
  });
  const curatedNodes = curatedResp.posts?.nodes ?? [];
  const curatedRanking: WPPost[] = CURATED_RANKING_SLUGS.map(
    (slug) => curatedNodes.find((p) => p.slug === slug)
  )
    .filter((p): p is WPPost => Boolean(p))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* トップ：スライダー */}
      <HeroSlider posts={slides} />

      {/* 本文＋左レール */}
      <section className="border-t border-neutral-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-12">
            <LeftRail />

            <div className="lg:col-span-9">
              {/* 最新記事（ページごとに変わる） */}
              <section className="pb-14 border-b border-neutral-200">
                <div className="flex flex-col items-center text-center mb-10">
                  <LineChart className="h-6 w-6 text-neutral-400 mb-2" />
                  <h2 className="text-2xl font-serif font-semibold text-neutral-900">
                    最新記事
                  </h2>
                  <p className="mt-2 text-sm text-neutral-600 max-w-xl">
                    戦術・データ・文化を横断して読む、UNIVERSIS の新着コンテンツ。
                  </p>
                </div>

                <div key={`page-${currentPage}`}>
                  <ArticleList posts={pagePosts} />
                </div>

                <Pager current={currentPage} totalPages={totalPages} />
              </section>

              {/* RANKING：どのページでも固定表示 */}
              <section className="py-16 border-b border-neutral-200">
                <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-8">
                  RANKING
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {curatedRanking.map((post, i) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="flex flex-col group"
                      prefetch
                    >
                      <div className="relative mb-3">
                        <span className="absolute -top-2 -left-2 text-6xl font-extrabold text-amber-400/90 z-10">
                          {i + 1}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            post.featuredImage?.node?.sourceUrl || '/noimage.jpg'
                          }
                          alt={
                            post.featuredImage?.node?.altText || post.title || ''
                          }
                          className="w-full h-40 object-cover rounded transition duration-300 group-hover:opacity-90"
                          loading="lazy"
                        />
                      </div>
                      <h3 className="text-sm font-semibold leading-snug mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        {new Date(post.date).toLocaleDateString('ja-JP')}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>

              {/* 告知ブロック */}
              <section className="py-20 bg-neutral-950 text-white text-center border-t border-neutral-800">
                <div className="mx-auto max-w-3xl px-6">
                  <p className="text-sm text-neutral-400 tracking-wide mb-4">
                    Presented by{' '}
                    <span className="font-semibold text-white">UNIVERSIS</span>
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif font-semibold mb-4">
                    分析と戦略をチームに。<br className="sm:hidden" /> Rugby
                    Analyzer
                  </h2>
                  <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                    UNIVERSISが運営するアマチュア・大学・高校チーム向けの
                    <br />
                    分析・スカウティング支援プラットフォーム。
                  </p>
                  <a
                    href="https://sportsconnect-lab.github.io/rugby-analyzer-site/#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-8 px-8 py-3 rounded-full bg-white text-neutral-900 font-semibold hover:bg-neutral-200 transition"
                  >
                    Rugby Analyzer サイトを見る →
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ページャ（1 … current-1 current current+1 … last）
function Pager({
  current,
  totalPages,
}: {
  current: number;
  totalPages: number;
}) {
  if (totalPages <= 1) return null;
  const pages = new Set<number>([1, totalPages, current]);
  if (current - 1 >= 1) pages.add(current - 1);
  if (current + 1 <= totalPages) pages.add(current + 1);
  const ordered = [...pages].sort((a, b) => a - b);

  return (
    <nav className="mt-8 flex items-center gap-2">
      {ordered.map((p, i) => {
        const prev = ordered[i - 1];
        const dots = prev !== undefined && p - prev > 1;
        return (
          <span key={p} className="flex items-center">
            {dots && <span className="px-1 text-neutral-400">…</span>}
            <Link
              href={p === 1 ? '/' : `/?page=${p}`}
              className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm ${
                p === current
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-50'
              }`}
              prefetch
            >
              {p}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
