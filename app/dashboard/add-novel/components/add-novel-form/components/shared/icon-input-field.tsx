import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"
import type { UseFormRegisterReturn } from "react-hook-form"

import { FormField } from "@/app/signup/components/form-field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

/** 带左侧图标的表单输入框，封装 FormField + InputGroup，供 react-hook-form 使用 */
type IconInputFieldProps = {
  id: string
  label: string
  placeholder: string
  icon: LucideIcon
  error?: string
  hint?: ReactNode
  /** register("fieldName") 的返回值，用于绑定字段 */
  registration: UseFormRegisterReturn
}

// 带图标的表单输入框
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
        {/* 图标仅作装饰，不参与可读内容 */}
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
