"use client"

import { useTranslations } from "next-intl"

import {
  getVisibleNavItems,
  type NavItemKey,
} from "@/components/sections/navbar/utils/constants"
import { useAuthUser } from "@/lib/supabase/auth/hook/use-auth-user"

export type NavItemWithLabel = NavItemKey & { label: string }

// 获取可见的导航项
export function useNavItems(): NavItemWithLabel[] {
  const t = useTranslations("nav")
  const { isLoggedIn, email } = useAuthUser()

  // 获取可见的导航项
  return getVisibleNavItems(isLoggedIn, email).map((item) => ({
    ...item,
    label: t(item.key),
  }))
}
