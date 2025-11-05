// app/contact/page.tsx
"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const res = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">お問い合わせ</h1>
      <p className="text-neutral-600 mb-8">
        ライター希望・分析依頼・コラボ相談など、お気軽にご連絡ください。
      </p>

      <form
        action="https://formspree.io/f/xqagglqo" // ← あなたのFormspreeフォームURLに変更
        method="POST"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">所属（個人の場合は個人と明記ください）</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">お名前</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">電話番号</label>
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メールアドレス</label>
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">メッセージ</label>
          <textarea
            name="message"
            rows={5}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:border-sky-500 focus:ring-sky-500"
          />
        </div>

        <button
          type="submit"
          className="rounded-full bg-sky-600 px-5 py-2 font-semibold text-white hover:bg-sky-700"
        >
          送信する
        </button>

        {status === "success" && (
          <p className="text-green-600 text-sm mt-2">送信しました。ありがとうございます！</p>
        )}
        {status === "error" && (
          <p className="text-red-600 text-sm mt-2">送信に失敗しました。時間をおいて再度お試しください。</p>
        )}
      </form>
    </main>
  );
}
