"use server"

import { getTranslations } from "next-intl/server"

import type { ForgetActionState, ForgetIntent } from "@/app/forget/types"
import {
  apiResetPasswordForEmail,
  apiVerifyRecovery,
} from "@/lib/supabase/auth/resetPasswordForEmail"
import { isValidEmail } from "@/lib/supabase/auth/tool/isValidEmail"

type ForgetTranslator = Awaited<ReturnType<typeof getTranslations>>

function authResult(
  intent: ForgetIntent,
  success: boolean,
  message: string,
): ForgetActionState {
  return { intent, success, message }
}

function formValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function normalizeOtp(token: string): string {
  return token.trim().replace(/\s+/g, "")
}

function mapForgetError(
  err: unknown,
  t: ForgetTranslator,
  fallback: string,
): string {
  if (!(err instanceof Error)) return fallback
  if (err.message === "EMAIL_RATE_LIMIT") return t("emailRateLimit")
  if (err.message === "RECOVERY_SESSION_MISSING") return t("verifyFailure")
  if (err.message === "SAME_AS_OLD_PASSWORD") return t("sameAsOldPassword")

  const message = err.message.toLowerCase()
  if (
    message.includes("different from the old password") ||
    message.includes("should be different")
  ) {
    return t("sameAsOldPassword")
  }
  if (
    message.includes("invalid") ||
    message.includes("expired") ||
    message.includes("otp")
  ) {
    return t("verifyFailure")
  }

  return err.message
}

// 运行认证动作
async function runAuthAction(
  intent: ForgetIntent,
  t: ForgetTranslator,
  fallback: string,
  action: () => Promise<string>,
): Promise<ForgetActionState> {
  try {
    return authResult(intent, true, await action())
  } catch (err) {
    return authResult(intent, false, mapForgetError(err, t, fallback))
  }
}

// 运行忘记动作
export async function forgetAction(
  _prevState: ForgetActionState | null,
  formData: FormData,
): Promise<ForgetActionState> {
  const t = await getTranslations("auth.forget")
  const intent = formValue(formData, "intent") as ForgetIntent

  // 根据意图运行动作
  switch (intent) {
    case "send": {
      const email = normalizeEmail(formValue(formData, "email"))
      // 获取密码和确认密码
      const password = formValue(formData, "password")
      const confirmPassword = formValue(formData, "confirmPassword")
      
      // 如果邮箱、密码或确认密码为空，返回错误
      if (!email || !password || !confirmPassword) {
        return authResult("send", false, t("missingFields"))
      }

      // 如果邮箱无效，返回错误
      if (!isValidEmail(email)) {
        return authResult("send", false, t("invalidEmail"))
      }

      // 如果密码不匹配，返回错误
      if (password !== confirmPassword) {
        return authResult("send", false, t("passwordMismatch"))
      }

      // 发送重置密码邮件
      return runAuthAction("send", t, t("failure"), async () => {
        await apiResetPasswordForEmail(email)
        return t("emailSent")
      })
    }
    case "resend": {
      // 获取邮箱
      const email = normalizeEmail(formValue(formData, "email"))
      
      // 如果邮箱为空，返回错误
      if (!email) {
        return authResult("resend", false, t("missingEmail"))
      }

      // 如果邮箱无效，返回错误
      if (!isValidEmail(email)) {
        return authResult("resend", false, t("invalidEmail"))
      }

      // 重新发送重置密码邮件
      return runAuthAction("resend", t, t("failure"), async () => {
        await apiResetPasswordForEmail(email)
        return t("resendSuccess")
      })
    }
    case "verify": {
      // 获取邮箱、令牌、密码和确认密码
      const email = normalizeEmail(formValue(formData, "email"))
      const token = normalizeOtp(formValue(formData, "otp"))
      const password = formValue(formData, "password")
      const confirmPassword = formValue(formData, "confirmPassword")

      // 如果邮箱或令牌为空，返回错误
      if (!email || !token) {
        return authResult("verify", false, t("missingOtp"))
      }

      // 如果密码或确认密码为空，返回错误
      if (!password || !confirmPassword) {
        return authResult("verify", false, t("missingFields"))
      }

      // 如果密码不匹配，返回错误
      if (password !== confirmPassword) {
        return authResult("verify", false, t("passwordMismatch"))
      }
      
      // 验证恢复
      return runAuthAction("verify", t, t("verifyFailure"), async () => {
        await apiVerifyRecovery(email, token, password)
        return t("success")
      })
    }
    default:
      // 默认返回失败
      return authResult("send", false, t("failure"))
  }
}
