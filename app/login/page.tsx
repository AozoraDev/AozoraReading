import { Suspense } from "react"

import { LoginForm } from "@/app/login/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 sm:py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
