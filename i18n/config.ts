// 多语言基础配置：支持的语言、默认值与 Cookie 名称
export const locales = ["zh", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "zh"

export const localeCookieName = "locale"

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}
