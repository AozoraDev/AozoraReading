import { getCoverPath } from "@/lib/supabase/books/getcover"
import { createClient, createServiceRoleClient } from "@/lib/supabase/server"

const COVER_BUCKET = "cover"

export type DeleteNovelInput = {
  novelId: string
  coverUrl: string
}

// 从封面 URL 提取 Storage 路径并解码
function normalizeCoverStoragePath(coverUrl: string): string {
  const raw = getCoverPath(coverUrl).trim()
  if (!raw) return ""

  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

// 用 service role 删除 Storage 中的封面文件（尽力而为：文件缺失不阻断删除）
async function deleteCoverFile(coverUrl: string): Promise<void> {
  const coverPath = normalizeCoverStoragePath(coverUrl)
  if (!coverPath) return

  const adminClient = createServiceRoleClient()
  const { error } = await adminClient.storage
    .from(COVER_BUCKET)
    .remove([coverPath])

  // 文件不存在时 remove 会返回空数组而非报错，无需阻断；仅真实 API 错误才抛出
  if (error) {
    throw new Error(error.message)
  }
}

/** 删除小说：章节 → 收藏 → 封面文件 → novels 记录 */
export async function deleteNovel({
  novelId,
  coverUrl,
}: DeleteNovelInput): Promise<void> {
  const novelIdValue = Number(novelId)

  if (Number.isNaN(novelIdValue)) {
    throw new Error("Invalid novel id")
  }

  const supabase = await createClient()

  // 先删关联章节
  const { error: chaptersError } = await supabase
    .from("chapters")
    .delete()
    .eq("novel_id", novelIdValue)

  if (chaptersError) {
    throw new Error(chaptersError.message)
  }

  // 删除所有用户对该小说的收藏（用 service role 绕过 RLS，清掉全部用户的记录）
  const { error: favoritesError } = await createServiceRoleClient()
    .from("favorites")
    .delete()
    .eq("novel_id", novelIdValue)

  if (favoritesError) {
    throw new Error(favoritesError.message)
  }

  await deleteCoverFile(coverUrl)

  // 最后删小说记录
  const { error: novelError } = await supabase
    .from("novels")
    .delete()
    .eq("id", novelIdValue)

  if (novelError) {
    throw new Error(novelError.message)
  }
}
