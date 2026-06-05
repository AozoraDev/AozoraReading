import { Input } from "@/components/ui/input"

import { FormField } from "@/app/signup/components/form-field"

import type { TranslateFn } from "@/app/signup/types"

// 渲染注册表单的「邮箱 + 密码 + 确认密码」字段
export function CredentialFields({
  email,
  password,
  confirmPassword,
  passwordMismatchError,
  passwordLabel,
  passwordPlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  t,
}: {
  email: string
  password: string
  confirmPassword: string
  passwordMismatchError?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  confirmPasswordLabel?: string
  confirmPasswordPlaceholder?: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onConfirmPasswordChange: (value: string) => void
  t: TranslateFn
}) {
  return (
    <>
      <FormField id="email" label={t("email")}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
        />
      </FormField>

      <FormField id="password" label={passwordLabel ?? t("password")}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder={passwordPlaceholder ?? t("passwordPlaceholder")}
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label={confirmPasswordLabel ?? t("confirmPassword")}
        error={passwordMismatchError}
      >
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder={
            confirmPasswordPlaceholder ?? t("confirmPasswordPlaceholder")
          }
          value={confirmPassword}
          onChange={(e) => onConfirmPasswordChange(e.target.value)}
          aria-invalid={!!passwordMismatchError}
          required
        />
      </FormField>
    </>
  )
}
