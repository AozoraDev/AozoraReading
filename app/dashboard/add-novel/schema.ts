import { z } from "zod"

const ACCEPTED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "image/avif",
  "image/tiff",
])

const COVER_STORAGE_PATH_PATTERN = /^cover\/.+/

export const addNovelFormSchema = z.object({
  title: z.string().trim().min(1, { message: "titleRequired" }),
  author: z.string().trim().min(1, { message: "authorRequired" }),
  cover_url: z
    .string()
    .trim()
    .min(1, { message: "coverUrlRequired" })
    .regex(COVER_STORAGE_PATH_PATTERN, { message: "coverUrlInvalidFormat" }),
  cover: z
    .custom<FileList | undefined>((value) => value === undefined || value instanceof FileList)
    .refine((files) => files !== undefined && files.length > 0, { message: "coverRequired" })
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.has(files?.[0]?.type ?? ""),
      { message: "invalidImageType" }
    ),
})

export type AddNovelFormValues = z.infer<typeof addNovelFormSchema>

export type AddNovelSubmitPayload = {
  title: string
  author: string
  cover_url: string
  cover: File
}

export function toAddNovelSubmitPayload(values: AddNovelFormValues): AddNovelSubmitPayload {
  const coverFile = values.cover?.item(0)
  if (!coverFile) {
    throw new Error("Cover file is required")
  }

  return {
    title: values.title,
    author: values.author,
    cover_url: values.cover_url,
    cover: coverFile,
  }
}
