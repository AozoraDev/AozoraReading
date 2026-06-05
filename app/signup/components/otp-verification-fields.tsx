import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FormField } from "@/app/signup/components/form-field"
import type { TranslateFn } from "@/app/signup/types"

// 渲染 OTP 验证字段，包含输入框与提交按钮
export function OtpVerificationFields({
  isVerifying,
  onVerify,
  t,
}: {
  isVerifying: boolean
  onVerify: (formData: FormData) => void
  t: TranslateFn
}) {
  return (
    <>
      <Separator />

      <FormField id="otp" label={t("signUp.otp")}>
        <Input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder={t("signUp.otpPlaceholder")}
        />
      </FormField>

      <Button
        type="submit"
        formAction={onVerify}
        variant="brandCta"
        size="pill"
        className="w-full"
        disabled={isVerifying}
      >
        {isVerifying ? t("signUp.verifying") : t("signUp.verify")}
      </Button>
    </>
  )
}
