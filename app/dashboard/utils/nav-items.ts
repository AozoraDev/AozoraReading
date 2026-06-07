import { LayoutDashboardIcon, type LucideIcon } from "lucide-react"

export type DashboardNavItem = {
  href: string
  key: "overview"
  icon: LucideIcon
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { href: "/dashboard", key: "overview", icon: LayoutDashboardIcon },
]

export function isDashboardNavActive(pathname: string, href: string) {
  return pathname === href
}
