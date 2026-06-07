"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { FieldErrors } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { ChapterContentSection } from "@/app/dashboard/add-chapter/components/add-chapter-form/components/sections/chapter-content-section"
import { ChapterInfoSection } from "@/app/dashboard/add-chapter/components/add-chapter-form/components/sections/chapter-info-section"
import { submitAddChapter } from "@/app/dashboard/add-chapter/components/add-chapter-form/submit"
import {
  addChapterFormSchema,
  toAddChapterSubmitPayload,
  type AddChapterFormValues,
} from "@/app/dashboard/add-chapter/schema"
import { FormSubmitButton } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-submit-button"
import { Separator } from "@/components/ui/separator"

const VALIDATION_FIELD_ORDER: (keyof AddChapterFormValues)[] = ["novel_id", "chapter_file"]

function getFirstValidationMessage(
  errors: FieldErrors<AddChapterFormValues>,
): string | undefined {
  for (const field of VALIDATION_FIELD_ORDER) {
    const message = errors[field]?.message
    if (typeof message === "string") {
      return message
    }
  }

  return undefined
}

export function AddChapterForm() {
  const router = useRouter()
  const t = useTranslations("dashboard.addChapter.form")

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddChapterFormValues>({
    resolver: zodResolver(addChapterFormSchema),
    defaultValues: {
      novel_id: "",
      chapter_file: undefined,
    },
  })

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        const message = await submitAddChapter(toAddChapterSubmitPayload(values))
        toast.success(message)
        reset()
        router.refresh()
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t("submitError"))
      }
    },
    (formErrors) => {
      const messageKey = getFirstValidationMessage(formErrors)
      toast.error(messageKey ? t(messageKey) : t("submitError"))
    },
  )

  return (
    <form className="space-y-8 [&_label]:text-brand-blue" onSubmit={onSubmit} noValidate>
      <ChapterInfoSection register={register} errors={errors} />

      <Separator className="bg-brand-green data-horizontal:h-1" />

      <ChapterContentSection register={register} control={control} errors={errors} />

      <Separator className="bg-brand-green data-horizontal:h-1" />

      <FormSubmitButton
        isPending={isSubmitting}
        submitLabel={t("submit")}
        submittingLabel={t("submitting")}
      />
    </form>
  )
}
