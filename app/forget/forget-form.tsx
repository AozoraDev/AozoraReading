"use client"

import Image from "next/image"
import Link from "next/link"

import { OtpVerificationFields } from "@/components/auth/otp-verification-fields"
import { useForgetForm } from "@/app/forget/hook/use-forget-form"
import { CredentialFields } from "@/app/signup/components/credential-fields"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ForgetForm() {
  const form = useForgetForm()

  return (
    <Card className="w-full max-w-md shadow-sm">
      <CardHeader className="text-center">
        <Image
          src="/img/logo.png"
          alt="Aozora Reading"
          width={40}
          height={40}
          className="mx-auto block size-10 sm:size-12"
          priority
        />
        <CardTitle className="text-xl text-brand-blue">
          {form.t("forget.title")}
        </CardTitle>
        <CardDescription>{form.t("forget.description")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5">
          <CredentialFields
            email={form.email}
            password={form.password}
            confirmPassword={form.confirmPassword}
            passwordMismatchError={form.passwordMismatchError}
            passwordLabel={form.t("forget.newPassword")}
            passwordPlaceholder={form.t("forget.newPasswordPlaceholder")}
            confirmPasswordLabel={form.t("forget.confirmNewPassword")}
            confirmPasswordPlaceholder={form.t(
              "forget.confirmNewPasswordPlaceholder",
            )}
            onEmailChange={form.setEmail}
            onPasswordChange={form.setPassword}
            onConfirmPasswordChange={form.setConfirmPassword}
            t={form.t}
          />

          <Button
            type="submit"
            formAction={form.emailSent ? form.resendEmail : form.sendEmail}
            formNoValidate
            variant="brandOutlineCta"
            size="pill"
            className="w-full"
            disabled={form.sendEmailButton.disabled}
          >
            {form.sendEmailButton.label}
          </Button>

          {form.emailSent ? (
            <OtpVerificationFields
              isVerifying={form.isVerifying}
              onVerify={form.verify}
              t={form.t}
              messagePrefix="forget"
              otpRequired
            />
          ) : null}

          <p className="text-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="text-primary underline-offset-4 hover:underline"
            >
              {form.t("forget.backToLogin")}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
