import { createClient } from "@/lib/supabase/server"

// 从 favorites 表中获取指定小说 ID 里用户已收藏的项
export async function getUserFavoriteNovelIds(
  novelIds: string[]
): Promise<string[]> {
  if (novelIds.length === 0) {
    return []
  }

  const supabase = await createClient()

  // 读本地 session 即可；/library 为公开页，未登录时直接返回空
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return []
  }

  const user = session.user

  const { data, error } = await supabase
    .from("favorites")
    .select("novel_id")
    .eq("uid", user.id)
    .in(
      "novel_id",
      novelIds.map((id) => Number(id))
    )

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(({ novel_id }) => String(novel_id))
}
