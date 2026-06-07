"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { addChapterFormSchema } from "@/app/dashboard/add-chapter/schema"
import { splitTxtFile } from "@/app/dashboard/add-chapter/script/split-txt-chapters"
import { isAdminEmail } from "@/lib/supabase/auth/tool/constants"
import { addChapters } from "@/lib/supabase/dashboard/add-chapter/addChapters"
import { createClient } from "@/lib/supabase/server"

const MAX_CHAPTER_FILE_SIZE = 50 * 1024 * 1024

export type AddChapterActionResult = {
  success: boolean
  message: string
  chapterCount?: number
}

function isTxtFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".txt") || file.type === "text/plain"
}

function getTextFieldValidationMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("issues" in error)) {
    return undefined
  }

  const issues = (error as { issues: { message: string }[] }).issues
  return issues[0]?.message
}

/** 添加章节：上传 txt、切分并批量写入 chapters */
export async function addChapterAction(formData: FormData): Promise<AddChapterActionResult> {
  const t = await getTranslations("dashboard.addChapter.form")

  const novelId = String(formData.get("novel_id") ?? "")
  const chapterFile = formData.get("chapter_file")

  const novelIdResult = addChapterFormSchema.pick({ novel_id: true }).safeParse({ novel_id: novelId })

  if (!novelIdResult.success) {
    const messageKey = getTextFieldValidationMessage(novelIdResult.error)
    return {
      success: false,
      message: messageKey ? t(messageKey) : t("submitError"),
    }
  }

  if (!(chapterFile instanceof File) || chapterFile.size === 0) {
    return { success: false, message: t("fileRequired") }
  }

  if (!isTxtFile(chapterFile)) {
    return { success: false, message: t("invalidFileType") }
  }

  if (chapterFile.size > MAX_CHAPTER_FILE_SIZE) {
    return { success: false, message: t("fileTooLarge") }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return { success: false, message: t("submitError") }
  }

  try {
    const { chapters } = await splitTxtFile(chapterFile)

    if (chapters.length === 0) {
      return { success: false, message: t("noChaptersFound") }
    }

    const chapterCount = await addChapters({
      novelId: Number(novelIdResult.data.novel_id),
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

    return { success: false, message: t("submitError") }
  }
}
