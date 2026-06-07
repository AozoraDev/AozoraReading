import { FolderOpen, ImageIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef } from "react"
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { useWatch } from "react-hook-form"

import type { AddNovelFormValues } from "@/app/dashboard/add-novel/schema"
import { CoverPreviewPanel } from "@/app/dashboard/add-novel/components/add-novel-form/components/cover/cover-preview-panel"
import { CoverUploadZone } from "@/app/dashboard/add-novel/components/add-novel-form/components/cover/cover-upload-zone"
import { FormSectionHeader } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-section-header"
import { IconInputField } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/icon-input-field"
import { useCoverPreview } from "@/app/dashboard/add-novel/components/add-novel-form/hooks/use-cover-preview"

type CoverSectionProps = {
  register: UseFormRegister<AddNovelFormValues>
  control: Control<AddNovelFormValues>
  errors: FieldErrors<AddNovelFormValues>
}

export function CoverSection({ register, control, errors }: CoverSectionProps) {
  const t = useTranslations("dashboard.addNovel.form")
  const coverInputRef = useRef<HTMLInputElement>(null)

  const { ref: coverRef, ...coverRegister } = register("cover")
  const coverFiles = useWatch({ control, name: "cover" })
  const selectedCoverFile = coverFiles?.item(0)
  const coverPreviewUrl = useCoverPreview(selectedCoverFile ?? undefined)

  const translateError = (message: string | undefined) =>
    message ? t(message) : undefined

  return (
    <div className="space-y-4">
      <FormSectionHeader
        icon={ImageIcon}
        title={t("coverSection")}
        description={t("coverSectionDescription")}
      />

      <IconInputField
        id="add-novel-cover-url"
        label={t("coverUrlLabel")}
        placeholder={t("coverUrlPlaceholder")}
        icon={FolderOpen}
        hint={t("coverUrlHint")}
        error={translateError(errors.cover_url?.message)}
        registration={register("cover_url")}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_160px]">
        <CoverUploadZone
          id="add-novel-cover"
          label={t("coverLabel")}
          fileName={selectedCoverFile?.name}
          emptyLabel={t("noCoverSelected")}
          hint={t("coverHint")}
          chooseLabel={t("chooseCover")}
          error={translateError(errors.cover?.message)}
          inputRef={coverInputRef}
          coverRef={coverRef}
          registration={coverRegister}
        />

        <CoverPreviewPanel
          label={t("previewLabel")}
          previewUrl={coverPreviewUrl}
          emptyLabel={t("noCoverPreview")}
          alt={t("coverPreviewAlt")}
        />
      </div>
    </div>
  )
}
