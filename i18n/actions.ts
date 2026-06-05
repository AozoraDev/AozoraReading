// 用户切换语言时，将选择写入 Cookie
"use server"

import { cookies } from "next/headers"

import { isLocale, localeCookieName, type Locale } from "./config"

// 只把语言代号 zh/en 写入 Cookie，翻译文案每次请求时重新加载
export async function setLocale(locale: Locale) {
  if (!isLocale(locale)) return

  const cookieStore = await cookies()
  cookieStore.set(localeCookieName, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  })
}
