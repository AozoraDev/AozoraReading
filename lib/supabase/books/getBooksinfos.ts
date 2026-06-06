import { createClient } from "@/lib/supabase/server"

export type BookInfo = {
  novel_id: string
  title: string
  author: string
  cover_url: string
}

function mapNovelRows(
  rows: { id: string | number; title: string; author: string; cover_url: string }[]
): BookInfo[] {
  return rows.map(({ id, title, author, cover_url }) => ({
    novel_id: String(id),
    title,
    author,
    cover_url,
  }))
}

// 转义 ILIKE 模式中的特殊字符
function escapeIlikePattern(value: string): string {
  return value.replace(/[%_\\]/g, (char) => `\\${char}`)
}

// 构建 ILIKE 过滤器
function buildIlikeOrFilter(columns: string[], query: string): string {
  const pattern = `%${escapeIlikePattern(query)}%`
  const quotedPattern = `"${pattern.replace(/"/g, '\\"')}"`

  return columns.map((column) => `${column}.ilike.${quotedPattern}`).join(",")
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

// 获取所有小说信息
export async function getBooksinfos(): Promise<BookInfo[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("novels")
    .select("id, title, author, cover_url")

  if (error) {
    throw new Error(error.message)
  }

  return mapNovelRows(data ?? [])
}

// 在 novels 表中按标题或作者搜索
export async function searchBooksinfos(query: string): Promise<BookInfo[]> {
  const trimmed = query.trim()
  if (!trimmed) {
    return getBooksinfos()
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("novels")
    .select("id, title, author, cover_url")
    .or(buildIlikeOrFilter(["title", "author"], trimmed))

  if (error) {
    throw new Error(error.message)
  }

  return mapNovelRows(data ?? [])
}

// 根据小说 ID 获取小说信息
export async function getBooksinfosByIds(
  novelIds: string[]
): Promise<BookInfo[]> {
  if (novelIds.length === 0) {
    return []
  }

  const supabase = await createClient()

  // 根据小说 ID 获取小说信息
  const { data, error } = await supabase
    .from("novels")
    .select("id, title, author, cover_url")
    .in("id", novelIds)

  if (error) {
    throw new Error(error.message)
  }

  return mapNovelRows(data ?? [])
}

// 在指定小说 ID 范围内按标题或作者搜索
// 收藏页面使用
export async function searchBooksinfosByIds(
  novelIds: string[],
  query: string
): Promise<BookInfo[]> {
  if (novelIds.length === 0) {
    return []
  }

  const trimmed = query.trim()
  if (!trimmed) {
    return getBooksinfosByIds(novelIds)
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("novels")
    .select("id, title, author, cover_url")
    .in("id", novelIds)
    .or(buildIlikeOrFilter(["title", "author"], trimmed))

  if (error) {
    throw new Error(error.message)
  }

  return mapNovelRows(data ?? [])
}
