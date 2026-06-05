"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, type FormEvent } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"

import { getLoginErrorKey } from "@/lib/supabase/auth/tool/getLoginErrorKey"
import { isValidEmail } from "@/lib/supabase/auth/tool/isValidEmail"
import { createClient } from "@/lib/supabase/client"

// 获取安全的重定向路径
function getSafeRedirect(path: string | null) {
  // 如果路径为空，或者路径不以 / 开头，或者路径以 // 开头，返回 /
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/"
  }

  // 返回路径
  return path
}

// 登录表单的提交与 toast 逻辑
export function useLoginForm() {
  const t = useTranslations("auth")
  const tLogin = useTranslations("auth.login")
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 处理表单提交
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // 阻止默认行为
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    // 如果 email 为空，显示错误 toast
    if (!email) {
      toast.error(tLogin("missingEmail"))
      return
    }

    // 如果 email 不是有效的邮箱，显示错误 toast
    if (!isValidEmail(email)) {
      toast.error(tLogin("invalidEmail"))
      return
    }
    
    // 如果 password 为空，显示错误 toast
    if (!password) {
      toast.error(tLogin("missingPassword"))
      return
    }

    // 设置正在提交状态     
    setIsSubmitting(true)

    try {
      // 创建 Supabase 客户端
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // 如果 error，显示错误 toast
      if (error) {
        toast.error(tLogin(getLoginErrorKey(error.message)))
        return
      }
      // 如果 data.session 为空，显示错误 toast
      if (!data.session) {
        // 显示失败 toast
        toast.error(tLogin("failure"))
        return
      }

      // 显示成功 toast
      toast.success(tLogin("success"))
      // 跳转重定向路径
      router.push(getSafeRedirect(searchParams.get("redirect")))
      // 刷新页面
      router.refresh()
    } catch {
      // 显示失败 toast
      toast.error(tLogin("failure"))
    } finally {
      // 设置正在提交状态为 false
      setIsSubmitting(false)
    }
  }

  return {
    t,
    handleSubmit,
    isSubmitting,
  }
}
