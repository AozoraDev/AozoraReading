"use server"

import { getTranslations } from "next-intl/server"

import type { AuthActionState, SignUpIntent } from "@/app/signup/types"
import { apiResend } from "@/lib/supabase/auth/apiResend"
import { apiSignUp } from "@/lib/supabase/auth/apiSignUp"
import { apiVerifyEmail } from "@/lib/supabase/auth/apiVerifyEmail"

type SignUpTranslator = Awaited<ReturnType<typeof getTranslations>>

// 构造认证 action 的统一返回结构
function authResult(
  intent: SignUpIntent,
  success: boolean,
  message: string
): AuthActionState {
  return { intent, success, message }
}

// 从 FormData 安全提取字符串字段
function formValue(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

// 将后端错误码映射为本地化提示文案
function mapAuthError(
  err: unknown,
  t: SignUpTranslator,
  fallback: string
): string {
  // 如果 err 不是 Error 实例，返回 fallback
  if (!(err instanceof Error)) return fallback
  // 如果 err.message 是 EMAIL_ALREADY_REGISTERED，返回 emailAlreadyRegistered
  if (err.message === "EMAIL_ALREADY_REGISTERED") return t("emailAlreadyRegistered")
  // 如果 err.message 是 EMAIL_RATE_LIMIT，返回 emailRateLimit
  if (err.message === "EMAIL_RATE_LIMIT") return t("emailRateLimit")
  return err.message
}

// 包装认证操作，统一捕获异常并返回结果
async function runAuthAction(
  intent: SignUpIntent,
  t: SignUpTranslator,
  fallback: string,
  action: () => Promise<string>
): Promise<AuthActionState> {
  try {
    return authResult(intent, true, await action())
  } catch (err) {
    return authResult(intent, false, mapAuthError(err, t, fallback))
  }
}

/** 注册流程：发送验证邮件 / 重发 / OTP 验证 */
export async function signupAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const t = await getTranslations("auth.signUp")
  const intent = formValue(formData, "intent") as SignUpIntent

  switch (intent) {
    case "send": {
      const email = formValue(formData, "email")
      const password = formValue(formData, "password")
      const confirmPassword = formValue(formData, "confirmPassword")

      // 如果 email、password 或 confirmPassword 为空，返回 missingFields
      if (!email || !password || !confirmPassword) {
        return authResult("send", false, t("missingFields"))
      }

      // 如果 password 和 confirmPassword 不一致，返回 passwordMismatch
      if (password !== confirmPassword) {
        return authResult("send", false, t("passwordMismatch"))
      }

      // 调用 apiSignUp 注册账号
      return runAuthAction("send", t, t("failure"), async () => {
        await apiSignUp(email, password)
        return t("emailSent")
      })
    }
    case "resend": {
      const email = formValue(formData, "email")

      // 如果 email 为空，返回 missingEmail
      if (!email) {
        return authResult("resend", false, t("missingEmail"))
      }

      // 调用 apiResend 重新发送验证邮件
      return runAuthAction("resend", t, t("failure"), async () => {
        await apiResend(email)
        return t("resendSuccess")
      })
    }
    case "verify": {
      const email = formValue(formData, "email")
      const token = formValue(formData, "otp")

      // 如果 email 或 token 为空，返回 missingOtp
      if (!email || !token) {
        return authResult("verify", false, t("missingOtp"))
      }

      // 调用 apiVerifyEmail 验证邮箱
      return runAuthAction("verify", t, t("verifyFailure"), async () => {
        const data = await apiVerifyEmail(email, token)

        if (!data.session) {
          throw new Error(t("verifyFailure"))
        }

        return t("success")
      })
    }
    // 如果 intent 不是 send、resend 或 verify，返回 failure
    default:
      return authResult("send", false, t("failure"))
  }
}
