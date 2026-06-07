"use client"

import { useTranslations } from "next-intl"

import { DashboardNavList } from "@/app/dashboard/components/navigation/dashboard-nav-list"

export function DashboardMobileNav() {
  const t = useTranslations("dashboard.nav")

  return (
    <nav
      aria-label={t("title")}
      className="flex min-w-0 gap-1 overflow-x-auto border-b border-border/80 bg-brand-blue-light px-4 pt-3 pb-3 sm:px-6 md:hidden"
    >
      <DashboardNavList variant="mobile" />
    </nav>
  )
}
