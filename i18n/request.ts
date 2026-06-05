// 每次请求时根据 Cookie 确定语言，并加载对应翻译文件
import { cookies } from "next/headers"
import { getRequestConfig } from "next-intl/server"

import {
  defaultLocale,
  isLocale,
  localeCookieName,
  type Locale,
} from "./config"

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(localeCookieName)?.value
  const locale: Locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
