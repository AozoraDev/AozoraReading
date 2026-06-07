import { BookPlusIcon, LayoutDashboardIcon, type LucideIcon } from "lucide-react"

/** 侧栏 / 移动端导航项；key 对应 dashboard.nav 文案 */
export type DashboardNavItem = {
  href: string
  key: "overview" | "addNovel"
  icon: LucideIcon
}

/** 仪表盘导航配置，新增页面在此追加 */
export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", key: "overview", icon: LayoutDashboardIcon },
  { href: "/dashboard/add-novel", key: "addNovel", icon: BookPlusIcon },
]

/** 当前路由是否与导航 href 完全匹配 */
export function isDashboardNavActive(pathname: string, href: string) {
  return pathname === href
}
