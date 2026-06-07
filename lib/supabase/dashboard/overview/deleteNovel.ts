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

// 用 service role 删除 Storage 中的封面文件
async function deleteCoverFile(coverUrl: string): Promise<void> {
  const coverPath = normalizeCoverStoragePath(coverUrl)
  if (!coverPath) return

  const adminClient = createServiceRoleClient()
  const { data, error } = await adminClient.storage
    .from(COVER_BUCKET)
    .remove([coverPath])

  if (error) {
    throw new Error(error.message)
  }

  if (!data?.length) {
    throw new Error(`Cover file not found or could not be deleted: ${coverPath}`)
  }
}

/** 删除小说：章节 → 封面文件 → novels 记录 */
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
