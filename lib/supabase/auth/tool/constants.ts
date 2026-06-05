// 定义管理员邮箱
export const ADMIN_EMAIL = "aozoradev@qq.com"

// 定义受保护的路由
export const PROTECTED_ROUTES = ["/favorites"] as const

// 定义管理员路由
export const ADMIN_ROUTES = ["/dashboard"] as const

// 判断是否为管理员邮箱
export function isAdminEmail(email: string | null | undefined) {
  return email === ADMIN_EMAIL
}

// 判断是否为受保护的路由
export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}

// 判断是否为管理员路由
export function isAdminRoute(pathname: string) {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )
}
