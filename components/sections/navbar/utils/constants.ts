import { isAdminEmail } from "@/lib/supabase/auth/tool/constants"

export const navItemKeys = [
  { href: "/", key: "home" },
  { href: "/library", key: "library" },
  { href: "/favorites", key: "favorites", requiresAuth: true },
  { href: "/dashboard", key: "dashboard", requiresAdmin: true },
] as const

export type NavItemKey = (typeof navItemKeys)[number]

// 获取可见的导航项
export function getVisibleNavItems(
  isLoggedIn: boolean,
  email: string | null,
) {
  // 过滤导航项
  return navItemKeys.filter((item) => {
    // 如果导航项需要认证，但用户未登录，返回 false
    if ("requiresAuth" in item && item.requiresAuth && !isLoggedIn) {
      return false
    }

    // 如果导航项需要管理员权限，但用户不是管理员，返回 false
    if ("requiresAdmin" in item && item.requiresAdmin && !isAdminEmail(email)) {
      return false
    }

    return true
  })
}

export function isNavActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}
