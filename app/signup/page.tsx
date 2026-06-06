import type { Metadata } from "next"

import { SignupForm } from "@/app/signup/signup-form"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("signup")
}

export default function SignupPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 sm:py-16">
      <SignupForm />
    </div>
  )
}
