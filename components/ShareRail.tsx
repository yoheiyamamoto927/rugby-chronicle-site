// components/ShareRail.tsx
'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  url: string;
  title: string;
  className?: string;
};

export default function ShareRail({ url, title, className }: Props) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = useMemo(
    () => [
      {
        name: 'X',
        href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
        bg: 'bg-black',
        label: 'Share on X',
      },
      {
        name: 'Facebook',
        href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
        bg: 'bg-[#1877F2]',
        label: 'Share on Facebook',
      },
      {
        name: 'LINE',
        href: `https://social-plugins.line.me/lineit/share?url=${u}`,
        bg: 'bg-[#06C755]',
        label: 'Share on LINE',
      },
      {
        name: 'Hatena',
        href: `https://b.hatena.ne.jp/entry/panel/?url=${u}&btitle=${t}`,
        bg: 'bg-[#00A4DE]',
        label: 'Bookmark on Hatena',
      },
    ],
    [u, t]
  );

  return (
    <div
      className={cn(
        'fixed left-6 top-[30vh] z-30 flex flex-col gap-3',
        className
      )}
    >
      {links.map((l) => (
        <a
          key={l.name}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className={`${l.bg} text-white rounded-full w-12 h-12 grid place-items-center shadow-lg hover:opacity-90 transition`}
        >
          <span className="text-xs font-bold">{l.name[0]}</span>
        </a>
      ))}
    </div>
  );
}
