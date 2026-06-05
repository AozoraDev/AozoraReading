import { createClient } from "@/lib/supabase/server"
import { throwAuthError } from "@/lib/supabase/auth/tool/throwAuthError"

// 发送重置密码邮件
export async function apiResetPasswordForEmail(email: string): Promise<void> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email)

  if (error) throwAuthError(error)
}

// 验证恢复
export async function apiVerifyRecovery(
  email: string,
  token: string,
  password: string,
): Promise<void> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "recovery",
  })

  // 如果 error，抛出错误
  if (error) throwAuthError(error)

  // 如果 data.session 为空，抛出 RECOVERY_SESSION_MISSING 错误
  if (!data.session) {
    throw new Error("RECOVERY_SESSION_MISSING")
  }

  // 更新用户密码
  const { error: updateError } = await supabase.auth.updateUser({ password })
  // 如果 updateError，抛出错误
  if (updateError) {
    // 如果 updateError.message 包含 different from the old password，抛出 SAME_AS_OLD_PASSWORD 错误
    if (
      updateError.message.toLowerCase().includes("different from the old password")
    ) {
      throw new Error("SAME_AS_OLD_PASSWORD")
    }
    throwAuthError(updateError)
  }

  await supabase.auth.signOut()
}
