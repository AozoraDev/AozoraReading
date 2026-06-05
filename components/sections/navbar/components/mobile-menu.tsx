"use client"

import { useTranslations } from "next-intl"

import { NavItemLink } from "@/components/sections/navbar/components/nav-item-link"
import { useNavItems } from "@/components/sections/navbar/hooks/use-nav-items"
import { navbarStyles } from "@/components/sections/navbar/styles/styles"

type NavbarMobileMenuProps = {
  pathname: string
  open: boolean
  onClose: () => void
}

export function NavbarMobileMenu({
  pathname,
  open,
  onClose,
}: NavbarMobileMenuProps) {
  const t = useTranslations("nav")
  const items = useNavItems()

  if (!open) return null

  return (
    <nav className={navbarStyles.mobileMenu} aria-label={t("mainNav")}>
      <ul className={navbarStyles.mobileMenuList}>
        {items.map((item) => (
          <NavItemLink
            key={item.href}
            item={item}
            label={item.label}
            pathname={pathname}
            variant="mobile"
            onNavigate={onClose}
          />
        ))}
      </ul>
    </nav>
  )
}
