import Link from "next/link"

import type { TranslateFn } from "@/app/login/types"
import { FormField } from "@/app/signup/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginFields({ t }: { t: TranslateFn }) {
  return (
    <>
      <FormField id="email" label={t("email")}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          required
        />
      </FormField>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Button variant="link" className="h-auto p-0 text-sm" asChild>
            <Link href="/forget">{t("login.forgotPassword")}</Link>
          </Button>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          required
        />
      </div>
    </>
  )
}
