// components/Toc.tsx
'use client';

type TocItem = { id: string; text: string };

export default function Toc({ items }: { items: TocItem[] }) {
  return (
    <nav className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold text-neutral-500 mb-3">目次</div>
      <ul className="space-y-2">
        {items.map((h) => (
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
  );
}
