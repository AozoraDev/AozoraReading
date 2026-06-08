"use server"

import { revalidatePath } from "next/cache"
import { getTranslations } from "next-intl/server"

import { isAdminEmail } from "@/lib/supabase/auth/tool/constants"
import { deleteNovel } from "@/lib/supabase/dashboard/overview/deleteNovel"
import { createClient } from "@/lib/supabase/server"

export type DeleteNovelActionResult = {
  success: boolean
  message: string
}

/** 删除小说：校验参数与管理员权限后删除记录并刷新仪表盘 */
export async function deleteNovelAction(
  novelId: string,
  coverUrl: string,
): Promise<DeleteNovelActionResult> {
  const t = await getTranslations("dashboard.table")

  // 参数校验
  if (!novelId.trim()) {
    return { success: false, message: t("deleteError") }
  }

  // 仅管理员可删除
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!isAdminEmail(user?.email)) {
    return { success: false, message: t("deleteError") }
  }

  try {
    await deleteNovel({ novelId, coverUrl })
    revalidatePath("/dashboard")
    return { success: true, message: t("deleteSuccess") }
  } catch (error) {
    console.error("[deleteNovelAction] failed", { novelId, coverUrl, error })
    return { success: false, message: t("deleteError") }
  }
}
