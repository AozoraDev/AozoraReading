import { DashboardMobileNav } from "@/app/dashboard/components/navigation/dashboard-mobile-nav"
import { DashboardSidebar } from "@/app/dashboard/components/navigation/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 pb-6 pt-0 md:flex-row md:gap-6 md:py-6">
      <DashboardMobileNav />
      <DashboardSidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
