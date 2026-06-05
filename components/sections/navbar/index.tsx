"use client"

import { usePathname } from "next/navigation"
import { useState } from "react"

import { NavbarBrand } from "@/components/sections/navbar/components/brand"
import { NavbarLogin } from "@/components/sections/navbar/components/login"
import { NavbarMobileMenu } from "@/components/sections/navbar/components/mobile-menu"
import { NavbarMobileToggle } from "@/components/sections/navbar/components/mobile-toggle"
import { NavbarNav } from "@/components/sections/navbar/components/nav"
import { navbarStyles } from "@/components/sections/navbar/styles/styles"
import { LocaleSwitcher } from "@/components/sections/locale-switcher"

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>
        <NavbarBrand />

        <div className={navbarStyles.desktopNavWrapper}>
          <NavbarNav pathname={pathname} />
        </div>

        <div className={navbarStyles.actions}>
          <LocaleSwitcher />
          <NavbarLogin />
          <NavbarMobileToggle
            open={mobileOpen}
            onToggle={() => setMobileOpen((open) => !open)}
          />
        </div>
      </div>

      <NavbarMobileMenu
        pathname={pathname}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </header>
  )
}
