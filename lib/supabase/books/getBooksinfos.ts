import { BOOKS_PAGE_SIZE } from "@/lib/supabase/books/constants"
import { createClient } from "@/lib/supabase/server"

export type BookInfo = {
  novel_id: string
  title: string
  author: string
  cover_url: string
  summary?: string | null
}

export type BooksPageResult = {
  books: BookInfo[]
  totalCount: number
}

export type BooksPageWithFavoritesResult = BooksPageResult & {
  favoriteNovelIds: string[]
}

export type GetBooksPageOptions = {
  page: number
  pageSize?: number
  query?: string
}

// 将数据库中的数据映射为 BookInfo 类型
function mapNovelRows(
  rows: {
    id: string | number
    title: string
    author: string
    cover_url: string
    summary?: string | null
  }[]
): BookInfo[] {
  return rows.map(({ id, title, author, cover_url, summary }) => ({
    novel_id: String(id),
    title,
    author,
    cover_url,
    ...(summary !== undefined ? { summary } : {}),
  }))
}

// 转义 %、_、\，避免被当作通配符
function escapeIlikePattern(value: string): string {
  return value.replace(/[%_\\]/g, (char) => `\\${char}`)
}

// 在多个字段里模糊搜索，任一字段匹配即可
export function buildIlikeOrFilter(columns: string[], query: string): string {
  const pattern = `%${escapeIlikePattern(query)}%`
  const quotedPattern = `"${pattern.replace(/"/g, '\\"')}"`

  return columns.map((column) => `${column}.ilike.${quotedPattern}`).join(",")
}

export async function getNovelById(novelId: string): Promise<BookInfo | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("novels")
    .select("id, title, author, cover_url, summary")
    .eq("id", novelId)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (!data) {
    return null
  }

  return mapNovelRows([data])[0]
}

// 获取 novels 表中的书籍总数
export async function getNovelsCount(): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from("novels")
    .select("*", { count: "exact", head: true })

  if (error) {
    throw new Error(error.message)
  }

  return count ?? 0
}

// 分页获取小说列表，支持按标题/作者搜索
export async function getBooksPage({
  page,
  pageSize = BOOKS_PAGE_SIZE,
  query = "",
}: GetBooksPageOptions): Promise<BooksPageResult> {
  const trimmed = query.trim()
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  let builder = supabase
    .from("novels")
    .select("id, title, author, cover_url", { count: "exact" })
    .order("id", { ascending: true })

  if (trimmed) {
    builder = builder.or(buildIlikeOrFilter(["title", "author"], trimmed))
  }

  const { data, count, error } = await builder.range(from, to)

  if (error) {
    throw new Error(error.message)
  }

  return {
    books: mapNovelRows(data ?? []),
    totalCount: count ?? 0,
  }
}

type NovelRowWithFavorites = {
  id: string | number
  title: string
  author: string
  cover_url: string
  favorites?: { novel_id: number }[] | null
}

function mapFavoriteNovelIds(rows: NovelRowWithFavorites[]): string[] {
  return rows
    .filter((row) => (row.favorites?.length ?? 0) > 0)
    .map((row) => String(row.id))
}

// 分页获取小说列表；已登录时联查 favorites，合并为一次查询
export async function getBooksPageWithFavorites({
  page,
  pageSize = BOOKS_PAGE_SIZE,
  query = "",
}: GetBooksPageOptions): Promise<BooksPageWithFavoritesResult> {
  const trimmed = query.trim()
  const safePage = Math.max(1, page)
  const from = (safePage - 1) * pageSize
  const to = from + pageSize - 1

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session?.user) {
    let builder = supabase
      .from("novels")
      .select("id, title, author, cover_url, favorites ( novel_id )", {
        count: "exact",
      })
      .order("id", { ascending: true })

    if (trimmed) {
      builder = builder.or(buildIlikeOrFilter(["title", "author"], trimmed))
    }

    const { data, count, error } = await builder.range(from, to)

    if (error) {
      throw new Error(error.message)
    }

    const rows = data ?? []

    return {
      books: mapNovelRows(rows),
      totalCount: count ?? 0,
      favoriteNovelIds: mapFavoriteNovelIds(rows),
    }
  }

  let builder = supabase
    .from("novels")
    .select("id, title, author, cover_url", { count: "exact" })
    .order("id", { ascending: true })

  if (trimmed) {
    builder = builder.or(buildIlikeOrFilter(["title", "author"], trimmed))
  }

  const { data, count, error } = await builder.range(from, to)

  if (error) {
    throw new Error(error.message)
  }

  return {
    books: mapNovelRows(data ?? []),
    totalCount: count ?? 0,
    favoriteNovelIds: [],
  }
}
