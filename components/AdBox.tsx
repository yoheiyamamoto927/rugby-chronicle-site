'use client';

import Image from 'next/image';
import Link from 'next/link';

type Props = {
  src: string;            // 例: "/ads/rugby-analyzer-banner.png"
  href: string;           // 例: "https://sportsconnect-lab.github.io/rugby-analyzer-site/"
  alt?: string;
  caption?: string;
};

export default function AdBox({
  src,
  href,
  alt = 'Advertisement',
  caption = 'Rugby Analyzer を見る →',
}: Props) {
  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-2xl border border-neutral-200 hover:shadow-md transition-shadow"
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* 画像領域 */}
      <div className="relative aspect-[4/3]">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 320px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* キャプション */}
      <div className="px-4 py-3 text-sm font-medium text-blue-600">
        {caption}
      </div>
    </Link>
  );
}
