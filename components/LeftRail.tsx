// components/LeftRail.tsx
'use client';

type Props = {
  // ホーム用なので URL は固定（必要なら props で差し替えOK）
  siteUrl?: string;
};

export default function LeftRail({ siteUrl }: Props) {
  const base =
    siteUrl?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'http://localhost:3000';

  const shareUrl = encodeURIComponent(base);
  const shareText = encodeURIComponent('UNIVERSIS | 新着記事');

  return (
    <aside
      aria-label="シェアと広告"
      className="hidden lg:block lg:col-span-3"
    >
      <div className="sticky top-24 space-y-6">
        {/* Share */}
        <nav aria-label="Share" className="rounded-xl border bg-white p-5 shadow-sm">
          <div className="mb-3 text-xs font-semibold text-neutral-500">Share</div>
          <div className="grid grid-cols-4 gap-2">
            <a
              href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded bg-black text-xs font-bold text-white"
              aria-label="X でシェア"
              title="X でシェア"
            >
              X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded bg-[#1877F2] text-xs font-bold text-white"
              aria-label="Facebook でシェア"
              title="Facebook でシェア"
            >
              F
            </a>
            <a
              href={`https://social-plugins.line.me/lineit/share?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded bg-[#06C755] text-xs font-bold text-white"
              aria-label="LINE でシェア"
              title="LINE でシェア"
            >
              L
            </a>
            <a
              href={`https://b.hatena.ne.jp/entry/panel/?url=${shareUrl}&btitle=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-10 place-items-center rounded bg-[#00A4DE] text-xs font-bold text-white"
              aria-label="はてなブックマーク"
              title="はてなブックマーク"
            >
              B!
            </a>
          </div>
        </nav>

        {/* Ad slot */}
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/rugby-analyzer-banner.png"
            alt="スポンサー"
            className="h-56 w-full rounded-lg object-cover"
            loading="lazy"
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
  );
}
