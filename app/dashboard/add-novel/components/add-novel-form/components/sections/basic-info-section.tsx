import { BookOpen, Tags, User } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { useTranslations } from "next-intl"

import type { AddNovelFormValues } from "@/app/dashboard/add-novel/schema"
import { parseTagsInput } from "@/app/dashboard/add-novel/schema"
import { FormSectionHeader } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-section-header"
import { IconInputField } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/icon-input-field"
import { FormField } from "@/app/signup/components/form-field"
import { Textarea } from "@/components/ui/textarea"

type BasicInfoSectionProps = {
  register: UseFormRegister<AddNovelFormValues>
  errors: FieldErrors<AddNovelFormValues>
}

export function BasicInfoSection({ register, errors }: BasicInfoSectionProps) {
  const t = useTranslations("dashboard.addNovel.form")
  const tagHintExamples = parseTagsInput(t("tagsHintExamples"))

  const translateError = (message: string | undefined) =>
    message ? t(message) : undefined

  return (
    <div className="space-y-4">
      <FormSectionHeader
        icon={BookOpen}
        title={t("basicInfoSection")}
        description={t("basicInfoDescription")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <IconInputField
          id="add-novel-title"
          label={t("titleLabel")}
          placeholder={t("titlePlaceholder")}
          icon={BookOpen}
          error={translateError(errors.title?.message)}
          registration={register("title")}
        />

        <IconInputField
          id="add-novel-author"
          label={t("authorLabel")}
          placeholder={t("authorPlaceholder")}
          icon={User}
          error={translateError(errors.author?.message)}
          registration={register("author")}
        />
      </div>

      <FormField id="add-novel-summary" label={t("summaryLabel")}>
        <Textarea
          id="add-novel-summary"
          rows={4}
          placeholder={t("summaryPlaceholder")}
          aria-invalid={Boolean(errors.summary?.message)}
          {...register("summary")}
        />
      </FormField>

      <IconInputField
        id="add-novel-tags"
        label={t("tagsLabel")}
        placeholder={t("tagsPlaceholder")}
        icon={Tags}
        error={translateError(errors.tags?.message)}
        registration={register("tags")}
        hint={
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            <span>{t("tagsHint")}</span>
            {tagHintExamples.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-brand-green/70 bg-brand-green/15 px-2 py-0.5 text-xs font-medium text-brand-blue"
              >
                {tag}
              </span>
            ))}
          </p>
        }
      />
    </div>
  )
}
