import { addNovelAction } from "@/app/dashboard/server/addNovelAction"
import type { AddNovelSubmitPayload } from "@/app/dashboard/add-novel/schema"

export async function submitAddNovel(payload: AddNovelSubmitPayload): Promise<void> {
  const formData = new FormData()
  formData.append("title", payload.title)
  formData.append("author", payload.author)
  formData.append("cover_url", payload.cover_url)
  formData.append("cover", payload.cover)

  const result = await addNovelAction(formData)

  if (!result.success) {
    throw new Error(result.message)
  }
}
