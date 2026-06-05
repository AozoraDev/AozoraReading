import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/middleware"

// 中间件，处理认证和授权
export async function middleware(request: NextRequest) {
  return updateSession(request)
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
