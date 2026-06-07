"use client"

import { useTranslations } from "next-intl"

import { DashboardNavList } from "@/app/dashboard/components/dashboard-nav-list"

export function DashboardMobileNav() {
  const t = useTranslations("dashboard.nav")

  return (
    <nav
      aria-label={t("title")}
      className="-mx-4 overflow-x-auto border-b border-sidebar-border bg-sidebar px-4 pb-3 sm:-mx-6 sm:px-6 md:hidden"
    >
      <div className="flex w-max min-w-full gap-1">
        <DashboardNavList variant="mobile" />
      </div>
    </nav>
  )
}
