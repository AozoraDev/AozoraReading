"use client"

import Link from "next/link"
import { LogOutIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import { navbarStyles } from "@/components/sections/navbar/styles/styles"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { useAuthUser } from "@/lib/supabase/auth/hook/use-auth-user"
import { createClient } from "@/lib/supabase/client"

// 登录按钮
export function NavbarLogin() {
  const t = useTranslations("nav")
  const router = useRouter()
  // 获取用户信息
  const { email, isLoggedIn, ready } = useAuthUser()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (!ready) {
    return <div className="h-9 w-16 shrink-0" aria-hidden="true" />
  }

  if (isLoggedIn && email) {
    return (
      <NavigationMenu
        viewport={false}
        className="max-w-none"
        aria-label={t("userMenu")}
      >
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navbarStyles.userMenuTrigger}>
              <span className="truncate">{email.split("@")[0]}</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className={navbarStyles.userMenuContent}>
              <Button
                type="button"
                variant="ghost"
                className={navbarStyles.logoutButton}
                onClick={handleSignOut}
              >
                <LogOutIcon />
                {t("logout")}
              </Button>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    )
  }

  return (
    <Button size="lg" className={navbarStyles.loginButton} asChild>
      <Link href="/login" aria-label={t("login")}>
        {t("login")}
      </Link>
    </Button>
  )
}
