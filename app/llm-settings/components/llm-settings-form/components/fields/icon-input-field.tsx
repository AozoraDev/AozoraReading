import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { UseFormRegister } from "react-hook-form"

import { FormField } from "@/app/signup/components/form-field"
import type { LlmSettingsFormValues } from "@/app/llm-settings/schema"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type IconInputFieldProps = {
  id: keyof LlmSettingsFormValues
  label: string
  placeholder: string
  icon: LucideIcon
  error?: string
  hint?: ReactNode
  registration: ReturnType<UseFormRegister<LlmSettingsFormValues>>
}

export function IconInputField({
  id,
  label,
  placeholder,
  icon: Icon,
  error,
  hint,
  registration,
}: IconInputFieldProps) {
  const hasError = Boolean(error)

  return (
    <FormField id={id} label={label} error={error}>
      <InputGroup aria-invalid={hasError || undefined}>
        <InputGroupAddon align="inline-start">
          <Icon aria-hidden />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          autoComplete="off"
          aria-invalid={hasError}
          placeholder={placeholder}
          {...registration}
        />
      </InputGroup>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </FormField>
  )
}
