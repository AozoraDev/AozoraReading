import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/app/login/login-form"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("login")
}

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 sm:py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
