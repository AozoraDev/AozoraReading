import {
  llmSettingsFormSchema,
  type LlmSettingsFormValues,
} from "@/app/llm-settings/schema"

const STORAGE_KEY = "aozora:llm-settings"

export function loadLlmSettingsFromSession(): LlmSettingsFormValues | null {
  if (typeof window === "undefined") {
    return null
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed = llmSettingsFormSchema.safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : null
  } catch {
    return null
  }
}

export function saveLlmSettingsToSession(settings: LlmSettingsFormValues): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}
