// app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { gql } from "@/lib/wp";
import { POST_BY_SLUG } from "@/lib/queries";

type PageParams = { slug: string };

type PostData = {
  post: {
    id: string;
    slug: string;
    title: string;
    date: string;
    content: string;
    excerpt?: string;
    author?: { node?: { name?: string; slug?: string } };
    featuredImage?: { node?: { sourceUrl?: string; altText?: string } };
    categories?: { nodes: { name: string; slug: string }[] };
  } | null;
};

// --- Metadata（型エラー修正＋実データ取得対応）---
export async function generateMetadata({
  params,
}: {
  params: PageParams | Promise<PageParams>;
}) {
  const p =
    params && typeof (params as any).then === "function"
      ? await (params as Promise<PageParams>)
      : (params as PageParams);

  const slug = decodeURI(p.slug || "");
  if (!slug) return {};

  try {
    const data = await gql<PostData>(POST_BY_SLUG, { slug });
    const post = data?.post;
    if (!post) return {};

    return {
      title: `${post.title}｜大学ラグビー分析メディア UNIVERSIS`,
      description:
        post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 100) ||
        "大学ラグビーや試合分析、戦術考察を配信。",
      openGraph: {
        title: post.title,
        description:
          post.excerpt?.replace(/<[^>]+>/g, "").slice(0, 150) ||
          "大学ラグビー分析記事",
        url: `https://universis.site/posts/${slug}`,
        type: "article",
        images: post.featuredImage?.node?.sourceUrl
          ? [{ url: post.featuredImage.node.sourceUrl }]
          : undefined,
      },
      alternates: {
        canonical: `https://universis.site/posts/${slug}`,
      },
    };
  } catch {
    return {};
  }
}

// --- h2 を目次化＆本文に id 付与 ---
function buildToc(html: string) {
  const items: { id: string; text: string }[] = [];
  let seq = 0;
  const withIds = (html || "").replace(
    /<h2([^>]*)>([\s\S]*?)<\/h2>/gi,
    (_m, attr, inner) => {
      const plain = inner.replace(/<[^>]+>/g, "").trim();
      const idMatch = String(attr).match(/id="([^"]+)"/i);
      const id = idMatch
        ? idMatch[1]
        : `sec-${(++seq).toString().padStart(2, "0")}`;
      items.push({ id, text: plain });
      if (idMatch) return `<h2 ${attr}>${inner}</h2>`;
      return `<h2 id="${id}"${attr ? ` ${attr}` : ""}>${inner}</h2>`;
    }
  );
  return { html: withIds, items };
}

export default async function PostPage({
  params,
}: {
  params: PageParams | Promise<PageParams>;
}) {
  const p =
    params && typeof (params as any).then === "function"
      ? await (params as Promise<PageParams>)
      : (params as PageParams);

  const rawSlug = p?.slug ?? "";
  const slug = rawSlug ? decodeURI(rawSlug) : "";
  if (!slug) return notFound();

  // 記事取得
  const data = await gql<PostData>(POST_BY_SLUG, { slug }).catch(() => null);
  if (!data?.post) return notFound();

  const post = data.post;

  const authorName = post.author?.node?.name ?? "yamamoto";
  const authorSlug = post.author?.node?.slug ?? "yamamoto";

  const date = new Date(post.date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // 目次
  const { html: contentWithIds, items: toc } = buildToc(post.content || "");

  // 共有URL
  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";
  const canonical = `${siteBase}/posts/${slug}`;
  const u = encodeURIComponent(canonical);
  const t = encodeURIComponent(post.title);

  return (
    <main className="bg-white">
      {/* アイキャッチ */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="w-full border-b bg-neutral-50">
          <img
            src={post.featuredImage.node.sourceUrl!}
            alt={post.featuredImage.node.altText || post.title}
            className="mx-auto h-[320px] w-full max-w-5xl object-cover"
          />
        </div>
      )}

      {/* 本文＋サイドバー */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:px-8 xl:grid-cols-12">
        {/* 本文 */}
        <article className="xl:col-span-8">
          {/* 日付 & 著者リンク */}
          <div className="mb-3 text-sm text-neutral-500">
            <time dateTime={post.date}>{date}</time>
            <span className="mx-1">/</span>
            <Link
              href={`/posts?author=${encodeURIComponent(authorSlug)}`}
              className="hover:underline"
            >
              {authorName}
            </Link>
            {post.categories?.nodes?.length ? (
              <>
                <span className="mx-1">/</span>
                {post.categories.nodes.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="mr-2 hover:underline"
                  >
                    {c.name}
                  </Link>
                ))}
              </>
            ) : null}
          </div>

          <h1 className="mb-6 text-3xl font-serif font-bold tracking-tight text-neutral-900 sm:text-4xl">
            {post.title}
          </h1>

          {/* 本文 */}
          <div
            className="wp-content leading-[1.9]"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* ライターカード */}
          <div className="mt-12 border-t pt-8">
            <div className="flex items-center gap-4">
              <img
                src="/avatar-writer.png"
                alt="Author"
                className="h-12 w-12 rounded-full object-cover ring-1 ring-neutral-200"
              />
              <div>
                <Link
                  href={`/posts?author=${encodeURIComponent(authorSlug)}`}
                  className="font-semibold text-neutral-900 hover:underline"
                >
                  {authorName}
                </Link>
                <p className="text-sm text-neutral-600">
                  データと戦術のあいだを翻訳する人。UNIVERSIS／Rugby Analyzer。
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* サイドバー */}
        <aside className="xl:col-span-4 relative">
          {/* 目次 */}
          {toc.length > 0 && (
            <nav className="mb-8" aria-label="目次">
              <div className="mb-3 text-xs font-semibold text-neutral-500">
                目次
              </div>
              <ul className="space-y-2">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a
                      href={`#${h.id}`}
                      className="text-sm text-neutral-700 hover:text-neutral-900 hover:underline"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {/* 固定サイド（共有／広告） */}
          <div className="hidden xl:block sticky top-28 space-y-6">
            {/* Share */}
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-3 text-xs font-semibold text-neutral-500">
                Share
              </div>
              <div className="grid grid-cols-4 gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 place-items-center rounded bg-black text-xs font-bold text-white"
                >
                  X
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${u}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 place-items-center rounded bg-[#1877F2] text-xs font-bold text-white"
                >
                  F
                </a>
                <a
                  href={`https://social-plugins.line.me/lineit/share?url=${u}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 place-items-center rounded bg-[#06C755] text-xs font-bold text-white"
                >
                  L
                </a>
                <a
                  href={`https://b.hatena.ne.jp/entry/panel/?url=${u}&btitle=${t}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-10 place-items-center rounded bg-[#00A4DE] text-xs font-bold text-white"
                >
                  B!
                </a>
              </div>
            </div>

            {/* JSON-LD 構造化データ */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "NewsArticle",
                  headline: post.title,
                  description: post.excerpt || "",
                  datePublished: post.date,
                  author: {
                    "@type": "Person",
                    name: authorName,
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "UNIVERSIS",
                    logo: {
                      "@type": "ImageObject",
                      url: "https://universis.site/logo.png",
                    },
                  },
                  mainEntityOfPage: canonical,
                }),
              }}
            />

            {/* Ad */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
              <img
                src="/rugby-analyzer-banner.png"
                alt="ad"
                className="h-56 w-full rounded-lg object-cover"
              />
              <a
                href="https://sportsconnect-lab.github.io/rugby-analyzer-site/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-blue-600 hover:underline"
              >
                Rugby Analyzer を見る →
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
