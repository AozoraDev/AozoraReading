import { Hash } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { useTranslations } from "next-intl"

import type { AddChapterFormValues } from "@/app/dashboard/add-chapter/schema"
import { FormSectionHeader } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-section-header"
import { IconInputField } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/icon-input-field"

type ChapterInfoSectionProps = {
  register: UseFormRegister<AddChapterFormValues>
  errors: FieldErrors<AddChapterFormValues>
}

export function ChapterInfoSection({ register, errors }: ChapterInfoSectionProps) {
  const t = useTranslations("dashboard.addChapter.form")

  const translateError = (message: string | undefined) =>
    message ? t(message) : undefined

  return (
    <div className="space-y-4">
      <FormSectionHeader
        icon={Hash}
        title={t("chapterInfoSection")}
        description={t("chapterInfoDescription")}
      />

      <IconInputField
        id="add-chapter-novel-id"
        label={t("novelIdLabel")}
        placeholder={t("novelIdPlaceholder")}
        icon={Hash}
        hint={t("novelIdHint")}
        error={translateError(errors.novel_id?.message)}
        registration={register("novel_id")}
      />
    </div>
  )
}
