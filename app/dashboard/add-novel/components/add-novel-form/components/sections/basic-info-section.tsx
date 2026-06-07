import { BookOpen, User } from "lucide-react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import { useTranslations } from "next-intl"

import type { AddNovelFormValues } from "@/app/dashboard/add-novel/schema"
import { FormSectionHeader } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-section-header"
import { IconInputField } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/icon-input-field"

type BasicInfoSectionProps = {
  register: UseFormRegister<AddNovelFormValues>
  errors: FieldErrors<AddNovelFormValues>
}

export function BasicInfoSection({ register, errors }: BasicInfoSectionProps) {
  const t = useTranslations("dashboard.addNovel.form")

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
    </div>
  )
}
