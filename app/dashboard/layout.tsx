import { DashboardMobileNav } from "@/app/dashboard/components/navigation/dashboard-mobile-nav"
import { DashboardSidebar } from "@/app/dashboard/components/navigation/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative left-1/2 flex w-screen min-w-0 max-w-none -translate-x-1/2 flex-col gap-4 pb-6 pt-0 md:static md:w-full md:translate-x-0 md:flex-row md:gap-6 md:py-6">
      <DashboardMobileNav />
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
