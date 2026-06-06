import { createClient } from "@/lib/supabase/server"

export type BookInfo = {
  novel_id: string
  title: string
  author: string
  cover_url: string
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

  return (data ?? []).map(({ id, title, author, cover_url }) => ({
    novel_id: String(id),
    title,
    author,
    cover_url,
  }))
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

  return (data ?? []).map(({ id, title, author, cover_url }) => ({
    novel_id: String(id),
    title,
    author,
    cover_url,
  }))
}
