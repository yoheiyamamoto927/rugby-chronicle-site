'use client';

import Image from 'next/image';

type Props = {
  name: string;
  avatarUrl?: string | null;
  tagline?: string; // 任意：肩書き・簡単な説明
};

export default function AuthorCard({ name, avatarUrl, tagline }: Props) {
  return (
    <aside className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-neutral-200">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={name}
              width={56}
              height={56}
              className="h-14 w-14 object-cover"
            />
          ) : (
            <div className="h-14 w-14" />
          )}
        </div>
        <div>
          <div className="text-base font-semibold text-neutral-900">{name}</div>
          {tagline && <div className="text-sm text-neutral-600">{tagline}</div>}
        </div>
      </div>
    </aside>
  );
}
