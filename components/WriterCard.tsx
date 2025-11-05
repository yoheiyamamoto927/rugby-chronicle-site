// components/WriterCard.tsx
'use client';

import Link from 'next/link';

type Props = {
  name: string;
  slug?: string;
  bio?: string;
  avatarUrl?: string | null;
  postsCount?: number;
};

export default function WriterCard({
  name,
  slug,
  bio,
  avatarUrl,
  postsCount = 0,
}: Props) {
  const img = avatarUrl || '/avatar-writer.png'; // 既存の画像を流用

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img}
        alt={name}
        className="h-16 w-16 rounded-full object-cover ring-1 ring-neutral-200"
      />
      <div className="mt-4">
        <div className="text-lg font-semibold text-neutral-900">{name}</div>
        {postsCount !== undefined && (
          <div className="mt-1 text-sm text-neutral-500">
            記事数：{postsCount}
          </div>
        )}
        {bio ? (
          <p className="mt-3 text-sm text-neutral-700 line-clamp-3">
            {bio}
          </p>
        ) : (
          <p className="mt-3 text-sm text-neutral-500">
            プロフィール準備中です。
          </p>
        )}
      </div>

      {/* 将来 author 詳細ページを作るなら /author/[slug] に差し替え */}
      {slug ? (
        <div className="mt-5">
          <Link
            href={`/posts?author=${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            記事一覧を見る →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
