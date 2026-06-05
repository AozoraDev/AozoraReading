"use client"

import { useRouter } from "next/navigation"
import { useActionState, useCallback, useState } from "react"
import { useTranslations } from "next-intl"

import { signupAction } from "@/app/signup/server/actions"
import {
  INITIAL_ACTION_STATE,
  type SignUpIntent,
} from "@/app/signup/types"
import { getPasswordMismatchError } from "@/hooks/get-password-mismatch-error"
import { getSendEmailButtonState } from "@/hooks/get-send-email-button-state"
import { useActionToast } from "@/hooks/use-action-toast"
import { useCooldown } from "@/hooks/use-cooldown"

export function useSignupForm() {
  const t = useTranslations("auth")
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [pendingIntent, setPendingIntent] = useState<SignUpIntent | null>(null)
  const cooldown = useCooldown()
  const { start: startCooldown } = cooldown

  const [actionState, dispatch, isPending] = useActionState(
    signupAction,
    INITIAL_ACTION_STATE,
  )

  const sendEmail = useCallback(
    (formData: FormData) => {
      formData.set("intent", "send")
      setPendingIntent("send")
      dispatch(formData)
    },
    [dispatch],
  )

  const resendEmail = useCallback(
    (formData: FormData) => {
      formData.set("intent", "resend")
      setPendingIntent("resend")
      dispatch(formData)
    },
    [dispatch],
  )

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

  const handleActionSuccess = useCallback(() => {
    if (actionState?.intent === "send") {
      setEmailSent(true)
    }
    if (actionState?.intent === "send" || actionState?.intent === "resend") {
      startCooldown()
      return
    }
    if (actionState?.intent === "verify") {
      router.push("/")
      router.refresh()
    }
  }, [actionState, router, startCooldown])

  useActionToast(actionState, handleActionSuccess)

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
      "signUp",
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
      i18nPrefix: "signUp",
    }),
    emailSent,
    sendEmail,
    resendEmail,
    verify,
    isVerifying,
  }
}
