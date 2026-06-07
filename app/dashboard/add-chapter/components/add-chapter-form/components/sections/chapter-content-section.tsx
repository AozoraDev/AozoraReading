import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRef } from "react"
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form"
import { useWatch } from "react-hook-form"

import { TxtUploadZone } from "@/app/dashboard/add-chapter/components/add-chapter-form/components/txt-upload-zone"
import type { AddChapterFormValues } from "@/app/dashboard/add-chapter/schema"
import { FormSectionHeader } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-section-header"

type ChapterContentSectionProps = {
  register: UseFormRegister<AddChapterFormValues>
  control: Control<AddChapterFormValues>
  errors: FieldErrors<AddChapterFormValues>
}

export function ChapterContentSection({
  register,
  control,
  errors,
}: ChapterContentSectionProps) {
  const t = useTranslations("dashboard.addChapter.form")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { ref: fileRef, ...fileRegister } = register("chapter_file")
  const chapterFiles = useWatch({ control, name: "chapter_file" })
  const selectedFile = chapterFiles?.item(0)

  const translateError = (message: string | undefined) =>
    message ? t(message) : undefined

  return (
    <div className="space-y-4">
      <FormSectionHeader
        icon={FileText}
        title={t("chapterContentSection")}
        description={t("chapterContentDescription")}
      />

      <TxtUploadZone
        id="add-chapter-file"
        label={t("fileLabel")}
        fileName={selectedFile?.name}
        emptyLabel={t("noFileSelected")}
        hint={t("fileHint")}
        chooseLabel={t("chooseFile")}
        error={translateError(errors.chapter_file?.message)}
        inputRef={fileInputRef}
        fileRef={fileRef}
        registration={fileRegister}
      />
    </div>
  )
}
