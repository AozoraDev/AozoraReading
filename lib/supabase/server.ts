import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

// 创建服务器客户端
export async function createClient() {
  // 获取 Cookie 存储
  const cookieStore = await cookies()

  // 创建服务器客户端
  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    // 获取所有 Cookie
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      // 设置所有 Cookie
      setAll(cookiesToSet) {
        try {
          // 设置所有 Cookie
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // 服务器组件无法设置 Cookie；中间件处理刷新。
        }
      },
    },
  })
}
