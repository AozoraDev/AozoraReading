import {
  CHAPTER_UPLOAD_BUCKET,
  MAX_CHAPTER_FILE_SIZE,
} from "@/lib/supabase/dashboard/add-chapter/constants"
import { createServiceRoleClient } from "@/lib/supabase/server"

export type ChapterUploadTarget = {
  path: string
  token: string
}

type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>

/** 确保临时上传桶存在（私有，仅限 txt），桶已存在时忽略冲突 */
async function ensureBucketExists(client: ServiceRoleClient): Promise<void> {
  const { error } = await client.storage.createBucket(CHAPTER_UPLOAD_BUCKET, {
    public: false,
    fileSizeLimit: MAX_CHAPTER_FILE_SIZE,
    allowedMimeTypes: ["text/plain"],
  })

  if (error && !/exist/i.test(error.message)) {
    throw new Error(error.message)
  }
}

/** 生成唯一存储路径，保留可读的原始文件名后缀 */
function buildUploadPath(fileName: string): string {
  const safeName = fileName.replace(/[^\w.-]+/g, "_").slice(-80) || "chapter.txt"
  const unique = `${Date.now()}-${crypto.randomUUID()}`
  return `${unique}/${safeName}`
}

/** 创建一次性签名上传地址，供浏览器直传（绕过 Vercel 请求体限制） */
export async function createChapterUploadTarget(fileName: string): Promise<ChapterUploadTarget> {
  const adminClient = createServiceRoleClient()
  await ensureBucketExists(adminClient)

  const path = buildUploadPath(fileName)
  const { data, error } = await adminClient.storage
    .from(CHAPTER_UPLOAD_BUCKET)
    .createSignedUploadUrl(path)

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to create chapter upload URL")
  }

  return { path: data.path, token: data.token }
}

/** 从临时桶下载已上传的 txt 二进制内容 */
export async function downloadChapterUpload(path: string): Promise<ArrayBuffer> {
  const adminClient = createServiceRoleClient()
  const { data, error } = await adminClient.storage.from(CHAPTER_UPLOAD_BUCKET).download(path)

  if (error || !data) {
    throw new Error(error?.message ?? "Failed to download uploaded chapter file")
  }

  return data.arrayBuffer()
}

/** 删除临时上传文件（清理失败不影响主流程） */
export async function removeChapterUpload(path: string): Promise<void> {
  const adminClient = createServiceRoleClient()
  await adminClient.storage.from(CHAPTER_UPLOAD_BUCKET).remove([path])
}
