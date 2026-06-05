import type { AuthResponse } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/server"
import { throwAuthError } from "@/lib/supabase/auth/tool/throwAuthError"

export async function apiSignInWithPassword(
  email: string,
  password: string,
): Promise<AuthResponse["data"]> {
  // 创建 Supabase 客户端
  const supabase = await createClient()
  // 登录
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throwAuthError(error)

  return data
}
