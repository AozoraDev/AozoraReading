import { z } from "zod"

const MAX_CHAPTER_FILE_SIZE = 50 * 1024 * 1024

function isTxtFile(file: File): boolean {
  return file.name.toLowerCase().endsWith(".txt") || file.type === "text/plain"
}

export const addChapterFormSchema = z.object({
  novel_id: z
    .string()
    .trim()
    .min(1, { message: "novelIdRequired" })
    .regex(/^\d+$/, { message: "novelIdInvalid" }),
  chapter_file: z
    .custom<FileList | undefined>((value) => value === undefined || value instanceof FileList)
    .refine((files) => files !== undefined && files.length > 0, { message: "fileRequired" })
    .refine((files) => {
      const file = files?.[0]
      return file ? isTxtFile(file) : false
    }, { message: "invalidFileType" })
    .refine((files) => (files?.[0]?.size ?? 0) <= MAX_CHAPTER_FILE_SIZE, {
      message: "fileTooLarge",
    }),
})

export type AddChapterFormValues = z.infer<typeof addChapterFormSchema>

export type AddChapterSubmitPayload = {
  novel_id: string
  chapter_file: File
}

export function toAddChapterSubmitPayload(values: AddChapterFormValues): AddChapterSubmitPayload {
  const chapterFile = values.chapter_file?.item(0)
  if (!chapterFile) {
    throw new Error("Chapter file is required")
  }

  return {
    novel_id: values.novel_id,
    chapter_file: chapterFile,
  }
}
