import { createClient } from "@/lib/supabase/server"

// 从 favorites 表中获取指定小说 ID 里用户已收藏的项
export async function getUserFavoriteNovelIds(
  novelIds: string[]
): Promise<string[]> {
  if (novelIds.length === 0) {
    return []
  }

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

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
