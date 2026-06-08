"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { FieldErrors } from "react-hook-form"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { BasicInfoSection } from "@/app/dashboard/add-novel/components/add-novel-form/components/sections/basic-info-section"
import { CoverSection } from "@/app/dashboard/add-novel/components/add-novel-form/components/sections/cover-section"
import { FormSubmitButton } from "@/app/dashboard/add-novel/components/add-novel-form/components/shared/form-submit-button"
import { submitAddNovel } from "@/app/dashboard/add-novel/components/add-novel-form/submit"
import {
  addNovelFormSchema,
  toAddNovelSubmitPayload,
  type AddNovelFormValues,
} from "@/app/dashboard/add-novel/schema"
import { Separator } from "@/components/ui/separator"

const VALIDATION_FIELD_ORDER: (keyof AddNovelFormValues)[] = [
  "title",
  "author",
  "summary",
  "tags",
  "cover_url",
  "cover",
]

function getFirstValidationMessage(errors: FieldErrors<AddNovelFormValues>): string | undefined {
  for (const field of VALIDATION_FIELD_ORDER) {
    const message = errors[field]?.message
    if (typeof message === "string") {
      return message
    }
  }

  return undefined
}

export function AddNovelForm() {
  const router = useRouter()
  const t = useTranslations("dashboard.addNovel.form")

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddNovelFormValues>({
    resolver: zodResolver(addNovelFormSchema),
    defaultValues: {
      title: "",
      author: "",
      summary: "",
      tags: "",
      cover_url: "",
      cover: undefined,
    },
  })

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        await submitAddNovel(toAddNovelSubmitPayload(values))
        toast.success(t("submitSuccess"))
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
      <BasicInfoSection register={register} errors={errors} />

      <Separator className="bg-brand-green data-horizontal:h-1" />

      <CoverSection register={register} control={control} errors={errors} />

      <Separator className="bg-brand-green data-horizontal:h-1" />

      <FormSubmitButton
        isPending={isSubmitting}
        submitLabel={t("submit")}
        submittingLabel={t("submitting")}
      />
    </form>
  )
}
