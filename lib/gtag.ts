// lib/gtag.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-JD9XMQM1MV';

export const pageview = (url: string) => {
  if (typeof window === 'undefined') return;
  // @ts-ignore
  window.gtag?.('config', GA_ID, { page_path: url });
};
