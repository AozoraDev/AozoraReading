"use client"

import { LlmSettingsFormActions } from "@/app/llm-settings/components/llm-settings-form/components/actions/form-actions"
import { LlmSettingsFormFields } from "@/app/llm-settings/components/llm-settings-form/components/fields/form-fields"
import { useLlmSettingsForm } from "@/app/llm-settings/hook/use-llm-settings-form"

export function LlmSettingsForm() {
  const form = useLlmSettingsForm()

  return (
    <form className="grid gap-6" onSubmit={form.onSave}>
      <LlmSettingsFormFields form={form} />
      <LlmSettingsFormActions form={form} />
    </form>
  )
}
