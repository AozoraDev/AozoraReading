"use client"

import Link from "next/link"

import { CredentialFields } from "@/app/signup/components/credential-fields"
import { OtpVerificationFields } from "@/app/signup/components/otp-verification-fields"
import { SignupHeader } from "@/app/signup/components/signup-header"
import { useSignupForm } from "@/app/signup/hook/use-signup-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function SignupForm() {
  // 使用 useSignupForm 钩子获取表单状态与方法
  const form = useSignupForm()

  return (
    <Card className="w-full max-w-md shadow-sm">
      {/* form.t 是翻译函数 */}
      <SignupHeader t={form.t} />

      <CardContent>
        <form className="grid gap-5">
          <CredentialFields
            email={form.email}
            password={form.password}
            confirmPassword={form.confirmPassword}
            passwordMismatchError={form.passwordMismatchError}
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

          {/* 如果已发送邮件，渲染 OTP 验证字段 */}
          {form.emailSent ? (
            <OtpVerificationFields
              isVerifying={form.isVerifying}
              onVerify={form.verify}
              t={form.t}
            />
          ) : null}

          <p className="text-center text-sm text-muted-foreground">
            <Button variant="link" className="h-auto p-0" asChild>
              <Link href="/login">{form.t("signUp.backToLogin")}</Link>
            </Button>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
