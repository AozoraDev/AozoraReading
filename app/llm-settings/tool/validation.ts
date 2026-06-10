import type { FieldErrors } from "react-hook-form"
import type { ZodError } from "zod"

import type { LlmSettingsFormValues } from "@/app/llm-settings/schema"

/** 表单字段顺序，用于按优先级取第一条错误 */
export const LLM_SETTINGS_FIELD_ORDER: (keyof LlmSettingsFormValues)[] = [
  "baseUrl",
  "apiKey",
  "model",
]

/** 从 react-hook-form 错误中取第一条（按字段顺序） */
export function getFirstFieldErrorMessage(
  errors: FieldErrors<LlmSettingsFormValues>,
): string | undefined {
  for (const field of LLM_SETTINGS_FIELD_ORDER) {
    const message = errors[field]?.message
    if (typeof message === "string") {
      return message
    }
  }

  return undefined
}

/** 从 Zod 校验结果中取第一条（按字段顺序，否则取首个 issue） */
export function getFirstZodIssueMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("issues" in error)) {
    return undefined
  }

  const zodError = error as ZodError
  const messagesByField = new Map(
    zodError.issues.map((issue) => [issue.path[0], issue.message]),
  )

  for (const field of LLM_SETTINGS_FIELD_ORDER) {
    const message = messagesByField.get(field)
    if (typeof message === "string") {
      return message
    }
  }

  return zodError.issues[0]?.message
}
