'use client';

import { useState } from 'react';

type Props = {
  title?: string;
  note?: string;
  // 送信先のFormspree ID（環境変数優先、未指定なら必須）
  formId?: string;
  // 送信時に一緒に送るメタ情報（どのページから送られたか等）
  context?: string;
  // writer名などを件名プレフィックスとして追加
  subjectPrefix?: string;
};

export default function ContactForm({
  title = 'お問い合わせ',
  note = 'ライター希望・分析依頼・コラボ相談など、お気軽にご連絡ください。',
  formId = process.env.NEXT_PUBLIC_FORMSPREE_ID, // 例: xyzwabcd
  context,
  subjectPrefix,
}: Props) {
  const [done, setDone] = useState(false);
  const action = formId ? `https://formspree.io/f/${formId}` : '';

  return (
    <section className="mt-16">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-neutral-600">{note}</p>

      {done ? (
        <div className="mt-6 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-green-800">
          送信が完了しました。ありがとうございます！
        </div>
      ) : (
        <form
          action={action}
          method="POST"
          onSubmit={() => setDone(true)}
          className="mt-6 space-y-5 font-sans text-[15px] text-neutral-800"
        >
          {/* どのページから送られたか（任意） */}
          {context && <input type="hidden" name="context" value={context} />}

          {/* 件名を見やすく（任意） */}
          {subjectPrefix && (
            <input type="hidden" name="_subject" value={`${subjectPrefix} への問い合わせ`} />
          )}

          <div>
            <label className="block text-sm font-semibold mb-1 tracking-wide">お名前</label>
            <input
              type="text"
              name="name"
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
              placeholder="山田 太郎"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 tracking-wide">メールアドレス</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 tracking-wide">メッセージ</label>
            <textarea
              name="message"
              rows={5}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
              placeholder="ご用件をお書きください。"
            />
          </div>

          {/* スパム対策（Formspree推奨のhoneypot） */}
          <input type="text" name="_gotcha" style={{ display: 'none' }} />

          <button
            type="submit"
            className="rounded-full bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700"
          >
            送信する
          </button>

          <p className="text-xs text-neutral-500 mt-2">
            送信でプライバシーポリシーに同意したものとみなします。
          </p>
        </form>
      )}
    </section>
  );
}
