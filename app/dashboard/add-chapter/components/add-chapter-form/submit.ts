import { addChapterAction } from "@/app/dashboard/server/addChapterAction"
import type { AddChapterSubmitPayload } from "@/app/dashboard/add-chapter/schema"

export async function submitAddChapter(payload: AddChapterSubmitPayload): Promise<string> {
  const formData = new FormData()
  formData.append("novel_id", payload.novel_id)
  formData.append("chapter_file", payload.chapter_file)

  const result = await addChapterAction(formData)

  if (!result.success) {
    throw new Error(result.message)
  }

  return result.message
}
