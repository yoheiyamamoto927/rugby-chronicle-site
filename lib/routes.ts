// lib/routes.ts

/** カテゴリ（WordPressのカテゴリ slug と合わせる） */
export const CATEGORY_LINKS = [
  { en: 'UNIVERSITY',         ja: '大学生',      href: '/category/university' },
  { en: 'LEAGUEONE',         ja: 'リーグワン',      href: '/category/leagueone' },
  { en: 'JAPAN XV',           ja: '日本代表',    href: '/category/japan-xv' },
  { en: 'OVERSEAS',           ja: '海外',        href: '/category/overseas' },
  //{ en: 'HIGHSCHOOL',         ja: '高校生',      href: '/category/highschool' },
  { en: 'COLUMN',             ja: 'コラム',      href: '/category/column' },
  { en: 'TACTICS & ANALYSIS', ja: '戦術・分析',  href: '/category/tactics-analysis' },
] as const;

/** 固定ページ/外部リンク */
export const PAGE_LINKS = {
  writer:        { en: 'WRITER',           ja: 'ライター',                    href: '/writers' },
  about:         { en: 'ABOUT',            ja: 'UNIVERSISとは',               href: '/about' },
  rugbyAnalyzer: { en: 'RUGBY ANALYZER',   ja: '分析依頼（Rugby Analyzer）', href: 'https://sportsconnect-lab.github.io/rugby-analyzer-site/', external: true },

  // Information（フッター下段）
  company:  { label: '運営会社',                                href: '/legal/company' },
  terms:    { label: '利用規約',                                href: '/legal/terms' },
  privacy:  { label: '個人情報保護方針',                        href: '/legal/privacy' },
  cookies:  { label: 'クッキーポリシー',                         href: '/legal/cookies' },
  tokusho:  { label: '特定商取引法に基づく表記',                 href: '/legal/tokusho' },
  faq:      { label: 'FAQ',                                     href: '/faq' },
  contactS: { label: 'サービスに関するお問い合わせ',             href: '/contact/service' },
  contactAd:{ label: '広告掲載に関するお問い合わせ',             href: '/contact/ads' },
} as const;
