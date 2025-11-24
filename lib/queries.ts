// lib/queries.ts
// すべて「GraphQL クエリ文字列を export するだけ」のファイルです。

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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            slug
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

/** 記事 1 件（slug） */
export const POST_BY_SLUG = /* GraphQL */ `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      content(format: RENDERED)
      excerpt
      author {
        node {
          name
          slug
          description
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`;

/** 静的生成などで使う slug 一覧 */
export const SLUGS = /* GraphQL */ `
  query Slugs($first: Int = 100) {
    posts(first: $first, where: { status: PUBLISH }) {
      nodes {
        slug
      }
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
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
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
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
      children(first: 50) {
        nodes {
          id
          name
          slug
        }
      }
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
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
              parentDatabaseId
            }
          }
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
      children {
        nodes {
          id
          name
          slug
        }
      }
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
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
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
        avatar {
          url
        }
        posts(first: 1) {
          nodes {
            id
          }
        }
      }
    }
  }
`;

/** カテゴリー offset ページネーション（cursor） */
export const CATEGORY_POSTS_WITH_OFFSET = /* GraphQL */ `
  query CategoryPostsWithOffset($slug: ID!, $first: Int = 12, $after: String) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
      posts(
        first: $first
        after: $after
        where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
      ) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          slug
          title
          date
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
          categories {
            nodes {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

/** トップ＆ライター一覧（cursor） */
export const POSTS_WITH_OFFSET_PAGINATION = /* GraphQL */ `
  query PostsWithOffsetPagination(
    $first: Int!
    $after: String
    $authorName: String
  ) {
    posts(
      first: $first
      after: $after
      where: {
        status: PUBLISH
        orderby: { field: DATE, order: DESC }
        authorName: $authorName
      }
    ) {
      nodes {
        id
        slug
        title
        date
        excerpt
        author {
          node {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** ★ライター別専用クエリ（今回追加） */




/** 指定スラッグ配列で投稿取得 */
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
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

/** 全投稿 slug 一覧 */
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
/** ★ライター別一覧用：全投稿を author 情報付きで取得（Next 側で絞り込み） */
/** ★ライター別一覧用：全投稿を author 情報付きで取得（Next 側で絞り込み） */
export const POSTS_FOR_AUTHOR_VIEW = /* GraphQL */ `
  query PostsForAuthorView($first: Int!) {
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
        author {
          node {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;
