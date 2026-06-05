"use client"

import Link from "next/link"

import {
  isNavActive,
  type NavItemKey,
} from "@/components/sections/navbar/utils/constants"
import {
  desktopNavLinkVariants,
  mobileNavLinkVariants,
} from "@/components/sections/navbar/styles/styles"
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

type NavItemLinkProps = {
  item: NavItemKey
  label: string
  pathname: string
  variant: "desktop" | "mobile"
  onNavigate?: () => void
}

// 导航项链接
export function NavItemLink({
  item,
  label,
  pathname,
  variant,
  onNavigate,
}: NavItemLinkProps) {
  // 判断是否为当前路径
  const active = isNavActive(pathname, item.href)

  // 如果为桌面端，返回桌面端导航项链接
  if (variant === "desktop") {
    return (
      <NavigationMenuItem>
        <NavigationMenuLink
          asChild
          active={active}
          className={cn(desktopNavLinkVariants({ active }))}
        >
          <Link href={item.href} aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    )
  }

  // 如果为移动端，返回移动端导航项链接
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className={mobileNavLinkVariants({ active })}
      >
        {label}
      </Link>
    </li>
  )
}
