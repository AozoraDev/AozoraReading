"use client"

import { useTranslations } from "next-intl"

import { DashboardNavList } from "@/app/dashboard/components/dashboard-nav-list"
import { Separator } from "@/components/ui/separator"

export function DashboardSidebar() {
  const t = useTranslations("dashboard.nav")

  return (
    <aside
      aria-label={t("title")}
      className="hidden w-56 shrink-0 md:flex md:flex-col"
    >
      <div className="sticky top-[calc(3.5rem+1.5rem)] flex flex-col gap-4">
        <div className="rounded-xl border border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
          <p className="px-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {t("title")}
          </p>
          <Separator className="my-3 bg-sidebar-border" />
          <nav className="flex flex-col gap-1">
            <DashboardNavList variant="sidebar" />
          </nav>
        </div>
      </div>
    </aside>
  )
}
