import { createServerClient } from "@supabase/ssr"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "@/lib/supabase/env"

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

// 创建 service role 客户端（仅服务端管理操作，绕过 Storage RLS）
export function createServiceRoleClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
