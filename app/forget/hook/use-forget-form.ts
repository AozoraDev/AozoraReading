"use client"

import { useRouter } from "next/navigation"
import { useActionState, useCallback, useState } from "react"
import { useTranslations } from "next-intl"

import { forgetAction } from "@/app/forget/server/actions"
import {
  INITIAL_FORGET_ACTION_STATE,
  type ForgetIntent,
} from "@/app/forget/types"
import { getPasswordMismatchError } from "@/hooks/get-password-mismatch-error"
import { getSendEmailButtonState } from "@/hooks/get-send-email-button-state"
import { useActionToast } from "@/hooks/use-action-toast"
import { useCooldown } from "@/hooks/use-cooldown"

// 使用忘记表单
export function useForgetForm() {
  const t = useTranslations("auth")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [pendingIntent, setPendingIntent] = useState<ForgetIntent | null>(null)
  const cooldown = useCooldown()
  const { start: startCooldown } = cooldown

  const [actionState, dispatch, isPending] = useActionState(
    forgetAction,
    INITIAL_FORGET_ACTION_STATE,
  )

  // 发送邮件
  const sendEmail = useCallback(
    (formData: FormData) => {
      formData.set("intent", "send")
      setPendingIntent("send")
      dispatch(formData)
    },
    [dispatch],
  )

  // 重新发送邮件
  const resendEmail = useCallback(
    (formData: FormData) => {
      formData.set("intent", "resend")
      setPendingIntent("resend")
      dispatch(formData)
    },
    [dispatch],
  )
  
  // 验证
  const verify = useCallback(
    (formData: FormData) => {
      formData.set("intent", "verify")
      setPendingIntent("verify")
      dispatch(formData)
    },
    [dispatch],
  )

  const isSending = isPending && pendingIntent === "send"
  const isResending = isPending && pendingIntent === "resend"
  const isVerifying = isPending && pendingIntent === "verify"
  
  // 处理成功
  const handleActionSuccess = useCallback(() => {
    if (actionState?.intent === "send") {
      setEmailSent(true)
    }
    if (actionState?.intent === "send" || actionState?.intent === "resend") {
      startCooldown()
      return
    }
    if (actionState?.intent === "verify") {
      router.push("/login")
      router.refresh()
    }
  }, [actionState, router, startCooldown])

  // 使用动作提示
  useActionToast(actionState, handleActionSuccess)

  // 密码匹配
  const passwordsMatch = password === confirmPassword

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatchError: getPasswordMismatchError(
      password,
      confirmPassword,
      t,
      "forget",
    ),
    sendEmailButton: getSendEmailButtonState({
      emailSent,
      isSending,
      isResending,
      email,
      password,
      passwordsMatch,
      cooldown,
      t,
      i18nPrefix: "forget",
    }),
    emailSent,
    sendEmail,
    resendEmail,
    verify,
    isVerifying,
  }
}
