// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://universis.site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    // 必要に応じて固定ページを追加
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/writers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    // カテゴリ一覧（あなたのナビに合わせて）
    { url: `${BASE}/category/university`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/category/japan`,      lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/category/overseas`,   lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/category/highschool`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/category/column`,     lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE}/category/analysis`,   lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];
}
