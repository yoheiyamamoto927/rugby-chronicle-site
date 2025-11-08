// components/GAListener.tsx
"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

function GAInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id || typeof window === "undefined" || !window.gtag) return;
    const url =
      pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    window.gtag("config", id, { page_path: url });
  }, [pathname, searchParams]);

  return null;
}

export default function GAListener() {
  // Suspenseでラップしてエラー回避
  return (
    <Suspense fallback={null}>
      <GAInner />
    </Suspense>
  );
}
