// lib/wp.ts
import { POSTS_WITH_OFFSET_PAGINATION } from './queries'

/**
 * 汎用 GraphQL フェッチ関数
 * @param query GraphQL クエリ文字列
 * @param variables クエリ変数
 */
export async function gql<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT

  if (!endpoint) {
    throw new Error(
      '❌ Missing NEXT_PUBLIC_WP_GRAPHQL_ENDPOINT. Check .env.local or Vercel Environment Variables.'
    )
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // 認証が必要な場合はここに Authorization ヘッダを追加
    body: JSON.stringify({ query, variables }),
    // ISR/SSG時にも常に新しいデータを取りに行く
    cache: 'no-store',
  })

  const text = await res.text()

  // GraphQLエンドポイントが正しくない場合（HTMLが返ってくる）
  if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
    console.error('GraphQL raw response (HTML):', text.slice(0, 200))
    throw new Error(
      `❌ GraphQL endpoint responded with HTML instead of JSON. endpoint=${endpoint} 
→ おそらく /graphiql を叩いています。正しくは /graphql にしてください。`
    )
  }

  let json: any
  try {
    json = JSON.parse(text)
  } catch (e) {
    console.error('GraphQL raw response (not JSON):', text.slice(0, 200))
    throw new Error('❌ GraphQL response is not valid JSON.')
  }

  if (!res.ok) {
    throw new Error(`❌ HTTP ${res.status}: ${JSON.stringify(json)}`)
  }

  if (json.errors) {
    console.error('WP GraphQL errors:', json.errors)
    throw new Error(`❌ WP GraphQL error: ${JSON.stringify(json.errors)}`)
  }

  return json.data as T
}

/**
 * 記事一覧（オフセット付きページネーション）
 * @param size 1ページあたりの記事数
 * @param offset 取得開始位置
 */
export async function getPostsOffsetPaginated(size = 10, offset = 0) {
  const data = await gql<{ posts: any }>(POSTS_WITH_OFFSET_PAGINATION, {
    size,
    offset,
  })
  return data?.posts ?? null
}
