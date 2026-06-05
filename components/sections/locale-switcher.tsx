"use client"

import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { setLocale } from "@/i18n/actions"
import { locales, type Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

export function LocaleSwitcher() {
  const locale = useLocale() as Locale
  const t = useTranslations("locale")
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleSwitch(nextLocale: Locale) {
    if (nextLocale === locale || isPending) return

    startTransition(async () => {
      await setLocale(nextLocale)
      router.refresh()
    })
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="inline-flex shrink-0 overflow-hidden rounded-lg border border-brand-blue bg-white"
    >
      {locales.map((item, index) => {
        const isActive = item === locale

        return (
          <button
            key={item}
            type="button"
            onClick={() => handleSwitch(item)}
            disabled={isPending}
            aria-current={isActive ? "true" : undefined}
            aria-label={t("switchTo", { locale: t(item) })}
            className={cn(
              "h-9 whitespace-nowrap px-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 lg:px-3",
              index > 0 && "border-l border-brand-blue",
              isActive
                ? "bg-brand-blue text-white"
                : "text-brand-blue hover:bg-brand-blue/10"
            )}
          >
            {t(item)}
          </button>
        )
      })}
    </div>
  )
}
