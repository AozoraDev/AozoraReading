import type { TranslateFn } from "@/lib/auth-form/types"

export function getPasswordMismatchError(
  password: string,
  confirmPassword: string,
  t: TranslateFn,
  i18nPrefix: "signUp" | "forget",
) {
  // 如果密码和确认密码都为空，返回 undefined
  const bothFilled = password.length > 0 && confirmPassword.length > 0
  // 如果密码和确认密码都不为空，返回密码不匹配错误
  if (!bothFilled || password === confirmPassword) return undefined
  // 返回密码不匹配错误
  return t(`${i18nPrefix}.passwordMismatch`)
}
