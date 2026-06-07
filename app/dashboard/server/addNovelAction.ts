"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { addNovelFormSchema } from "@/app/dashboard/add-novel/schema"
import { isAdminEmail } from "@/lib/supabase/auth/tool/constants"
import { addNovel } from "@/lib/supabase/dashboard/add-novel/addNovel"
import { createClient } from "@/lib/supabase/server"

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
])

export type AddNovelActionResult = {
  success: boolean
  message: string
}

function getTextFieldValidationMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("issues" in error)) {
    return undefined
  }

  const issues = (error as { issues: { message: string }[] }).issues
  return issues[0]?.message
}

/** 添加小说：校验参数与管理员权限后上传封面并写入 novels */
export async function addNovelAction(formData: FormData): Promise<AddNovelActionResult> {
  const t = await getTranslations("dashboard.addNovel.form")

  const title = String(formData.get("title") ?? "")
  const author = String(formData.get("author") ?? "")
  const coverUrl = String(formData.get("cover_url") ?? "")
  const cover = formData.get("cover")

  const textResult = addNovelFormSchema
    .pick({ title: true, author: true, cover_url: true })
    .safeParse({ title, author, cover_url: coverUrl })

  if (!textResult.success) {
    const messageKey = getTextFieldValidationMessage(textResult.error)
    return {
      success: false,
      message: messageKey ? t(messageKey) : t("submitError"),
    }
  }

  if (!(cover instanceof File) || cover.size === 0) {
    return { success: false, message: t("coverRequired") }
  }

  if (!ACCEPTED_IMAGE_TYPES.has(cover.type)) {
    return { success: false, message: t("invalidImageType") }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return { success: false, message: t("submitError") }
  }

  try {
    await addNovel({
      title: textResult.data.title,
      author: textResult.data.author,
      coverUrl: textResult.data.cover_url,
      coverFile: cover,
      coverContentType: cover.type,
    })

    revalidatePath("/dashboard")
    return { success: true, message: t("submitSuccess") }
  } catch {
    return { success: false, message: t("submitError") }
  }
}
