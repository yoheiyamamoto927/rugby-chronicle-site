'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview } from '@/lib/gtag';

export default function GaListener() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = search?.toString() ? `${pathname}?${search.toString()}` : pathname;
    pageview(url);          // 初回＋以後の遷移を全部計測
  }, [pathname, search]);

  return null;
}
