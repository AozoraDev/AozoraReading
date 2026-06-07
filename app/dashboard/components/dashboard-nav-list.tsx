"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"

import {
  DASHBOARD_NAV_ITEMS,
  isDashboardNavActive,
} from "@/app/dashboard/utils/nav-items"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DashboardNavListProps = {
  variant: "sidebar" | "mobile"
}

export function DashboardNavList({ variant }: DashboardNavListProps) {
  const pathname = usePathname()
  const t = useTranslations("dashboard.nav")
  const isMobile = variant === "mobile"

  return (
    <>
      {DASHBOARD_NAV_ITEMS.map((item) => {
        const active = isDashboardNavActive(pathname, item.href)
        const Icon = item.icon

        return (
          <Button
            key={item.href}
            asChild
            variant="ghost"
            size="sm"
            className={cn(
              isMobile
                ? "h-9 shrink-0 gap-1.5 px-3 font-normal"
                : "h-9 w-full justify-start gap-2 px-2 font-normal",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )}
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              {t(item.key)}
            </Link>
          </Button>
        )
      })}
    </>
  )
}
