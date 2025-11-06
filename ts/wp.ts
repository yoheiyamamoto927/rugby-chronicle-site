// ts/wp.ts
export type WPPost = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  excerpt?: string | null;
  featuredImage?: {
    node?: {
      sourceUrl?: string | null;
      altText?: string | null;
    } | null;
  } | null;
  views?: number | null;
};
