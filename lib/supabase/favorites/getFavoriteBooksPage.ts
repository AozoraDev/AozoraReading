import { BOOKS_PAGE_SIZE } from "@/lib/supabase/books/constants"
import { buildIlikeOrFilter } from "@/lib/supabase/books/getBooksinfos"
import type { BookInfo, BooksPageResult } from "@/lib/supabase/books/getBooksinfos"
import { createClient } from "@/lib/supabase/server"

export type FavoriteBooksPageResult = BooksPageResult & {
  totalFavoriteCount: number
}

type GetFavoriteBooksPageOptions = {
  page: number
  pageSize?: number
  query?: string
}

type NovelDetails = {
  id: number
  title: string
  author: string
  cover_url: string
}

// 把收藏联表查询结果转成 BookInfo 列表
function mapFavoriteRows(
  rows: { novel_id: number; novels: NovelDetails | NovelDetails[] | null }[]
): BookInfo[] {
  return rows.flatMap(({ novels }) => {
    const novel = Array.isArray(novels) ? novels[0] : novels

    if (!novel) {
      return []
    }

    return [
      {
        novel_id: String(novel.id),
        title: novel.title,
        author: novel.author,
        cover_url: novel.cover_url,
      },
    ]
  })
}

// 分页获取用户收藏，可选搜索词
export async function getFavoriteBooksPage({
  page,
  pageSize = BOOKS_PAGE_SIZE,
  query = "",
}: GetFavoriteBooksPageOptions): Promise<FavoriteBooksPageResult> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 未登录返回空结果
  if (!user) {
    return { books: [], totalCount: 0, totalFavoriteCount: 0 }
  }

  const trimmed = query.trim()
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * pageSize
  const to = from + pageSize - 1

  let builder = supabase
    .from("favorites")
    .select(
      `
        novel_id,
        novels!inner (
          id,
          title,
          author,
          cover_url
        )
      `,
      { count: "exact" }
    )
    .eq("uid", user.id)
    .order("id", { ascending: false })

  if (trimmed) {
    builder = builder.or(buildIlikeOrFilter(["title", "author"], trimmed), {
      referencedTable: "novels",
    })
  }

  const pageQuery = builder.range(from, to)

  // 有搜索词：分页用筛选结果数，角标用收藏总数
  if (trimmed) {
    const [{ data, count, error }, totalFavoriteResult] = await Promise.all([
      pageQuery,
      supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("uid", user.id),
    ])

    if (error) {
      throw new Error(error.message)
    }

    if (totalFavoriteResult.error) {
      throw new Error(totalFavoriteResult.error.message)
    }

    return {
      books: mapFavoriteRows(data ?? []),
      totalCount: count ?? 0,
      totalFavoriteCount: totalFavoriteResult.count ?? 0,
    }
  }

  const { data, count, error } = await pageQuery

  if (error) {
    throw new Error(error.message)
  }

  const totalFavoriteCount = count ?? 0

  return {
    books: mapFavoriteRows(data ?? []),
    totalCount: totalFavoriteCount,
    totalFavoriteCount,
  }
}
