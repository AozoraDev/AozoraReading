import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

import {
  isAdminEmail,
  isAdminRoute,
  isProtectedRoute,
} from "@/lib/supabase/auth/tool/constants"
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env"

// 更新会话
export async function updateSession(request: NextRequest) {
  // 创建响应
  let supabaseResponse = NextResponse.next({ request })

  // 创建 Supabase 客户端
  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      // 获取所有 Cookie
      getAll() {
        return request.cookies.getAll()
      },
      // 设置所有 Cookie
      setAll(cookiesToSet) {
        // 设置 Cookie
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value)
        })
        // 创建响应
        supabaseResponse = NextResponse.next({ request })

        // 设置 Cookie
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options)
        })
      },
    },
  })

  // 获取用户
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 获取路径
  const { pathname } = request.nextUrl

  // 如果为管理员路由
  if (isAdminRoute(pathname)) {
    // 如果为管理员邮箱
    if (isAdminEmail(user?.email)) {
      return supabaseResponse
    }

    // 创建重定向 URL
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = user ? "/" : "/login"
    redirectUrl.search = ""

    // 如果用户未登录，设置重定向 URL
    if (!user) {
      redirectUrl.searchParams.set("redirect", pathname)
    }

    // 重定向
    return NextResponse.redirect(redirectUrl)
  }

  // 如果为受保护路由且用户未登录
  if (isProtectedRoute(pathname) && !user) {
    // 创建登录 URL
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = "/login"
    loginUrl.searchParams.set("redirect", pathname)

    // 重定向
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}
