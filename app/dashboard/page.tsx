import type { Metadata } from "next"

import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("dashboard")
}

export default function DashboardPage() {
  return null
}
