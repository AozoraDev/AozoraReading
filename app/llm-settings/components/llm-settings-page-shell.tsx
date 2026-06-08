import { Sparkles } from "lucide-react"

import { LlmSettingsForm } from "@/app/llm-settings/components/llm-settings-form"
import { SectionHeader } from "@/components/sections/sectionHeader"

type LlmSettingsPageShellProps = {
  title: string
  subtitle: string
  sessionHint: string
}

export function LlmSettingsPageShell({
  title,
  subtitle,
  sessionHint,
}: LlmSettingsPageShellProps) {
  return (
    <div className="py-8 sm:py-12">
      <SectionHeader
        icon={Sparkles}
        title={title}
        subtitle={subtitle}
        badge={sessionHint}
      />

      <div className="rounded-xl border border-border/60 bg-background p-6 shadow-sm">
        <LlmSettingsForm />
      </div>
    </div>
  )
}
