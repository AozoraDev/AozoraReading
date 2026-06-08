import { z } from "zod"

export const llmSettingsFormSchema = z.object({
  baseUrl: z
    .string()
    .trim()
    .min(1, { message: "baseUrlRequired" })
    .url({ message: "baseUrlInvalid" }),
  model: z.string().trim().min(1, { message: "modelRequired" }),
  apiKey: z.string().trim().min(1, { message: "apiKeyRequired" }),
})

export type LlmSettingsFormValues = z.infer<typeof llmSettingsFormSchema>
