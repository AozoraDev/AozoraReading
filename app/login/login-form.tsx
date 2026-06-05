"use client"

import { LoginActions } from "@/app/login/components/login-actions"
import { LoginFields } from "@/app/login/components/login-fields"
import { LoginHeader } from "@/app/login/components/login-header"
import { useLoginForm } from "@/app/login/hook/use-login-form"
import { Card, CardContent } from "@/components/ui/card"

export function LoginForm() {
  const form = useLoginForm()

  return (
    <Card className="w-full max-w-md shadow-sm">
      <LoginHeader t={form.t} />

      <CardContent>
        <form className="grid gap-5" onSubmit={form.handleSubmit}>
          <LoginFields t={form.t} />

          <LoginActions isSubmitting={form.isSubmitting} t={form.t} />
        </form>
      </CardContent>
    </Card>
  )
}
