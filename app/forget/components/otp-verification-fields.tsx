import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FormField } from "@/app/signup/components/form-field"
import type { TranslateFn } from "@/app/forget/types"

// 验证 OTP 字段
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

      <FormField id="otp" label={t("forget.otp")}>
        <Input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder={t("forget.otpPlaceholder")}
          maxLength={8}
          required
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
        {isVerifying ? t("forget.verifying") : t("forget.verify")}
      </Button>
    </>
  )
}
