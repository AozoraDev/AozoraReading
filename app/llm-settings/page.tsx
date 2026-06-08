import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import { LlmSettingsPageShell } from "@/app/llm-settings/components/llm-settings-page-shell"
import { getPageMetadata } from "@/lib/metadata"

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("llmSettings")
}

export default async function LlmSettingsPage() {
  const t = await getTranslations("llmSettings")

  return (
    <LlmSettingsPageShell
      title={t("title")}
      subtitle={t("description")}
      sessionHint={t("sessionHint")}
    />
  )
}
