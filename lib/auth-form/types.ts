import type { useTranslations } from "next-intl"

export const RESEND_COOLDOWN_SECONDS = 30

export type TranslateFn = ReturnType<typeof useTranslations>

// 冷却状态
export type CooldownState = {
  seconds: number
  isActive: boolean
}

// 发送邮件按钮状态
export type SendEmailButtonState = {
  disabled: boolean
  label: string
}

// 动作提示状态
export type ActionToastState = {
  success: boolean
  message: string
}
