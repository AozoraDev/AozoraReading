"use client"

import { Menu, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { navbarStyles } from "@/components/sections/navbar/styles/styles"
import { Button } from "@/components/ui/button"

type NavbarMobileToggleProps = {
  open: boolean
  onToggle: () => void
}

export function NavbarMobileToggle({ open, onToggle }: NavbarMobileToggleProps) {
  const t = useTranslations("nav")

  return (
    <Button
      type="button"
      variant="outline"
      size="icon-lg"
      className={navbarStyles.mobileToggle}
      aria-expanded={open}
      aria-label={open ? t("closeMenu") : t("openMenu")}
      onClick={onToggle}
    >
      {open ? <X aria-hidden /> : <Menu aria-hidden />}
    </Button>
  )
}
