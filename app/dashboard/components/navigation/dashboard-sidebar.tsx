"use client"

import { useTranslations } from "next-intl"

import { DashboardNavList } from "@/app/dashboard/components/navigation/dashboard-nav-list"
import { Separator } from "@/components/ui/separator"

export function DashboardSidebar() {
  const t = useTranslations("dashboard.nav")

  return (
    <aside
      aria-label={t("title")}
      className="hidden w-56 shrink-0 self-start md:block"
    >
      <div className="sticky top-20 rounded-xl border border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
        <p className="px-2 text-lg font-semibold tracking-tight text-brand-blue">
          {t("title")}
        </p>
        <Separator className="my-3 bg-sidebar-border" />
        <nav className="flex flex-col gap-1">
          <DashboardNavList variant="sidebar" />
        </nav>
      </div>
    </aside>
  )
}
