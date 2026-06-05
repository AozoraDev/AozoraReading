"use client"

import { useTranslations } from "next-intl"

import { NavItemLink } from "@/components/sections/navbar/components/nav-item-link"
import { useNavItems } from "@/components/sections/navbar/hooks/use-nav-items"
import { navbarStyles } from "@/components/sections/navbar/styles/styles"
import {
  NavigationMenu,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

// 导航菜单
export function NavbarNav({ pathname }: { pathname: string }) {
  const t = useTranslations("nav")
  const items = useNavItems()

  // 返回导航菜单
  return (
    <NavigationMenu
      viewport={false}
      className={navbarStyles.navMenu}
      aria-label={t("mainNav")}
    >
      <NavigationMenuList className={navbarStyles.navMenuList}>
        {items.map((item) => (
          <NavItemLink
            key={item.href}
            item={item}
            label={item.label}
            pathname={pathname}
            variant="desktop"
          />
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
