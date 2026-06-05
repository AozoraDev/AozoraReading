"use server"

import { getTranslations } from "next-intl/server"

import type { LoginActionState } from "@/app/login/types"
import { apiSignInWithPassword } from "@/lib/supabase/auth/signInWithPassword"
import { getLoginErrorKey } from "@/lib/supabase/auth/tool/getLoginErrorKey"
import { isValidEmail } from "@/lib/supabase/auth/tool/isValidEmail"

type LoginTranslator = Awaited<ReturnType<typeof getTranslations>>

// 从 FormData 安全提取字符串字段
function formValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

// 将后端错误码映射为本地化提示文案
function mapLoginError(
  err: unknown,
  t: LoginTranslator,
  fallback: string,
): string {
  if (!(err instanceof Error)) return fallback
  if (err.message === "EMAIL_RATE_LIMIT") return t("emailRateLimit")
  return t(getLoginErrorKey(err.message))
}

// 登录
export async function loginAction(
  _prevState: LoginActionState | null,
  formData: FormData,
): Promise<LoginActionState> {
  const t = await getTranslations("auth.login")
  const email = formValue(formData, "email").trim()
  const password = formValue(formData, "password")

  // 如果 email 为空，返回 missingEmail
  if (!email) {
    return { success: false, message: t("missingEmail") }
  }

  // 如果 email 不是有效的邮箱，返回 invalidEmail
  if (!isValidEmail(email)) {
    return { success: false, message: t("invalidEmail") }
  }
  
  // 如果 password 为空，返回 missingPassword
  if (!password) {
    return { success: false, message: t("missingPassword") }
  }
    
  // 尝试登录
  try {
    // 调用 apiSignInWithPassword 登录
    const data = await apiSignInWithPassword(email, password)
    // 如果 data.session 为空，返回 failure
    if (!data.session) {
      return { success: false, message: t("failure") }
    }
    // 返回成功
    return { success: true, message: t("success") }
  } catch (err) {
    // 返回失败
    return {
      success: false,
      message: mapLoginError(err, t, t("failure")),
    }
  }
}
