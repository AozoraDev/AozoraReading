import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react"
import type { UseFormRegister } from "react-hook-form"

import { FormField } from "@/app/signup/components/form-field"
import type { LlmSettingsFormValues } from "@/app/llm-settings/schema"
import type { TranslateFn } from "@/app/llm-settings/types"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

type ApiKeyFieldProps = {
  error?: string
  showApiKey: boolean
  onToggleVisibility: () => void
  registration: ReturnType<UseFormRegister<LlmSettingsFormValues>>
  t: TranslateFn
}

export function ApiKeyField({
  error,
  showApiKey,
  onToggleVisibility,
  registration,
  t,
}: ApiKeyFieldProps) {
  const hasError = Boolean(error)

  return (
    <FormField id="apiKey" label={t("apiKeyLabel")} error={error}>
      <InputGroup aria-invalid={hasError || undefined}>
        <InputGroupAddon align="inline-start">
          <KeyIcon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          id="apiKey"
          type={showApiKey ? "text" : "password"}
          autoComplete="off"
          aria-invalid={hasError}
          placeholder={t("apiKeyPlaceholder")}
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="button"
            size="icon-xs"
            aria-label={showApiKey ? t("hideApiKey") : t("showApiKey")}
            onClick={onToggleVisibility}
          >
            {showApiKey ? <EyeOffIcon aria-hidden /> : <EyeIcon aria-hidden />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </FormField>
  )
}
