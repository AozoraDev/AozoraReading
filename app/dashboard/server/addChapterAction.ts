"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { addChapterFormSchema } from "@/app/dashboard/add-chapter/schema"
import {
  decodeTxtBytes,
  splitTxtContent,
} from "@/app/dashboard/add-chapter/script/split-txt-chapters"
import { isAdminEmail } from "@/lib/supabase/auth/tool/constants"
import { addChapters } from "@/lib/supabase/dashboard/add-chapter/addChapters"
import {
  createChapterUploadTarget,
  downloadChapterUpload,
  removeChapterUpload,
} from "@/lib/supabase/dashboard/add-chapter/chapterUpload"
import { createClient } from "@/lib/supabase/server"

export type CreateChapterUploadResult =
  | { success: true; path: string; token: string }
  | { success: false; message: string }

export type AddChapterActionResult = {
  success: boolean
  message: string
  chapterCount?: number
}

export type AddChapterInput = {
  novelId: string
  storagePath: string
}

function getTextFieldValidationMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("issues" in error)) {
    return undefined
  }

  const issues = (error as { issues: { message: string }[] }).issues
  return issues[0]?.message
}

async function isAdminRequest(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return isAdminEmail(user?.email)
}

/** 校验小说 ID，返回错误文案 key 或解析后的数值 */
async function resolveNovelId(
  novelId: string,
  t: Awaited<ReturnType<typeof getTranslations>>,
): Promise<{ ok: true; value: number } | { ok: false; message: string }> {
  const result = addChapterFormSchema.pick({ novel_id: true }).safeParse({ novel_id: novelId })

  if (!result.success) {
    const messageKey = getTextFieldValidationMessage(result.error)
    return { ok: false, message: messageKey ? t(messageKey) : t("submitError") }
  }

  return { ok: true, value: Number(result.data.novel_id) }
}

/** 第一步：校验权限后发放一次性签名上传地址，供浏览器直传 Storage */
export async function createChapterUploadAction(input: {
  novelId: string
  fileName: string
}): Promise<CreateChapterUploadResult> {
  const t = await getTranslations("dashboard.addChapter.form")

  const novelId = await resolveNovelId(input.novelId, t)
  if (!novelId.ok) {
    return { success: false, message: novelId.message }
  }

  if (!(await isAdminRequest())) {
    return { success: false, message: t("submitError") }
  }

  try {
    const target = await createChapterUploadTarget(input.fileName)
    return { success: true, path: target.path, token: target.token }
  } catch {
    return { success: false, message: t("submitError") }
  }
}

/** 第二步：从 Storage 下载已直传的 txt，切分并批量写入 chapters */
export async function addChapterAction(input: AddChapterInput): Promise<AddChapterActionResult> {
  const t = await getTranslations("dashboard.addChapter.form")

  const novelId = await resolveNovelId(input.novelId, t)
  if (!novelId.ok) {
    return { success: false, message: novelId.message }
  }

  if (!input.storagePath) {
    return { success: false, message: t("fileRequired") }
  }

  if (!(await isAdminRequest())) {
    return { success: false, message: t("submitError") }
  }

  try {
    const bytes = await downloadChapterUpload(input.storagePath)
    const text = decodeTxtBytes(bytes)
    const { chapters } = splitTxtContent(text)

    if (chapters.length === 0) {
      return { success: false, message: t("noChaptersFound") }
    }

    const chapterCount = await addChapters({
      novelId: novelId.value,
      chapters,
    })

    revalidatePath("/dashboard")
    return {
      success: true,
      message: t("submitSuccess", { count: chapterCount }),
      chapterCount,
    }
  } catch (error) {
    if (error instanceof Error && error.message === "novelNotFound") {
      return { success: false, message: t("novelNotFound") }
    }

    console.error("[addChapterAction] failed", error)
    return { success: false, message: t("submitError") }
  } finally {
    try {
      await removeChapterUpload(input.storagePath)
    } catch {
      // 临时文件清理失败不影响主流程
    }
  }
}
