import { BotIcon, LinkIcon } from "lucide-react"

import { ApiKeyField } from "@/app/llm-settings/components/llm-settings-form/components/fields/api-key-field"
import { IconInputField } from "@/app/llm-settings/components/llm-settings-form/components/fields/icon-input-field"
import type { LlmSettingsFormController } from "@/app/llm-settings/hook/use-llm-settings-form"
import type { LlmSettingsFormValues } from "@/app/llm-settings/schema"
import type { TranslateFn } from "@/app/llm-settings/types"
import type { FieldErrors } from "react-hook-form"

function fieldError(
  t: TranslateFn,
  errors: FieldErrors<LlmSettingsFormValues>,
  field: keyof LlmSettingsFormValues,
) {
  const messageKey = errors[field]?.message
  return messageKey ? t(messageKey) : undefined
}

export function LlmSettingsFormFields({
  form,
}: {
  form: Pick<
    LlmSettingsFormController,
    "t" | "register" | "errors" | "showApiKey" | "toggleApiKeyVisibility"
  >
}) {
  const { t, register, errors, showApiKey, toggleApiKeyVisibility } = form

  return (
    <>
      <IconInputField
        id="baseUrl"
        label={t("baseUrlLabel")}
        placeholder={t("baseUrlPlaceholder")}
        icon={LinkIcon}
        hint={t("baseUrlHint")}
        error={fieldError(t, errors, "baseUrl")}
        registration={register("baseUrl")}
      />

      <ApiKeyField
        error={fieldError(t, errors, "apiKey")}
        showApiKey={showApiKey}
        onToggleVisibility={toggleApiKeyVisibility}
        registration={register("apiKey")}
        t={t}
      />

      <IconInputField
        id="model"
        label={t("modelLabel")}
        placeholder={t("modelPlaceholder")}
        icon={BotIcon}
        error={fieldError(t, errors, "model")}
        registration={register("model")}
      />
    </>
  )
}
