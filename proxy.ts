import { type NextRequest } from "next/server"

import { updateSession } from "@/lib/supabase/proxy"

// 代理层，处理认证和授权
export async function proxy(request: NextRequest) {
  return updateSession(request)
}

// 配置代理匹配的路由
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
