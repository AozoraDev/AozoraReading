import type { Metadata } from "next"

import { ForgetForm } from "@/app/forget/forget-form"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("forget")
}

export default function ForgetPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 sm:py-16">
      <ForgetForm />
    </div>
  )
}
