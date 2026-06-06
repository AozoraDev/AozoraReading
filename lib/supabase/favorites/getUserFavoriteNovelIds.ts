import { createClient } from "@/lib/supabase/server"

// 从 favorites 表中获取用户收藏的小说 ID
export async function getUserFavoriteNovelIds(): Promise<string[]> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  // 从 favorites 表中获取用户收藏的小说 ID
  const { data, error } = await supabase
    .from("favorites")
    .select("novel_id")
    .eq("uid", user.id)

  if (error) {
    throw new Error(error.message)
  }

  return (data ?? []).map(({ novel_id }) => String(novel_id))
}
