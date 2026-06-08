import { FormField } from "@/app/signup/components/form-field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { TranslateFn } from "@/lib/auth-form/types"

type OtpVerificationFieldsProps = {
  isVerifying: boolean
  onVerify: (formData: FormData) => void
  t: TranslateFn
  messagePrefix: "signUp" | "forget"
  otpRequired?: boolean
}

export function OtpVerificationFields({
  isVerifying,
  onVerify,
  t,
  messagePrefix,
  otpRequired = false,
}: OtpVerificationFieldsProps) {
  return (
    <>
      <Separator />

      <FormField id="otp" label={t(`${messagePrefix}.otp`)}>
        <Input
          id="otp"
          name="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder={t(`${messagePrefix}.otpPlaceholder`)}
          maxLength={otpRequired ? 8 : undefined}
          required={otpRequired}
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
        {isVerifying
          ? t(`${messagePrefix}.verifying`)
          : t(`${messagePrefix}.verify`)}
      </Button>
    </>
  )
}
