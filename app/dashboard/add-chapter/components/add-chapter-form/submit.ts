import type { AddChapterSubmitPayload } from "@/app/dashboard/add-chapter/schema"
import {
  addChapterAction,
  createChapterUploadAction,
} from "@/app/dashboard/server/addChapterAction"
import { createClient } from "@/lib/supabase/client"
import { CHAPTER_UPLOAD_BUCKET } from "@/lib/supabase/dashboard/add-chapter/constants"

export async function submitAddChapter(payload: AddChapterSubmitPayload): Promise<string> {
  // 1. 向服务端申请一次性签名上传地址（请求体很小，不受 Vercel 4.5MB 限制）
  const created = await createChapterUploadAction({
    novelId: payload.novel_id,
    fileName: payload.chapter_file.name,
  })

  if (!created.success) {
    throw new Error(created.message)
  }

  // 2. 浏览器直传 txt 到 Supabase Storage（不经过 Vercel 函数）
  const supabase = createClient()
  const { error: uploadError } = await supabase.storage
    .from(CHAPTER_UPLOAD_BUCKET)
    .uploadToSignedUrl(created.path, created.token, payload.chapter_file, {
      contentType: "text/plain",
    })

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  // 3. 服务端从 Storage 下载、切分并写入章节
  const result = await addChapterAction({
    novelId: payload.novel_id,
    storagePath: created.path,
  })

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.message
}
