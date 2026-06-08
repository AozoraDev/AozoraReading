import { getCoverPath } from "@/lib/supabase/books/getcover"
import { createClient, createServiceRoleClient } from "@/lib/supabase/server"

const COVER_BUCKET = "cover"

export type AddNovelInput = {
  title: string
  author: string
  summary: string
  tags: string[]
  coverUrl: string
  coverFile: Blob
  coverContentType: string
}

/** 规范化封面存储路径 */ 
function normalizeCoverStoragePath(coverUrl: string): string {
  const raw = getCoverPath(coverUrl).trim()
  if (!raw) {
    throw new Error("Invalid cover storage path")
  }

  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

/** 上传封面文件到 Storage */
async function uploadCoverFile(
  coverUrl: string,
  coverFile: Blob,
  coverContentType: string,
): Promise<void> {
  const coverPath = normalizeCoverStoragePath(coverUrl)
  const adminClient = createServiceRoleClient()

  const { error } = await adminClient.storage.from(COVER_BUCKET).upload(coverPath, coverFile, {
    contentType: coverContentType,
    upsert: false,
  })

  if (error) {
    throw new Error(error.message)
  }
}

/** 删除封面文件 */
async function removeCoverFile(coverUrl: string): Promise<void> {
  const coverPath = normalizeCoverStoragePath(coverUrl)
  const adminClient = createServiceRoleClient()

  await adminClient.storage.from(COVER_BUCKET).remove([coverPath])
}

/** 上传封面并插入 novels 记录 */
export async function addNovel({
  title,
  author,
  summary,
  tags,
  coverUrl,
  coverFile,
  coverContentType,
}: AddNovelInput): Promise<void> {
  await uploadCoverFile(coverUrl, coverFile, coverContentType)

  const supabase = await createClient()
  const { error } = await supabase.from("novels").insert({
    title,
    author,
    summary: summary || null,
    tags: tags.length > 0 ? tags : null,
    cover_url: coverUrl,
  })

  if (error) {
    await removeCoverFile(coverUrl)
    throw new Error(error.message)
  }
}
