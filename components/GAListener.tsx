// components/GAListener.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export default function GAListener() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_ID;
    if (!id || typeof window === "undefined" || !window.gtag) return;
    const url = pathname + (search?.toString() ? `?${search.toString()}` : "");
    window.gtag("config", id, { page_path: url });
  }, [pathname, search]);

  return null;
}
