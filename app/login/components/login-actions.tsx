import Link from "next/link"

import type { TranslateFn } from "@/app/login/types"
import { Button } from "@/components/ui/button"

export function LoginActions({
  isSubmitting,
  t,
}: {
  isSubmitting: boolean
  t: TranslateFn
}) {
  return (
    <div className="flex gap-3 pt-1">
      <Button
        type="submit"
        variant="brandCta"
        size="pill"
        className="flex-1"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("login.submitting") : t("login.submit")}
      </Button>
      <Button variant="brandOutlineCta" size="pill" className="flex-1" asChild>
        <Link href="/signup">{t("login.register")}</Link>
      </Button>
    </div>
  )
}
