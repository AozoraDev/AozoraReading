import type { useTranslations } from "next-intl"

export type TranslateFn = ReturnType<typeof useTranslations>

export type LoginActionState = {
  success: boolean
  message: string
}

export const INITIAL_LOGIN_ACTION_STATE: LoginActionState | null = null
