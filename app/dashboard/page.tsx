import type { Metadata } from "next"

import { DashboardPageShell } from "@/app/dashboard/components/dashboard-page-shell"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("dashboard")
}

export default function DashboardPage() {
  return <DashboardPageShell />
}
