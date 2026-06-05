import { createBrowserClient } from "@supabase/ssr"

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

// 创建浏览器客户端
export function createClient() {
  // 创建浏览器客户端
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey())
}
