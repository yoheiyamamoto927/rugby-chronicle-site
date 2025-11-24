// lib/queries.ts
// すべて「GraphQLクエリ文字列をexportするだけ」のファイルです。

/** 記事一覧（新着順） */
export const POSTS = /* GraphQL */ `
  query Posts($first: Int = 12) {
    posts(
      first: $first
      where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

/** 記事1件（slug） */
export const POST_BY_SLUG = /* GraphQL */ `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      content(format: RENDERED)
      author {
        node {
          name
          slug
          description
          avatar { url }
        }
      }
      featuredImage { node { sourceUrl altText } }
      categories { nodes { name slug } }
    }
  }
`;

/** 静的生成などで使う slug 一覧 */
export const SLUGS = /* GraphQL */ `
  query Slugs($first: Int = 100) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes { slug }
    }
  }
`;

/** カテゴリーの記事一覧（categoryName 指定） */
export const CATEGORY_POSTS = /* GraphQL */ `
  query CategoryPosts($slug: ID!, $slugStr: String!, $first: Int = 12) {
    category(id: $slug, idType: SLUG) {
      name
      slug
      description
    }
    posts(
      first: $first
      where: {
        categoryName: $slugStr
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

/** カテゴリー直下の投稿（category->posts） */
export const POSTS_BY_CATEGORY = /* GraphQL */ `
  query PostsByCategory($slug: ID!, $first: Int = 12) {
    category(id: $slug, idType: SLUG) {
      name
      slug
      posts(
        first: $first
        where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          id
          slug
          title
          date
          excerpt
          featuredImage { node { sourceUrl altText } }
        }
      }
    }
  }
`;

/** カテゴリーページ（子カテゴリ＋記事一覧） */
export const CATEGORY_PAGE = /* GraphQL */ `
  query CategoryPage($slug: ID!, $first: Int = 12) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      children(first: 50) { nodes { id name slug } }
      posts(
        first: $first
        where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          id
          slug
          title
          date
          excerpt
          featuredImage { node { sourceUrl altText } }
          categories { nodes { id name slug parentDatabaseId } }
        }
      }
    }
  }
`;

/** カテゴリー詳細 */
export const CATEGORY_BY_SLUG = /* GraphQL */ `
  query CategoryBySlug($slug: ID!, $first: Int = 30) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      children { nodes { id name slug } }
      posts(
        first: $first
        where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
      ) {
        nodes {
          id
          slug
          title
          date
          excerpt
          featuredImage { node { sourceUrl altText } }
          categories {
            nodes {
              id
              name
              slug
              parentId
            }
          }
        }
      }
    }
  }
`;

/** ライター一覧（公開記事を持つユーザー） */
export const AUTHORS = /* GraphQL */ `
  query Authors($first: Int = 30) {
    users(first: $first, where: { hasPublishedPosts: POST }) {
      nodes {
        id
        name
        slug
        description
        avatar { url }
        posts(first: 1) { nodes { id } }
      }
    }
  }
`;

/** カテゴリー offset ページネーション（これは今まで通り offsetPagination 使う） */
export const CATEGORY_POSTS_WITH_OFFSET = /* GraphQL */ `
  query CategoryPostsWithOffset($slug: ID!, $size: Int!, $offset: Int!) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      posts(
        where: {
          status: PUBLISH
          orderby: { field: DATE, order: DESC }
          offsetPagination: { size: $size, offset: $offset }
        }
      ) {
        pageInfo { offsetPagination { total } }
        nodes {
          id
          slug
          title
          date
          excerpt
          featuredImage { node { sourceUrl altText } }
          categories { nodes { id name slug } }
        }
      }
    }
  }
`;

/**
 * 全体の一覧用（/posts）
 * → offsetPagination は使わず、first: 100 だけ取得して
 *   Next.js 側でページング＆著者フィルタを行う
 */
/** トップ一覧 offset ページネーション＋著者フィルタ */
export const POSTS_WITH_OFFSET_PAGINATION = /* GraphQL */ `
  query PostsWithOffsetPagination(
    $size: Int!
    $offset: Int!
    $authorName: String
  ) {
    posts(
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        authorName: $authorName
      }
      offsetPagination: { size: $size, offset: $offset }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
      pageInfo { offsetPagination { total } }
    }
  }
`;


/** 指定したスラッグ配列で投稿取得 */
export const POSTS_BY_SLUGS = /* GraphQL */ `
  query PostsBySlugs($slugs: [String!]!) {
    posts(
      where: {
        status: PUBLISH
        nameIn: $slugs
        orderby: { field: DATE, order: DESC }
      }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
      }
    }
  }
`;

export const ALL_POST_SLUGS = /* GraphQL */ `
  query AllPostSlugs($first: Int = 1000) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`;
