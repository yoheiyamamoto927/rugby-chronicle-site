// app/writers/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { gql } from '@/lib/wp';
import { AUTHORS } from '@/lib/queries';
import WriterCard from '@/components/WriterCard';

type AuthorNode = {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  avatar?: { url?: string | null } | null;
  posts?: { nodes?: { id: string }[] } | null;
};

type AuthorsData = {
  users?: { nodes?: AuthorNode[] } | null;
};

export const metadata = {
  title: 'Writers | UNIVERSIS',
};

export default async function WritersPage() {
  const data = await gql<AuthorsData>(AUTHORS, { first: 50 }).catch(() => null);
  if (!data?.users?.nodes) return notFound();

  const authors = data.users.nodes.filter(Boolean);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ===== ヘッダー ===== */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-neutral-900">
            Writers
          </h1>
          <p className="mt-2 text-neutral-600">
            UNIVERSISで執筆・分析を行うライター / アナリストの一覧です。
          </p>
        </header>

        {/* ===== ライターカード一覧 ===== */}
        {authors.length > 0 ? (
          <section
            aria-label="ライター一覧"
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {authors.map((a) => (
              <WriterCard
                key={a.id}
                name={a.name}
                slug={a.slug}
                bio={a.description || undefined}
                avatarUrl={a.avatar?.url || undefined}
                postsCount={a.posts?.nodes?.length ?? 0}
              />
            ))}
          </section>
        ) : (
          <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-6">
            <h2 className="text-lg font-semibold text-neutral-900">現在、登録中のライターはいません。</h2>
            <p className="mt-1 text-neutral-600 text-sm">
              ライター募集しています。下記のボタンからお問い合わせください。
            </p>
          </section>
        )}

        {/* ===== 区切り ===== */}
        <hr className="my-12 border-neutral-200" />

        {/* ===== CTA（文言＋ボタンで /contact へ） ===== */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-neutral-900">
              一緒に「データを楽しむ文化」を作りませんか。
            </h2>
            <p className="mt-1 text-neutral-600 text-sm">
              ライター応募・分析/コラボ相談など、お気軽にご連絡ください。
            </p>
          </div>

          <Link
  href={{
    pathname: '/contact',
    query: {
      from: 'writers',
      subject: 'Writersからの問い合わせ',
    },
  }}
  className="inline-flex items-center justify-center rounded-full bg-sky-600 text-white px-6 py-2.5 font-semibold tracking-wide shadow-sm hover:bg-sky-700 transition-colors duration-200"
>
  問い合わせる
</Link>

        </section>
      </div>
    </main>
  );
}
