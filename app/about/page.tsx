// app/about/page.tsx
import Link from "next/link";

export const metadata = {
  title: "UNIVERSISとは",
  description:
    "大学ラグビーから『データを楽しむ文化』をつくる。UNIVERSISのミッション／活動方針／コンタクト。",
};

export default function AboutPage() {
  return (
    <main className="relative">
      {/* 背景グラデーション */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sky-50 via-white to-white" />

      {/* ヒーロー */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3 py-1 text-xs text-sky-700 shadow-sm backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          UNIVERSIS<span className="font-extrabold text-sky-600"></span> / ユニヴェルシス
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
          大学ラグビーから
          <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
            「データを楽しむ文化」
          </span>
          をつくる
        </h1>

        <p className="mt-4 text-neutral-600 sm:text-lg">
          UNIVERSIS（読み：ユニヴェルシス）は、大学ラグビーの分析を主とした投稿活動です。
          データ・可視化・ストーリーで、ラグビーの“面白さ”をもっと深く、もっと広く。
        </p>
      </section>

      {/* コンテンツカード */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid gap-6 md:grid-cols-5">
          {/* 左：本文 */}
          <article className="md:col-span-3 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-neutral-900">はじめに</h2>
            <div className="prose prose-neutral mt-3 text-[15px] leading-7">
              <p>
                この度、大学ラグビーの分析を主とした投稿をしていくために、
                <strong>UNIVERSIS</strong>という活動を始めました。読み方は
                <strong>「ユニヴェルシス」</strong>です！
              </p>
              <p>
                モットーは
                <strong>「大学ラグビーから『データを楽しむ文化』を作る」</strong>。
                まずはそこから、ラグビーのデータに関する活動を進めていこうと考えています。
              </p>
              <p>
                このような活動は初めてになるので、手探りで進めていくことになりますが、
                見てくれた方々が
                <strong>「ラグビーを数字で見ると面白い！」</strong>
                <strong>「もっとラグビーを知りたい！」</strong>
                と思ってもらえるような活動をしていきたいです。
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-sky-200 bg-sky-50 p-4">
                <h3 className="text-sm font-semibold text-sky-800">活動ドメイン</h3>
                <ul className="mt-2 list-disc pl-5 text-[14px] text-sky-900/90">
                  <li>大学ラグビーの試合分析・プレビュー/レビュー</li>
                  <li>データ可視化（指標設計・グラフ・ヒートマップ等）</li>
                  <li>コーチング・選手の学習に役立つナレッジ発信</li>
                </ul>
              </div>
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <h3 className="text-sm font-semibold text-neutral-900">スタンス</h3>
                <ul className="mt-2 list-disc pl-5 text-[14px] text-neutral-700">
                  <li>数字は“物語”の導線。定量と定性のバランスを大切に</li>
                  <li>再現可能性・透明性・敬意（相手・競技・観戦者）</li>
                  <li>読みやすく、使いやすく、共有したくなる形で</li>
                </ul>
              </div>
            </div>
          </article>

          {/* 右：ミニ情報／CTA */}
          <aside className="md:col-span-2 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900">UNIVERSISの約束</h3>
              <ul className="mt-3 space-y-2 text-[14px] text-neutral-700">
                <li>・根拠のある可視化と、わかりやすい解説</li>
                <li>・ファクトとリスペクトを最優先</li>
                <li>・読者と一緒に育てる“開かれた分析”</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-indigo-50 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-sky-900">
                相談・コラボレーション
              </h3>
              <p className="mt-2 text-[14px] text-sky-900/80">
                チーム・部活向けの分析連携、記事コラボ、データ可視化のご相談はお気軽に。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  お問い合わせ
                </Link>
                <a
                  href="https://sportsconnect-lab.github.io/rugby-analyzer-site/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-sky-300 bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50"
                >
                  Rugby Analyzer へ
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-neutral-900">更新情報</h3>
              <p className="mt-2 text-[14px] text-neutral-700">
                最新記事はトップのスライダー／一覧からご覧ください。
                カテゴリー別（大学生／日本代表／海外 ほか）でも探索できます。
              </p>
              <div className="mt-3">
                <Link
                  href="/"
                  className="text-sm font-semibold text-sky-700 hover:underline"
                >
                  トップページへ戻る →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
      {/* ボトムCTA */}
<section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
  <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
    <div className="grid items-center gap-6 sm:grid-cols-3">
      <div className="sm:col-span-2">
        <h3 className="text-lg font-bold text-neutral-900">
          一緒に「データを楽しむ文化」を作りませんか。ライター募集中！
        </h3>
        <p className="mt-1 text-[15px] text-neutral-700">
          記事を書いてみたい方、一緒に創造していける方、ぜひ一度お問い合わせください！
        </p>
      </div>
      <div className="flex gap-2 sm:justify-end">
        <a
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 transition"
        >
          希望する
        </a>
      </div>
    </div>
  </div>
</section>


     
    </main>
  );
}
