import type {
  CooldownState,
  SendEmailButtonState,
  TranslateFn,
} from "@/lib/auth-form/types"

// 获取发送邮件按钮状态
export function getSendEmailButtonState(params: {
  emailSent: boolean
  isSending: boolean
  isResending: boolean
  email: string
  password: string
  passwordsMatch: boolean
  cooldown: CooldownState
  t: TranslateFn
  i18nPrefix: "signUp" | "forget"
}): SendEmailButtonState {
  const {
    emailSent,
    isSending,
    isResending,
    email,
    password,
    passwordsMatch,
    cooldown,
    t,
    i18nPrefix,
  } = params

  // 如果邮箱已发送，返回重新发送邮件按钮状态
  if (emailSent) {
    // 如果正在重新发送邮件，返回重新发送邮件按钮状态
    const disabled = isResending || !email || cooldown.isActive
    let label = t(`${i18nPrefix}.resendEmail`)
    if (isResending) label = t(`${i18nPrefix}.resendingEmail`)
    else if (cooldown.isActive) {
      label = t(`${i18nPrefix}.resendCooldown`, { seconds: cooldown.seconds })
    }
    return { disabled, label }
  }

  // 如果正在发送邮件，返回发送邮件按钮状态
  const disabled = isSending || !passwordsMatch || !email || !password
  const label = isSending
    ? t(`${i18nPrefix}.sendingEmail`)
    : t(`${i18nPrefix}.sendEmail`)
  return { disabled, label }
}
